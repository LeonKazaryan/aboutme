"use client";

import { useEffect, useRef, useState } from "react";
import { links } from "@/content/copy";
import { photos, type PhotoKey } from "@/content/photos";
import { useLang } from "@/lib/lang";
import { ScrollTrigger, gsap, useScene } from "@/lib/motion";
import { Pic } from "./Pic";

const roll: PhotoKey[] = ["hackBanner", "hackStage", "hackNight"];

/** A photo that resolves out of noise, the way an AI video tile does. */
function GenTile({ id, run, delay }: { id: PhotoKey; run: number; delay: number }) {
  const { t } = useLang();
  const canvas = useRef<HTMLCanvasElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  useEffect(() => {
    if (!run) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const image = new window.Image();
    const small = document.createElement("canvas");
    const smallCtx = small.getContext("2d");
    const progress = { p: 0 };
    let tween: gsap.core.Tween | undefined;

    image.onload = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      el.width = W;
      el.height = H;
      const scale = Math.max(W / image.width, H / image.height);
      const sw = W / scale;
      const sh = H / scale;
      const sx = (image.width - sw) / 2;
      const sy = (image.height - sh) / 2;
      ctx.fillStyle = "#1a1d20";
      ctx.fillRect(0, 0, W, H);
      setState("busy");
      tween = gsap.to(progress, {
        p: 1,
        delay,
        duration: 1.9,
        ease: "power1.inOut",
        onUpdate: () => {
          const cells = Math.round(5 * Math.pow(70, progress.p));
          small.width = cells;
          small.height = Math.max(1, Math.round((cells * H) / W));
          smallCtx?.drawImage(image, sx, sy, sw, sh, 0, 0, small.width, small.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(small, 0, 0, W, H);
          if (label.current) {
            label.current.textContent = `${t.hack.generating} ${Math.round(progress.p * 100)}%`;
          }
        },
        onComplete: () => setState("done"),
      });
    };
    image.src = photos[id].src;

    return () => {
      image.onload = null;
      tween?.kill();
    };
  }, [run, id, delay, t.hack.generating]);

  return (
    <div className="gen" data-state={state}>
      <Pic id={id} sizes="(max-width: 760px) 92vw, 34vw" />
      <canvas ref={canvas} aria-hidden="true" />
      <span ref={label} className="gen__tag" aria-hidden="true" />
    </div>
  );
}

function Telemetry() {
  const { t } = useLang();
  const values = [
    { label: t.hack.telemetry[0], value: "74 km/h", points: "0,30 16,26 32,28 48,18 64,20 80,12 96,14 112,8" },
    { label: t.hack.telemetry[1], value: "86 °C", points: "0,14 16,16 32,12 48,18 64,16 80,20 96,18 112,22" },
    { label: t.hack.telemetry[2], value: "62%", points: "0,28 16,20 32,24 48,12 64,18 64,18 80,10 96,16 112,12" },
  ];
  return (
    <div className="tele" data-ui>
      <header>
        <strong>TE33A</strong>
        <span>{t.hack.telemetryNote}</span>
      </header>
      <ul>
        {values.map((row) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <strong>{row.value}</strong>
            <svg viewBox="0 0 112 36" aria-hidden="true">
              <polyline points={row.points} pathLength="1" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HackNU() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);
  const [run, setRun] = useState(0);
  const [turn, setTurn] = useState(0);
  const [typed, setTyped] = useState(0);
  const prompt = t.hack.prompt;

  useScene(scope, ({ phone, q }) => {
    ScrollTrigger.create({
      trigger: q(".higgs__row")[0],
      start: "top 78%",
      once: true,
      onEnter: () => setRun((value) => value || 1),
    });

    const state = { n: 0 };
    gsap.to(state, {
      n: prompt.length,
      ease: "none",
      duration: 1.5,
      onUpdate: () => setTyped(Math.round(state.n)),
      scrollTrigger: { trigger: q(".higgs__prompt")[0], start: "top 86%", once: true },
    });

    if (!phone) {
      q(".higgs__col").forEach((col, i) => {
        gsap.fromTo(
          col,
          { yPercent: [10, -6, 14][i] },
          {
            yPercent: [-8, 8, -12][i],
            ease: "none",
            scrollTrigger: { trigger: q(".higgs__wall")[0], start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    }
    gsap.fromTo(
      q(".tele polyline"),
      { strokeDasharray: "1 1", strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: q(".tele")[0], start: "top 85%", end: "top 35%", scrub: true },
      },
    );
  });

  const generate = () => {
    setTurn((value) => value + 1);
    setRun((value) => value + 1);
  };

  const shown = typed > 0 ? prompt.slice(0, typed) : prompt;

  return (
    <section id="won" ref={scope} className="higgs" data-stage="4" data-prize="500000" data-ink="light">
      <header className="higgs__head">
        <div>
          <h2 data-rise="lines">
            {t.hack.title.map((line, i) => (
              <span className="mask" key={line}>
                <span style={{ "--i": i } as React.CSSProperties}>{line}</span>{" "}
              </span>
            ))}
          </h2>
          <p data-rise>{t.hack.sub}</p>
        </div>
        <a className="higgs__btn higgs__btn--ghost" href={links.raillens} target="_blank" rel="noreferrer" data-cursor={t.cursor.open}>
          {t.hack.repo}
        </a>
      </header>

      <div className="higgs__prompt">
        <span className="higgs__label">{t.hack.promptLabel}</span>
        <p aria-label={prompt}>
          <span aria-hidden="true">{shown}</span>
        </p>
        <button type="button" className="higgs__btn" onClick={generate}>
          {t.hack.generate}
        </button>
      </div>

      <div className="higgs__row">
        {t.hack.cards.map((card, i) => (
          <article key={card.title}>
            <GenTile id={roll[(i + turn) % roll.length]} run={run} delay={i * 0.25} />
            <h3>{card.title}</h3>
            <p>{card.note}</p>
          </article>
        ))}
      </div>

      <div className="higgs__wall">
        <div className="higgs__title">
          <h3>{t.hack.moreTitle}</h3>
          <p>{t.hack.moreNote}</p>
        </div>
        <div className="higgs__grid">
          <div className="higgs__col">
            <div className="higgs__prize">
              <strong>{t.hack.prize}</strong>
              <span>{t.hack.prizeNote}</span>
            </div>
            <Pic id="hackStage" sizes="(max-width: 760px) 92vw, 31vw" />
          </div>
          <div className="higgs__col">
            <Pic id="hackMirror" sizes="(max-width: 760px) 92vw, 31vw" />
            <div className="higgs__project">
              <h3>{t.hack.project}</h3>
              <p>{t.hack.projectBody}</p>
              <Telemetry />
            </div>
          </div>
          <div className="higgs__col">
            <Pic id="hackBanner" sizes="(max-width: 760px) 92vw, 31vw" />
            <Pic id="hackNight" sizes="(max-width: 760px) 92vw, 31vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
