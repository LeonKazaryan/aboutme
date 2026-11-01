"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { links } from "@/content/copy";
import { cutouts, photos } from "@/content/photos";
import { useLang } from "@/lib/lang";
import { gsap, useScene } from "@/lib/motion";
import { Pic } from "./Pic";

// The jagged outline of the Zimran prize boards, cut into shards that share edges.
const top: Array<[number, number]> = [[0, 20], [15, 5], [28, 18], [42, 0], [57, 16], [71, 3], [86, 15], [100, 6]];
const bottom: Array<[number, number]> = [[0, 90], [13, 100], [27, 84], [43, 98], [56, 82], [72, 100], [85, 86], [100, 96]];

const shards = top.slice(0, -1).map((_, i) => {
  const points = [top[i], top[i + 1], bottom[i + 1], bottom[i]];
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
});

const scatter = [
  [-70, -60, -24],
  [-30, 80, 18],
  [-12, -90, -12],
  [14, 70, 16],
  [30, -80, -20],
  [52, 60, 22],
  [80, -40, -16],
];

function InlineTitle({ line, index }: { line: string; index: number }) {
  const [head, ...rest] = line.split(" ");
  const { lang } = useLang();
  return (
    <span className="mask">
      <span style={{ "--i": index } as React.CSSProperties}>
        {head}{" "}
        {index === 0 ? (
          <span className="zim__inline zim__inline--leon">
            <Image
              src={cutouts.firstPlace.src}
              width={cutouts.firstPlace.w}
              height={cutouts.firstPlace.h}
              alt=""
              sizes="120px"
            />
          </span>
        ) : (
          <span className="zim__inline zim__inline--one" lang={lang}>
            1
          </span>
        )}{" "}
        {rest.join(" ")}
      </span>{" "}
    </span>
  );
}

export function Zimran() {
  const { t, lang } = useLang();
  const scope = useRef<HTMLElement>(null);
  const z = t.zimran;

  useScene(scope, ({ phone, q }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: q(".zim__scene")[0], start: "top top", end: "bottom bottom", scrub: true },
    });
    q(".shard").forEach((piece, i) => {
      const [x, y, r] = scatter[i];
      tl.fromTo(
        piece,
        { xPercent: x * (phone ? 0.7 : 1), yPercent: y, rotation: r },
        { xPercent: 0, yPercent: 0, rotation: 0, duration: 0.5, ease: "power2.out" },
        i * 0.035,
      );
    });
    tl.fromTo(q(".zim__whole"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.72)
      .fromTo(q(".zim__one"), { yPercent: 62 }, { yPercent: 0, duration: 0.3, ease: "power2.out" }, 0.1)
      .fromTo(q(".zim__money > *"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.07 }, 0.5)
      .to({}, { duration: 0.08 }, 0.9);

    gsap.fromTo(
      q(".zig"),
      { xPercent: -8 },
      {
        xPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    gsap.fromTo(
      q(".zim__phone"),
      { yPercent: 20, rotation: -7 },
      {
        yPercent: -4,
        rotation: 3,
        ease: "none",
        scrollTrigger: { trigger: q(".zim__preggo")[0], start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    q(".zim__card").forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 120 + i * 60, rotation: [-9, 7, -5][i] },
        {
          y: 0,
          rotation: [-3, 2, -2][i],
          ease: "none",
          scrollTrigger: { trigger: q(".zim__cards")[0], start: "top bottom", end: "top 35%", scrub: true },
        },
      );
    });
  });

  const marquee = [...z.marquee, ...z.marquee, ...z.marquee, ...z.marquee];

  return (
    <section ref={scope} className="zim" data-prize="1750000" aria-label={z.title.join(" ")}>
      <div className="zim__violet" data-ink="light">
        <svg className="zig" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-100 620 L120 260 L330 520 L560 180 L760 500 L980 200 L1200 540 L1440 240 L1720 600 L1720 900 L-100 900 Z" />
        </svg>
        <div className="zim__band" aria-hidden="true">
          <div className="zim__track">
            {[0, 1].map((copy) => (
              <span className="zim__run" key={copy}>
                {marquee.map((word, i) => (
                  <Fragment key={i}>
                    <span>{word}</span>
                    <svg viewBox="0 0 40 24">
                      <path d="M2 22 14 2l6 10L28 2l10 20H26l-6-10-8 10Z" />
                    </svg>
                  </Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>

        <header className="zim__head">
          <p data-rise>{z.kicker}</p>
          <h2 data-rise="lines">
            {z.title.map((line, i) => (
              <InlineTitle key={line} line={line} index={i} />
            ))}
          </h2>
          <p data-rise>{z.sub}</p>
        </header>

        <div className="zim__scene">
          <div className="zim__stage">
            <div className="zim__puzzle" role="img" aria-label={photos.podium.alt[lang]}>
              {shards.map((clip) => (
                <div className="shard" key={clip} style={{ clipPath: clip }}>
                  <Pic id="podium" sizes="(max-width: 760px) 94vw, 60vw" hidden />
                </div>
              ))}
              <div className="zim__whole">
                <Pic id="podium" sizes="(max-width: 760px) 94vw, 60vw" hidden />
              </div>
            </div>
            <div className="zim__prize">
              <div className="zim__numeral">
                <span className="zim__one">1</span>
              </div>
              <div className="zim__money">
                <p className="zim__place">{z.prizeLabel}</p>
                <p className="zim__amount">{z.prize}</p>
                <p className="zim__extra">{z.prizeExtra}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="zim__light" data-ink="dark">
        <div className="zim__preggo">
          <div className="zim__shard">
            <Image
              className="zim__phone"
              src={cutouts.preggo.src}
              width={cutouts.preggo.w}
              height={cutouts.preggo.h}
              alt={z.preggo.alt}
              sizes="(max-width: 760px) 62vw, 24vw"
            />
          </div>
          <div className="zim__pitch">
            <p data-rise>{z.preggo.tag}</p>
            <h3 data-rise="lines">
              <span className="mask">
                <span>{z.preggo.title}</span>
              </span>
            </h3>
            <p data-rise>{z.preggo.body}</p>
            <a data-rise className="zim__btn" href={links.preggo} target="_blank" rel="noreferrer" data-cursor={t.cursor.open}>
              {z.preggo.link}
            </a>
          </div>
        </div>
        <h3 className="zim__statement" data-rise="lines">
          {z.statement.map((line, i) => (
            <span className="mask" key={line}>
              <span style={{ "--i": i } as React.CSSProperties}>{line}</span>{" "}
            </span>
          ))}
        </h3>
        <div className="zim__gallery">
          <figure data-rise className="zim__cut">
            <Pic id="firstPlace" sizes="(max-width: 760px) 92vw, 34vw" />
          </figure>
          <figure data-rise className="zim__cut zim__cut--b" style={{ "--d": "90ms" } as React.CSSProperties}>
            <Pic id="truth" sizes="(max-width: 760px) 60vw, 24vw" />
          </figure>
          <figure data-rise className="zim__cut zim__cut--c" style={{ "--d": "180ms" } as React.CSSProperties}>
            <Pic id="warRoom" sizes="(max-width: 760px) 70vw, 26vw" />
            <figcaption>{z.warRoom}</figcaption>
          </figure>
        </div>
        <div className="zim__cards">
          {z.cards.map((card, i) => (
            <article className="zim__card" data-tone={i} key={card.body}>
              <h4>
                {card.title[0]}
                <br />
                {card.title[1]}
              </h4>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
