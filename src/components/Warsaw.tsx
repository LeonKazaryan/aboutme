"use client";

import { useRef } from "react";
import type { Copy } from "@/content/copy";
import type { PhotoKey } from "@/content/photos";
import { useLang } from "@/lib/lang";
import { gsap, useScene } from "@/lib/motion";
import { Pic } from "./Pic";

const frames: Array<{ id: PhotoKey & keyof Copy["warsaw"]["frames"]; x: number; y: number }> = [
  { id: "palace", x: -24, y: 4 },
  { id: "metaWelcome", x: 24, y: -3 },
  { id: "metaWall", x: -20, y: -5 },
  { id: "metaNeon", x: 22, y: 5 },
  { id: "skyline", x: 0, y: -7 },
];

export function Warsaw() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);
  const w = t.warsaw;

  useScene(scope, ({ phone, q }) => {
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: true },
    });
    const path = q(".flight__path")[0] as SVGPathElement;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    tl.to(path, { strokeDashoffset: 0, duration: 0.16 }, 0)
      .to(q(".fly__intro"), { scale: 2.6, autoAlpha: 0, duration: 0.14, ease: "power2.in" }, 0.2);

    const items = q(".fly__item");
    const span = 0.125;
    const depth = phone ? 2000 : 2600;
    items.forEach((item, i) => {
      const last = i === items.length - 1;
      const start = 0.24 + i * span;
      const run = last ? 0.2 : 0.36;
      // Set here, not in CSS: GSAP folds the CSS translate into its own transform.
      gsap.set(item, {
        xPercent: -50,
        yPercent: -50,
        x: `${frames[i].x * (phone ? 0.5 : 1)}vw`,
        y: `${frames[i].y}vh`,
      });
      tl.fromTo(item, { z: -depth, autoAlpha: 0 }, { z: last ? 0 : 900, duration: run }, start)
        .to(item, { autoAlpha: 1, duration: 0.05 }, start);
      if (!last) tl.to(item, { autoAlpha: 0, duration: 0.04 }, start + run - 0.04);
    });
    tl.fromTo(q(".fly__outro"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.93);
  });

  return (
    <section id="expansion" ref={scope} className="fly" data-stage="5" data-ink="dark">
      <div className="fly__stage">
        <div className="fly__world">
          {frames.map((frame, i) => (
            <figure
              className="fly__item"
              key={frame.id}
              data-last={i === frames.length - 1}
                          >
              <Pic id={frame.id} sizes="(max-width: 760px) 80vw, 46vw" />
              <figcaption>{w.frames[frame.id]}</figcaption>
            </figure>
          ))}
        </div>

        <div className="fly__intro">
          <h2>{w.title}</h2>
          <div className="flight" aria-hidden="true">
            <span>{w.from}</span>
            <svg viewBox="0 0 1000 90" preserveAspectRatio="none">
              <path className="flight__path" d="M6 80 C 280 -16, 720 -16, 994 80" vectorEffect="non-scaling-stroke" />
            </svg>
            <span>{w.to}</span>
          </div>
          <p className="flight__km">{w.distance}</p>
        </div>

        <p className="fly__outro">{w.body}</p>
      </div>
    </section>
  );
}
