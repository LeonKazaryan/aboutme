"use client";

import { useRef } from "react";
import Image from "next/image";
import { cutouts } from "@/content/photos";
import { useLang } from "@/lib/lang";
import { gsap, useScene } from "@/lib/motion";
import { Lines, Pic } from "./Pic";

export function School() {
  const { t, lang } = useLang();
  const scope = useRef<HTMLElement>(null);
  const [first, second = ""] = t.school.title.split(" ");

  useScene(scope, ({ q }) => {
    const stage = q(".school__stage")[0] as HTMLElement;
    const coin = q(".coin")[0] as HTMLElement;
    const figure = q(".school__figure")[0] as HTMLElement;

    // The medal starts as the whole screen and ends pinned to the real lapel.
    const stageBox = stage.getBoundingClientRect();
    const coinBox = coin.getBoundingClientRect();
    const fromX = stageBox.left + stageBox.width / 2 - (coinBox.left + coinBox.width / 2);
    const fromY = stageBox.top + stageBox.height / 2 - (coinBox.top + coinBox.height / 2);

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: true },
    });
    gsap.set(coin, { x: fromX, y: fromY, scale: 1 });
    tl.fromTo(figure, { yPercent: 46 }, { yPercent: 0, duration: 0.5, ease: "power1.out" }, 0.12)
      .fromTo(q(".coin__spin"), { rotationY: 0 }, { rotationY: 1080, duration: 0.74 }, 0)
      .to(coin, { x: 0, y: 0, scale: 0.0826, duration: 0.34, ease: "power2.in" }, 0.42)
      .fromTo(
        q(".school__word > span"),
        { yPercent: 104 },
        { yPercent: 0, duration: 0.24, stagger: 0.06, ease: "power2.out" },
        0.5,
      )
      .fromTo(q(".school__copy"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.72)
      .to({}, { duration: 0.1 }, 0.9);
  });

  return (
    <>
      <section id="lead" ref={scope} className="school" data-stage="0" data-ink="dark">
        <div className="school__stage">
          <h2 className="school__title">
            <span className="school__word">
              <span>{first}</span>
            </span>{" "}
            <span className="school__word">
              <span>{second}</span>
            </span>
          </h2>
          <p className="school__copy">{t.school.body}</p>
          <div className="school__figure">
            <Image
              src={cutouts.graduation.src}
              width={cutouts.graduation.w}
              height={cutouts.graduation.h}
              alt={lang === "ru" ? "Леон в костюме и жёлтой выпускной ленте, смотрит в сторону" : "Leon in a suit and a yellow graduation sash, looking aside"}
              sizes="(max-width: 760px) 90vw, 50vw"
            />
          </div>
          <div className="coin" role="img" aria-label={t.school.coinFront}>
            <div className="coin__spin">
              <div className="coin__face coin__face--front">
                <Image src="/cutouts/medal-coin.webp" width={800} height={800} alt="" sizes="70vmin" />
              </div>
              <div className="coin__face coin__face--back">
                <strong>5.0</strong>
                <span>{t.school.coinBack}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="after-school" data-ink="dark" aria-label={t.school.captions.gradSquare}>
        <figure data-rise>
          <Pic id="gradSquare" sizes="(max-width: 760px) 92vw, 40vw" />
          <figcaption>{t.school.captions.gradSquare}</figcaption>
        </figure>
        <figure data-rise style={{ "--d": "90ms" } as React.CSSProperties}>
          <Pic id="medalCase" sizes="(max-width: 760px) 60vw, 26vw" />
          <figcaption>{t.school.captions.medalCase}</figcaption>
        </figure>
        <figure data-rise style={{ "--d": "180ms" } as React.CSSProperties}>
          <Pic id="medal" sizes="(max-width: 760px) 60vw, 18vw" />
          <figcaption>{t.school.captions.medal}</figcaption>
        </figure>
      </section>
    </>
  );
}

export function University() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);

  useScene(scope, ({ q }) => {
    const word = q(".uni__word")[0];
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: true },
    });
    tl.fromTo(word, { scale: 1 }, { scale: 34, duration: 0.56, ease: "power2.in" }, 0.04)
      .to(q(".uni__veil"), { autoAlpha: 0, duration: 0.08 }, 0.52)
      .fromTo(q(".uni__photo"), { scale: 1.16 }, { scale: 1, duration: 0.7 }, 0.1)
      .fromTo(q(".uni__sheet"), { yPercent: 112 }, { yPercent: 0, duration: 0.24, ease: "power2.out" }, 0.62)
      .to({}, { duration: 0.14 }, 0.86);
  });

  return (
    <section id="qualified" ref={scope} className="uni" data-stage="1" data-ink="dark">
      <div className="uni__stage">
        <Pic id="university" sizes="100vw" className="uni__photo" />
        <div className="uni__veil" aria-hidden="true">
          <span className="uni__word">NU</span>
        </div>
        <div className="uni__sheet">
          <Lines lines={t.university.title} className="uni__title" />
          <p>{t.university.body}</p>
          <dl>
            {t.university.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="uni__before">{t.university.before}</p>
        </div>
      </div>
    </section>
  );
}
