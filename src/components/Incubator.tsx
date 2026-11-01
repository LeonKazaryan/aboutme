"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { links } from "@/content/copy";
import { cutouts, type PhotoKey } from "@/content/photos";
import { useLang } from "@/lib/lang";
import { gsap, useScene } from "@/lib/motion";
import { Lines, Pic } from "./Pic";

const WEEKS = 10;
const DAYS = 7;

// The nFactorial wall is a GitHub contribution graph, so the ten weeks are one too.
// Fixed shades so the server and the browser draw the same graph.
const shade = (i: number) => [2, 3, 1, 4, 2, 3, 4, 1, 3, 2, 4][(i * 7 + (i % 5)) % 11];

const seam: Array<{ left: PhotoKey; right: PhotoKey; leftInk: string; rightInk: string; href?: string }> = [
  { left: "certificates", right: "cohort", leftInk: "#0d1733", rightInk: "#ffffff" },
  { left: "laptop", right: "banner", leftInk: "#ffffff", rightInk: "#ffffff", href: links.chathut },
  { left: "demoWall", right: "demoStage", leftInk: "#1d3a1e", rightInk: "#ffffff" },
  { left: "pizza", right: "firstDay", leftInk: "#ffffff", rightInk: "#ffffff" },
];

export function Incubator() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);
  const count = WEEKS * DAYS;

  useScene(scope, ({ q }) => {
    gsap.fromTo(
      q(".weeks__cell"),
      { scale: 0.3, backgroundColor: "#e9ece6" },
      {
        scale: 1,
        backgroundColor: (_i: number, el: Element) => getComputedStyle(el).getPropertyValue("--fill"),
        ease: "none",
        stagger: { each: 1 },
        duration: 6,
        scrollTrigger: {
          trigger: q(".weeks")[0],
          start: "top 85%",
          end: "bottom 45%",
          scrub: true,
        },
      },
    );
  });

  return (
    <>
      <section id="demo" ref={scope} className="incub" data-stage="2" data-ink="dark">
        <div className="incub__copy">
          <Lines lines={t.incubator.title} className="head" />
          <p data-rise>{t.incubator.body}</p>
        </div>
        <figure className="weeks" aria-label={t.incubator.gridLabel}>
          <div className="weeks__grid">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="weeks__cell"
                data-last={i === count - 1}
                style={{ "--fill": `var(--pix-${shade(i)})` } as React.CSSProperties}
              />
            ))}
          </div>
          <figcaption>
            <span>{t.incubator.gridStart}</span>
            <span>{t.incubator.gridEnd}</span>
          </figcaption>
        </figure>
      </section>
      <Seam />
      <ChatDemo />
    </>
  );
}

function Seam() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);

  useScene(scope, ({ phone, q }) => {
    const items = q(".seam__item");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: true },
    });
    const travel = phone ? 22 : 30;
    items.forEach((item, i) => {
      const left = item.querySelector(".pane--l");
      const right = item.querySelector(".pane--r");
      const halfL = item.querySelector(".half--l");
      const halfR = item.querySelector(".half--r");
      const meta = item.querySelector(".seam__meta");
      if (i > 0) {
        tl.fromTo(left, { yPercent: 100 }, { yPercent: 0, duration: 1 }, i - 1)
          .fromTo(right, { yPercent: -100 }, { yPercent: 0, duration: 1 }, i - 1)
          .fromTo(halfL, { y: `${travel}svh`, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, i - 0.8)
          .fromTo(halfR, { y: `-${travel}svh`, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, i - 0.8)
          .fromTo(meta, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, i - 0.15);
      }
      if (i < items.length - 1) {
        tl.to(left, { yPercent: -100, duration: 1 }, i)
          .to(right, { yPercent: 100, duration: 1 }, i)
          .to(halfL, { y: `-${travel}svh`, autoAlpha: 0, duration: 0.7 }, i + 0.12)
          .to(halfR, { y: `${travel}svh`, autoAlpha: 0, duration: 0.7 }, i + 0.12)
          .to(meta, { autoAlpha: 0, duration: 0.14 }, i + 0.08);
      }
    });
  });

  return (
    <section ref={scope} className="seam" data-ink="solid" aria-label={t.incubator.seamLabel}>
      <div className="seam__stage">
        {seam.map((item, i) => {
          const copy = t.incubator.seam[i];
          return (
            <article className="seam__item" key={item.left} style={{ zIndex: i + 1 }}>
              <div className="pane pane--l">
                <Pic id={item.left} sizes="(max-width: 760px) 50vw, 50vw" />
              </div>
              <div className="pane pane--r">
                <Pic id={item.right} sizes="(max-width: 760px) 50vw, 50vw" />
              </div>
              <h3 className="seam__title">
                <span className="half half--l" style={{ color: item.leftInk }}>
                  {copy.title}
                </span>
                <span className="half half--r" style={{ color: item.rightInk }} aria-hidden="true">
                  {copy.title}
                </span>
              </h3>
              <div className="seam__meta">
                <p>{copy.meta}</p>
                {item.href && copy.link ? (
                  <a href={item.href} target="_blank" rel="noreferrer" data-cursor={t.cursor.open}>
                    {copy.link}
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ChatDemo() {
  const { t, lang } = useLang();
  const chat = t.incubator.chat;
  const [picked, setPicked] = useState<number | null>(null);
  const option = picked === null ? null : chat.options[picked];

  return (
    <section className="chat" data-ink="dark" aria-label={chat.title}>
      <div className="chat__copy">
        <Lines lines={[chat.title]} as="h3" className="head" />
        <p data-rise>{chat.body}</p>
        <Image
          data-rise
          className="chat__leon"
          src={cutouts.pointing.src}
          width={cutouts.pointing.w}
          height={cutouts.pointing.h}
          alt={lang === "ru" ? "Леон в белой футболке показывает большим пальцем в сторону чата" : "Leon in a white T-shirt pointing a thumb at the chat"}
          sizes="(max-width: 760px) 40vw, 20vw"
        />
      </div>
      <div className="chat__app" data-ui data-rise>
        <header>
          <strong>{chat.contact}</strong>
          <span>{chat.channel}</span>
        </header>
        <ol className="chat__log" aria-live="polite">
          {chat.thread.map((line) => (
            <li key={line} data-from="them">
              {line}
            </li>
          ))}
          {option ? (
            <>
              <li data-from="me" key={option.reply}>
                {option.reply}
              </li>
              <li data-from="them" data-late key={option.answer}>
                {option.answer}
              </li>
            </>
          ) : null}
        </ol>
        <div className="chat__drafts">
          <span>{chat.draft}</span>
          {option ? (
            <button type="button" onClick={() => setPicked(null)}>
              {chat.again}
            </button>
          ) : (
            chat.options.map((item, i) => (
              <button type="button" key={item.reply} onClick={() => setPicked(i)}>
                {item.reply}
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
