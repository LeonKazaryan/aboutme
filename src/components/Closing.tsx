"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { links } from "@/content/copy";
import { cutouts } from "@/content/photos";
import { playConnect, playKey } from "@/lib/dtmf";
import { useLang } from "@/lib/lang";
import { gsap, scrollToTarget, useScene } from "@/lib/motion";
import { setDeal } from "@/lib/store";
import { Lines } from "./Pic";
import { openTerminal } from "./Terminal";

export function Projects() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);

  useScene(scope, ({ q }) => {
    q(".row__name").forEach((el, i) => {
      gsap.fromTo(
        el,
        { x: i % 2 ? 90 : -90 },
        {
          x: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 55%", scrub: true },
        },
      );
    });
  });

  return (
    <section ref={scope} className="projects" data-ink="dark" aria-label={t.projects.title}>
      <Lines lines={[t.projects.title]} className="head" />
      <ul className="rows">
        {t.projects.rows.map((row) => (
          <li key={row.name}>
            <a href={row.href} target="_blank" rel="noreferrer" data-cursor={t.projects.open}>
              <span className="row__name">{row.name}</span>
              <span className="row__note">{row.note}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="projects__stack">
        <Lines lines={[t.projects.stackTitle]} as="h3" className="head" />
        <dl>
          {t.projects.stack.map(([label, value], i) => (
            <div key={i} data-rise style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const keypad: Array<[string, string]> = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  ["*", ""],
  ["0", "+"],
  ["#", ""],
];

const stageByYear: Record<string, string> = { "2022": "#lead", "2025": "#demo", "2026": "#won" };

export function Contact() {
  const { t, lang } = useLang();
  const c = t.contact;
  const scope = useRef<HTMLElement>(null);
  const [digits, setDigits] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const press = (key: string) => {
    playKey(key);
    setMessage(null);
    setDigits((value) => (value + key).slice(-12));
  };

  const call = () => {
    if (digits === "4473") {
      playConnect();
      setDeal({ closed: true });
      setMessage(c.states.hire);
      const mail = `${links.email}?subject=${encodeURIComponent(c.mailSubject)}&body=${encodeURIComponent(c.mailBody)}`;
      setTimeout(() => window.open(mail, "_self"), 900);
    } else if (digits === "5366") {
      playConnect();
      setMessage(c.states.leon);
    } else if (stageByYear[digits]) {
      setMessage(`${c.states.jump} ${digits}`);
      setTimeout(() => scrollToTarget(stageByYear[digits], 3), 500);
    } else {
      setMessage(c.states.wrong);
    }
    setDigits("");
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const section = scope.current;
      if (!section || (event.target as Element).closest("input, dialog")) return;
      const box = section.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight * 0.6) return;
      if (/^[0-9*#]$/.test(event.key)) press(event.key);
      if (event.key === "Backspace") setDigits((value) => value.slice(0, -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useScene(scope, ({ q }) => {
    gsap.fromTo(
      q(".dial"),
      { yPercent: 30, rotation: 6 },
      {
        yPercent: 0,
        rotation: 0,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top bottom", end: "top 20%", scrub: true },
      },
    );
  });

  return (
    <section id="contact" ref={scope} className="contact" data-stage="6" data-ink="dark">
      <Lines lines={[c.title]} className="contact__title" />
      <div className="contact__copy">
        <p data-rise>{c.body}</p>
        <ul className="contact__lines">
          {c.lines.map((line, i) => (
            <li key={i} data-rise style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <a
                href={line.href}
                target={line.href.startsWith("http") ? "_blank" : undefined}
                rel={line.href.startsWith("http") ? "noreferrer" : undefined}
                data-cursor={t.cursor.open}
              >
                <span>{line.label}</span>
                <strong>{line.value}</strong>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <Image
        className="contact__leon"
        src={cutouts.laptop.src}
        width={cutouts.laptop.w}
        height={cutouts.laptop.h}
        alt={lang === "ru" ? "Леон улыбается с ноутбуком в руках" : "Leon smiling with a laptop in his hands"}
        sizes="(max-width: 760px) 0px, 24vw"
      />

      <div className="dial__wrap">
        <div className="dial" data-ui>
          <output className="dial__screen" aria-live="polite">
            <span>{message ?? (digits || c.placeholder)}</span>
          </output>
          <div className="dial__keys">
            {keypad.map(([key, letters]) => (
              <button type="button" key={key} onClick={() => press(key)} data-cursor={t.cursor.dial} aria-label={letters ? `${key} ${letters}` : key}>
                <strong>{key}</strong>
                <span>{letters}</span>
              </button>
            ))}
          </div>
          <div className="dial__end">
            <button type="button" className="dial__call" onClick={call} disabled={!digits}>
              {c.call}
            </button>
            <button
              type="button"
              className="dial__clear"
              aria-label={c.clear}
              onClick={() => setDigits((value) => value.slice(0, -1))}
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="foot" data-ink="dark">
      <div className="foot__row">
        <p>{t.footer.built}</p>
        <button type="button" onClick={openTerminal} data-cursor=">_">
          {t.footer.console}
        </button>
      </div>
      <p className="foot__name" aria-hidden="true">
        {t.hero.first} {t.hero.last}
      </p>
    </footer>
  );
}
