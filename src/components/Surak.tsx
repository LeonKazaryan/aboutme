"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { links } from "@/content/copy";
import data from "@/content/surak-queries.json";
import { useLang } from "@/lib/lang";
import { ScrollTrigger, gsap, scrollToTarget, useScene } from "@/lib/motion";
import {
  DIMS,
  byMeaning,
  decodeVector,
  fuseRankings,
  loadKb,
  passageVector,
  similarities,
  type Kb,
} from "@/lib/vectors";
import { Lines } from "./Pic";

const TOPIC_COLORS = ["#58a82c", "#8f73e8", "#e4507a", "#2c90d8", "#c08520"];
const COLS = 24;
const ROWS = 16;
const NEIGHBOURS = 8;

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (t: number) => 1 - (1 - t) ** 3;
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type Selected = { kind: "preset"; index: number } | { kind: "point"; id: number };
type Row = { id: number; place: string; topic: string; text: string; url: string; sim: number | null };
type SeedRow = { place: string[]; topic: string; url: string; text: string; sim: number };

function Mark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M8 5v14l11-7z" />
    </svg>
  );
}

function SurakIntro() {
  const { t, lang } = useLang();
  const s = t.surak;
  const scope = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [typed, setTyped] = useState(0);

  useScene(scope, ({ q }) => {
    gsap.fromTo(
      q(".surak__letter"),
      { yPercent: 104 },
      {
        yPercent: 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: scope.current, start: "top 82%", end: "top 12%", scrub: true },
      },
    );
    gsap.fromTo(
      q(".surak__mascot"),
      { yPercent: 40, rotation: 9 },
      {
        yPercent: 0,
        rotation: -3,
        ease: "none",
        scrollTrigger: { trigger: q(".reel")[0], start: "top bottom", end: "top 30%", scrub: true },
      },
    );
    gsap.fromTo(
      q(".reel"),
      { scale: 0.86 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: q(".reel")[0], start: "top bottom", end: "top 40%", scrub: true },
      },
    );
    const state = { n: 0 };
    gsap.to(state, {
      n: s.ask.length,
      duration: 1.4,
      ease: "none",
      onUpdate: () => setTyped(Math.round(state.n)),
      scrollTrigger: { trigger: q(".surak__ask")[0], start: "top 88%", once: true },
    });
  });

  return (
    <section ref={scope} className="surak" data-ink="dark" aria-label={s.name}>
      <h2 className="surak__name" aria-label={s.name}>
        {[..."1surak"].map((letter, i) => (
          <span className="surak__clip" key={i} aria-hidden="true">
            <span className="surak__letter">{letter}</span>
          </span>
        ))}
      </h2>

      <div className="surak__row">
        <div className="surak__copy">
          <p className="surak__lead" data-rise>
            {s.lead}
          </p>
          <p data-rise style={{ "--d": "80ms" } as React.CSSProperties}>
            {s.body}
          </p>
          <button
            type="button"
            className="surak__ask"
            data-ui
            data-rise
            data-cursor={s.plan}
            onClick={() => scrollToTarget("#surak-search", 1.8)}
          >
            <span>{typed > 0 ? s.ask.slice(0, typed) : s.ask}</span>
            <strong>{s.plan}</strong>
          </button>
          <p className="surak__origin" data-rise style={{ "--d": "160ms" } as React.CSSProperties}>
            {s.origin}
          </p>
        </div>

        <div className="surak__stage">
          <Image
            className="surak__mascot"
            src="/surak/mascot.webp"
            width={480}
            height={480}
            alt={lang === "ru" ? "Маскот 1surak: розовый кролик в очках и гавайской рубашке" : "The 1surak mascot: a pink rabbit in sunglasses and a Hawaiian shirt"}
            sizes="(max-width: 760px) 34vw, 16vw"
          />
          <figure className="reel">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${links.surakVideoId}?autoplay=1&rel=0`}
                title={s.videoTitle}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(true)} data-cursor={s.play} aria-label={s.play}>
                <Image src="/surak/demo-poster.webp" width={1280} height={720} alt="" sizes="(max-width: 760px) 92vw, 58vw" />
                <span className="reel__disc">
                  <Mark />
                </span>
              </button>
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}

type Live = {
  p: number;
  blend: number;
  overlay: "side" | "top" | "none";
  kb: Kb | null;
  vector: Int8Array;
  at: number[];
  from: number[];
  near: number[];
  sims: Float32Array | null;
  hover: number | null;
  you: string;
  lang: "en" | "ru";
  rect: { x: number; y: number; w: number; h: number };
};

function VectorSearch() {
  const { t, lang } = useLang();
  const s = t.surak.search;
  const scope = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [kb, setKb] = useState<Kb | null>(null);
  const [selected, setSelected] = useState<Selected>({ kind: "preset", index: 0 });
  const [step, setStep] = useState(3);
  const [hover, setHover] = useState<{ id: number; x: number; y: number } | null>(null);

  const preset = selected.kind === "preset" ? data.queries[selected.index] : null;
  const vector = useMemo(
    () => (preset ? decodeVector(preset.v[lang]) : passageVector(kb!, selected.kind === "point" ? selected.id : 0)),
    [preset, lang, kb, selected],
  );
  const words = useMemo(() => {
    if (!kb) return data.seed[lang].words;
    return preset ? preset.words[lang] : [];
  }, [kb, preset, lang]);
  const sims = useMemo(() => (kb ? similarities(kb, vector) : null), [kb, vector]);
  const meaning = useMemo(() => (sims ? byMeaning(sims) : data.seed[lang].meaning), [sims, lang]);
  const fused = useMemo(
    () => (kb ? fuseRankings(meaning, words) : data.seed[lang].fused.map((id) => ({ id, score: 0 }))),
    [kb, meaning, words, lang],
  );

  const row = useCallback(
    (id: number): Row => {
      if (!kb) {
        const seed = (data.seed[lang].rows as unknown as Record<string, SeedRow>)[id];
        return { id, place: seed.place[lang === "ru" ? 1 : 0], topic: seed.topic, text: seed.text, url: seed.url, sim: seed.sim };
      }
      const [place, topic, source, , , text] = kb.items[id];
      return {
        id,
        place: kb.places[place][lang === "ru" ? 1 : 0],
        topic: data.topics[topic],
        text,
        url: kb.sources[source],
        sim: sims ? sims[id] : null,
      };
    },
    [kb, lang, sims],
  );

  const live = useRef<Live>({
    p: 1,
    blend: 1,
    overlay: "none",
    kb: null,
    vector,
    at: data.queries[0].at.en,
    from: data.queries[0].at.en,
    near: [],
    sims: null,
    hover: null,
    you: s.you,
    lang,
    rect: { x: 0, y: 0, w: 0, h: 0 },
  });

  const draw = useCallback(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const v = live.current;
    const scale = Math.min(devicePixelRatio, 2);
    const W = el.clientWidth;
    const H = el.clientHeight;
    if (!W || !H) return;
    if (el.width !== Math.round(W * scale) || el.height !== Math.round(H * scale)) {
      el.width = Math.round(W * scale);
      el.height = Math.round(H * scale);
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const grid = clamp((v.p + 0.05) / 0.2);
    const gather = ease(clamp((v.p - 0.2) / 0.1));
    const bloom = ease(clamp((v.p - 0.24) / 0.16));
    const reach = ease(clamp((v.p - 0.4) / 0.12));
    const shift = v.overlay === "none" ? 0 : ease(clamp((v.p - 0.58) / 0.14));

    const pad = 26;
    const full = { x: pad, y: pad, w: W - pad * 2, h: H - pad * 2 };
    const small =
      v.overlay === "side"
        ? { x: pad, y: pad, w: W * 0.5 - pad * 1.5, h: H - pad * 2 }
        : { x: pad, y: 14, w: W - pad * 2, h: H * 0.34 - 18 };
    const rect = {
      x: mix(full.x, small.x, shift),
      y: mix(full.y, small.y, shift),
      w: mix(full.w, small.w, shift),
      h: mix(full.h, small.h, shift),
    };
    v.rect = rect;
    const px = (x: number) => rect.x + (x / 1000) * rect.w;
    const py = (y: number) => rect.y + (y / 1000) * rect.h;
    const qx = px(mix(v.from[0], v.at[0], v.blend));
    const qy = py(mix(v.from[1], v.at[1], v.blend));

    // The message as its 384 real numbers, gathering into one point.
    if (gather < 1) {
      const cell = Math.min((W - 40) / COLS, (H - 40) / ROWS);
      const startX = (W - cell * COLS) / 2;
      const startY = (H - cell * ROWS) / 2;
      const shown = Math.floor(DIMS * ease(grid));
      const withText = cell >= 30;
      ctx.font = `500 ${Math.round(cell * 0.3)}px var(--font-code), monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < shown; i++) {
        const value = v.vector[i] / data.scale;
        const strength = Math.min(1, Math.abs(value) / 0.14);
        const col = i % COLS;
        const line = Math.floor(i / COLS);
        const t = ease(clamp(gather * 1.5 - (i % 40) / 80));
        const size = (cell - 3) * (1 - t) + 6 * t;
        const x = mix(startX + col * cell + 1.5, qx - 3, t);
        const y = mix(startY + line * cell + 1.5, qy - 3, t);
        ctx.globalAlpha = (0.16 + strength * 0.84) * (1 - t * 0.6);
        ctx.fillStyle = value >= 0 ? "#adef81" : "#ff9eb0";
        ctx.fillRect(x, y, size, size);
        if (withText && gather === 0 && grid === 1) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#07185a";
          ctx.fillText(value.toFixed(2).replace("0.", "."), x + size / 2, y + size / 2);
        }
      }
      ctx.globalAlpha = 1;
    }

    // Every passage, blooming out of the point where the message landed.
    if (v.kb && bloom > 0) {
      const { items } = v.kb;
      const near = new Set(v.near);
      for (let id = 0; id < items.length; id++) {
        const item = items[id];
        const delay = (id % 50) / 110;
        const t = ease(clamp((bloom - delay) / (1 - delay)));
        if (t <= 0) continue;
        const x = mix(qx, px(item[3]), t);
        const y = mix(qy, py(item[4]), t);
        ctx.globalAlpha = near.has(id) ? 0.25 : 0.82;
        ctx.fillStyle = TOPIC_COLORS[item[1]];
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // The nearest passages by cosine, reached one line at a time.
      v.near.forEach((id, index) => {
        const t = clamp(reach * 1.6 - index * 0.08) * v.blend;
        if (t <= 0) return;
        const item = items[id];
        const x = px(item[3]);
        const y = py(item[4]);
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(mix(qx, x, t), mix(qy, y, t));
        ctx.stroke();
        ctx.globalAlpha = 1;
        if (t < 1) return;
        ctx.fillStyle = TOPIC_COLORS[item[1]];
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      if (reach === 1 && W > 480) {
        ctx.font = "600 13px var(--font-text), sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        v.near.slice(0, 3).forEach((id) => {
          const item = items[id];
          const label = `${v.kb!.places[item[0]][v.lang === "ru" ? 1 : 0].split(" (")[0]}  ${v.sims ? v.sims[id].toFixed(2) : ""}`;
          const width = ctx.measureText(label).width + 12;
          const x = Math.min(px(item[3]) + 10, W - width - 6);
          const y = py(item[4]);
          ctx.fillStyle = "#07185a";
          ctx.fillRect(x, y - 11, width, 22);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, x + 6, y);
        });
      }

      if (v.hover !== null) {
        const item = items[v.hover];
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px(item[3]), py(item[4]), 7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // The message itself.
    if (gather > 0 || !v.kb) {
      ctx.fillStyle = "#adef81";
      ctx.strokeStyle = "#07185a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(qx, qy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (W > 480) {
        ctx.font = "700 13px var(--font-text), sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const width = ctx.measureText(v.you).width + 12;
        const x = Math.min(qx + 14, W - width - 6);
        ctx.fillStyle = "#adef81";
        ctx.fillRect(x, qy - 12, width, 24);
        ctx.fillStyle = "#07185a";
        ctx.fillText(v.you, x + 6, qy);
      }
    }
  }, []);

  useEffect(() => {
    const v = live.current;
    v.kb = kb;
    v.vector = vector;
    v.sims = sims;
    v.near = meaning.slice(0, NEIGHBOURS);
    v.you = selected.kind === "preset" ? s.you : s.passage;
    v.lang = lang;
    const target = preset ? preset.at[lang] : kb ? kb.items[selected.kind === "point" ? selected.id : 0].slice(3, 5) as number[] : v.at;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    v.from = [mix(v.from[0], v.at[0], v.blend), mix(v.from[1], v.at[1], v.blend)];
    v.at = target;
    v.blend = 0;
    const tween = gsap.to(v, { blend: 1, duration: calm ? 0 : 0.7, ease: "power2.inOut", onUpdate: draw, onComplete: draw });
    return () => {
      tween.kill();
    };
  }, [kb, vector, sims, meaning, preset, lang, selected, s.you, s.passage, draw]);

  useEffect(() => {
    const element = scope.current;
    if (!element) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        loadKb().then(setKb).catch(() => {});
      },
      { rootMargin: "120% 0px" },
    );
    near.observe(element);
    const resize = () => draw();
    addEventListener("resize", resize);
    document.fonts.ready.then(draw);
    return () => {
      near.disconnect();
      removeEventListener("resize", resize);
    };
  }, [draw]);

  useScene(scope, ({ phone, q }) => {
    const v = live.current;
    v.overlay = phone ? "top" : "side";
    const sync = (progress: number) => {
      v.p = progress;
      draw();
      setStep(progress < 0.24 ? 0 : progress < 0.56 ? 1 : progress < 0.8 ? 2 : 3);
    };
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scope.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => sync(self.progress),
      },
    });
    tl.fromTo(
      q(".vec__results"),
      phone ? { yPercent: 112 } : { xPercent: 112 },
      { xPercent: 0, yPercent: 0, duration: 0.14, ease: "power2.out" },
      0.6,
    ).to({}, { duration: 0.26 }, 0.74);
    // Not the trigger's own progress: it isn't measured yet when a language change rebuilds the scene.
    const box = scope.current!.getBoundingClientRect();
    sync(clamp(-box.top / (box.height - innerHeight)));
  });

  const nearest = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const v = live.current;
    if (!v.kb || v.p < 0.4) return null;
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    let best: number | null = null;
    let distance = 18 ** 2;
    v.kb.items.forEach((item, id) => {
      const dx = v.rect.x + (item[3] / 1000) * v.rect.w - x;
      const dy = v.rect.y + (item[4] / 1000) * v.rect.h - y;
      const d = dx * dx + dy * dy;
      if (d < distance) {
        distance = d;
        best = id;
      }
    });
    if (best === null) return null;
    return { id: best as number, x: Math.min(x, box.width - 296), y: Math.min(y, box.height - 130) };
  };

  const topicName = (topic: string) => t.surak.topics[topic as keyof typeof t.surak.topics];
  const shown = selected.kind === "preset" ? data.queries[selected.index].text[lang] : `${row(selected.id).place}: ${row(selected.id).text}`;
  const top = fused.slice(0, 3);
  const inBoth = new Set(meaning.filter((id) => words.includes(id)));
  const tip = hover ? row(hover.id) : null;

  return (
    <section id="surak-search" ref={scope} className="vec" data-ink="light" aria-label={s.title.join(" ")}>
      <div className="vec__stage">
        <div className="vec__side">
          <Lines lines={s.title} as="h3" className="vec__title" />
          <div className="vec__composer" data-ui>
            <p aria-live="polite">{shown}</p>
          </div>
          <div className="vec__chips" role="group" aria-label={s.chips}>
            {s.presets.map((label, index) => (
              <button
                type="button"
                key={label}
                aria-pressed={selected.kind === "preset" && selected.index === index}
                onClick={() => setSelected({ kind: "preset", index })}
              >
                {label}
              </button>
            ))}
          </div>
          <ol className="vec__steps">
            {s.steps.map((item, i) => (
              <li key={item.title} data-on={i === step}>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="vec__count">{s.count.replace("{n}", String(step + 1))}</p>
        </div>

        <div className="vec__panel" data-ui>
          <canvas
            ref={canvas}
            aria-label={s.mapLabel}
            role="img"
            data-cursor={s.dot}
            onPointerMove={(event) => {
              const found = nearest(event);
              live.current.hover = found?.id ?? null;
              setHover(found);
              draw();
            }}
            onPointerLeave={() => {
              live.current.hover = null;
              setHover(null);
              draw();
            }}
            onClick={(event) => {
              const found = nearest(event);
              if (found) setSelected({ kind: "point", id: found.id });
            }}
          />
          {tip && hover ? (
            <div className="vec__tip" style={{ left: hover.x, top: hover.y }}>
              <strong>
                {tip.place}, {topicName(tip.topic)}
              </strong>
              <span>{tip.text}</span>
            </div>
          ) : null}
          <ul className="vec__legend" aria-label={s.legend}>
            {data.topics.map((topic, i) => (
              <li key={topic}>
                <i style={{ background: TOPIC_COLORS[i] }} aria-hidden="true" />
                {topicName(topic)}
              </li>
            ))}
          </ul>

          <div className="vec__results">
            <div className="vec__lists">
              <div>
                <h4>{s.byMeaning}</h4>
                <ol>
                  {meaning.slice(0, 3).map((id) => {
                    const item = row(id);
                    return (
                      <li key={id}>
                        <span>{item.place.split(" (")[0]}</span>
                        <b>{item.sim?.toFixed(2)}</b>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div>
                <h4>{s.byWords}</h4>
                {words.length ? (
                  <ol>
                    {words.slice(0, 3).map((id) => (
                      <li key={id}>
                        <span>{row(id).place.split(" (")[0]}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>{s.noWords}</p>
                )}
              </div>
            </div>
            <h4>{s.fused}</h4>
            <ol className="vec__fused">
              {top.map(({ id, score }) => {
                const item = row(id);
                return (
                  <li key={id}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <strong>{item.place}</strong>
                      <span>
                        {topicName(item.topic)}
                        {score ? `, RRF ${score.toFixed(4)}` : ""}
                        {inBoth.has(id) ? `, ${s.both}` : ""}
                      </span>
                      <em>{item.text}</em>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
        <p className="vec__note">{s.note}</p>
      </div>
    </section>
  );
}

function SurakProof() {
  const { t, lang } = useLang();
  const p = t.surak.proof;
  const scope = useRef<HTMLElement>(null);

  useScene(scope, ({ q }) => {
    const format = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US");
    q(".figs strong").forEach((el, i) => {
      const value = p.figures[i].value;
      const state = { n: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(state, {
            n: value,
            duration: 1.2,
            delay: i * 0.07,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = format.format(Math.round(state.n));
            },
          }),
      });
    });
    q(".shots figure").forEach((shot, i) => {
      gsap.fromTo(
        shot,
        { yPercent: [10, 22, 6, 28][i] },
        {
          yPercent: [-4, -8, -2, -12][i],
          ease: "none",
          scrollTrigger: { trigger: q(".shots")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });

  const format = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US");

  return (
    <section ref={scope} className="proof" data-ink="dark" aria-label={p.title.join(" ")}>
      <div className="proof__head">
        <Lines lines={p.title} as="h3" className="proof__title" />
        <p data-rise>{p.body}</p>
      </div>

      <ul className="figs">
        {p.figures.map((figure, i) => (
          <li key={i} data-rise style={{ "--d": `${i * 50}ms` } as React.CSSProperties}>
            <strong>{format.format(figure.value)}</strong>
            <span>{figure.label}</span>
          </li>
        ))}
      </ul>

      <div className="shots">
        {p.shots.map((shot, i) => (
          <figure key={i} data-tall={shot.src === "mobile"}>
            <Image
              src={`/surak/${shot.src}.webp`}
              width={shot.src === "mobile" ? 700 : 1280}
              height={shot.src === "mobile" ? 1544 : shot.src === "destinations" || shot.src === "plan" ? 900 : 1000}
              alt={shot.alt}
              sizes="(max-width: 760px) 92vw, 34vw"
            />
            <figcaption>{shot.alt}</figcaption>
          </figure>
        ))}
      </div>

      <div className="proof__end">
        <dl>
          {p.stack.map(([label, value], i) => (
            <div key={i} data-rise style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <ul className="proof__links">
          {p.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer" data-cursor={t.cursor.open}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Surak() {
  return (
    <>
      <SurakIntro />
      <VectorSearch />
      <SurakProof />
    </>
  );
}
