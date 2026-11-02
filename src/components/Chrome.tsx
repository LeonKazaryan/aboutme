"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { stageIds } from "@/content/copy";
import { useLang } from "@/lib/lang";
import { gsap, scrollToTarget } from "@/lib/motion";
import { callSeconds, formatClock, useDeal } from "@/lib/store";

/** The language switch: a rocker, and the new language dials in from it. */
export function LangToggle() {
  const { t, lang, setLang } = useLang();
  return (
    <button
      type="button"
      className="lang"
      role="switch"
      aria-checked={lang === "ru"}
      aria-label={t.nav.language}
      data-cursor={lang === "en" ? "RU" : "EN"}
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        setLang(lang === "en" ? "ru" : "en", {
          x: box.left + box.width / 2,
          y: box.top + box.height / 2,
        });
      }}
    >
      <span className="lang__thumb" aria-hidden="true" />
      <span className="lang__label" data-on={lang === "en"} aria-hidden="true">
        EN
      </span>
      <span className="lang__label" data-on={lang === "ru"} aria-hidden="true">
        RU
      </span>
    </button>
  );
}

function jump(event: React.MouseEvent, target: string, duration = 2.2) {
  event.preventDefault();
  scrollToTarget(target, duration);
}

export function Header() {
  const { t } = useLang();
  const stage = useDeal((s) => s.stage);
  const ink = useDeal((s) => s.ink);
  return (
    <header className="bar" data-ink={ink}>
      <a className="bar__mark" href="#top" onClick={(e) => jump(e, "#top")} aria-label={t.nav.home}>
        {t.hero.first} {t.hero.last}
      </a>
      <nav className="pipe" aria-label={t.nav.pipeline}>
        <ol>
          {t.stages.map((label, i) => (
            <li key={stageIds[i]} data-done={i < stage} data-now={i === stage}>
              <a
                href={`#${stageIds[i]}`}
                aria-current={i === stage ? "step" : undefined}
                onClick={(e) => jump(e, `#${stageIds[i]}`)}
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="bar__end">
        <LangToggle />
        <Link className="bar__cv" href="/cv">
          {t.nav.cv}
        </Link>
      </div>
    </header>
  );
}

export function CallClock({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const tick = () => {
      if (ref.current) ref.current.textContent = formatClock(callSeconds());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span ref={ref} className={className}>
      00:00
    </span>
  );
}

/** Live card for the deal: the page is a CRM record and this is its header. */
export function DealCard() {
  const { t, lang } = useLang();
  const stage = useDeal((s) => s.stage);
  const prize = useDeal((s) => s.prize);
  const closed = useDeal((s) => s.closed);
  const prizeRef = useRef<HTMLElement>(null);
  const shown = useRef({ value: 0 });

  useEffect(() => {
    const format = new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US");
    const write = () => {
      if (prizeRef.current) {
        prizeRef.current.textContent = `${format.format(Math.round(shown.current.value))} ₸`;
      }
    };
    write();
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = gsap.to(shown.current, {
      value: prize,
      duration: calm ? 0 : 1.4,
      ease: "power3.out",
      onUpdate: write,
      onComplete: write,
    });
    return () => {
      tween.kill();
    };
  }, [prize, lang]);

  const label = closed ? t.deal.closed : t.stages[Math.max(stage, 0)];

  return (
    <aside className="deal" data-ui data-live={stage >= 0} data-closed={closed} aria-label={t.deal.label}>
      <div className="deal__bars" aria-hidden="true">
        {t.stages.map((_, i) => (
          <span key={i} data-on={closed || i <= stage} />
        ))}
      </div>
      <button type="button" className="deal__stage" popoverTarget="pipe-menu" aria-label={t.deal.open}>
        <span>{t.deal.name}</span>
        <strong>{label}</strong>
      </button>
      <dl className="deal__facts">
        <div>
          <dt>{t.deal.call}</dt>
          <dd>
            <CallClock />
          </dd>
        </div>
        <div>
          <dt>{t.deal.prize}</dt>
          <dd>
            <strong ref={prizeRef}>0 ₸</strong>
          </dd>
        </div>
      </dl>
      <nav id="pipe-menu" className="deal__menu" popover="auto" aria-label={t.nav.pipeline}>
        <ol>
          {t.stages.map((name, i) => (
            <li key={stageIds[i]}>
              <a
                href={`#${stageIds[i]}`}
                onClick={(e) => {
                  (document.getElementById("pipe-menu") as HTMLElement | null)?.hidePopover();
                  jump(e, `#${stageIds[i]}`);
                }}
              >
                {name}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

/** A softphone boot: short, skippable, once a session, over real work. */
export function Boot() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || getComputedStyle(el).display === "none") return;
    const lines = el.querySelectorAll("li");
    const started = performance.now();
    const finish = () => {
      try {
        sessionStorage.setItem("booted", "1");
      } catch {}
      gsap.to(el, {
        yPercent: -100,
        duration: 0.36,
        ease: "power3.inOut",
        onComplete: () => setGone(true),
      });
    };

    gsap.to(lines, { autoAlpha: 1, duration: 0.01, stagger: 0.1 });
    const ready = Promise.race([
      document.fonts.ready,
      new Promise((done) => setTimeout(done, 900)),
    ]);
    let cancelled = false;
    ready.then(() => {
      const left = Math.max(0, 680 - (performance.now() - started));
      setTimeout(() => {
        if (!cancelled) finish();
      }, left);
    });
    const skip = () => {
      cancelled = true;
      finish();
    };
    el.addEventListener("click", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      cancelled = true;
      el.removeEventListener("click", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={ref} className="boot" aria-hidden="true">
      <pre>
        <ol>
          {t.boot.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </pre>
    </div>
  );
}

/** A dot that grows into a labelled pill over anything marked data-cursor. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const el = ref.current;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || !fine || calm) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    const x = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      el.dataset.on = "true";
    };
    const over = (e: PointerEvent) => {
      const node = e.target as Element;
      const tagged = node.closest("[data-cursor]");
      setLabel(tagged?.getAttribute("data-cursor") ?? "");
      el.dataset.link = String(Boolean(node.closest("a, button")));
    };
    const leave = () => {
      el.dataset.on = "false";
    };

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-on="false" data-label={Boolean(label)} aria-hidden="true">
      <span className="cursor__body">{label}</span>
    </div>
  );
}
