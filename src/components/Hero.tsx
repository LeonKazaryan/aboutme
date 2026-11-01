"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { stageIds } from "@/content/copy";
import { photos, ringKeys, type PhotoKey } from "@/content/photos";
import { playConnect } from "@/lib/dtmf";
import { useLang } from "@/lib/lang";
import { gsap, scrollToTarget, useScene } from "@/lib/motion";
import { setDeal, startCall } from "@/lib/store";
import { CallClock } from "./Chrome";
import { Pic } from "./Pic";
import { Ripple } from "./Ripple";

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const round = (n: number) => n.toFixed(3);

/** Near frames sit low and large, far frames high and small: a ring seen tilted. */
function ringPose(index: number, count: number, angle: number) {
  const a = angle + (index / count) * TAU;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const depth = (sin + 1) / 2;
  return { cos, sin, depth, scale: lerp(0.62, 1.1, depth), tilt: -cos * 12 };
}

function PhoneIcon({ down }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={down ? { transform: "rotate(135deg)" } : undefined}>
      <path
        fill="currentColor"
        d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.1 2.2Z"
      />
    </svg>
  );
}

export function Hero() {
  const { t, lang } = useLang();
  const scope = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const fly = useRef(0);
  const paused = useRef(false);
  const [active, setActive] = useState<PhotoKey | null>(null);

  useEffect(() => {
    const host = ring.current;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!host || calm) return;

    const frames = [...host.querySelectorAll<HTMLElement>(".ring__frame")];
    let shown: HTMLElement[] = [];
    let rx = 0;
    let ry = 0;

    const measure = () => {
      const phone = innerWidth <= 760;
      const box = host.getBoundingClientRect();
      shown = frames.filter((el) => getComputedStyle(el).display !== "none");
      rx = box.width * (phone ? 0.68 : 0.585);
      ry = box.height * (phone ? 0.385 : 0.395);
    };
    measure();
    frames.forEach((el) => {
      el.style.left = "50%";
      el.style.top = "50%";
    });
    addEventListener("resize", measure);

    let angle = 0;
    let speed = 1;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
    };
    addEventListener("pointermove", onMove);

    const tick = (_time: number, delta: number) => {
      const p = fly.current;
      if (p >= 0.995) return;
      speed += ((paused.current ? 0 : 1) - speed) * 0.08;
      angle += (delta / 1000) * 0.055 * speed + p * 0.002;
      eased.x += (pointer.x - eased.x) * 0.05;
      eased.y += (pointer.y - eased.y) * 0.05;

      const spread = 1 + p * p * 3.4;
      const zoom = 1 + p * 1.5;
      const alpha = Math.min(1, Math.max(0, 1 - (p - 0.5) / 0.3));
      shown.forEach((el, i) => {
        const pose = ringPose(i, shown.length, angle);
        const x = pose.cos * rx * spread + eased.x * 36 * pose.depth;
        const y = pose.sin * ry * spread + eased.y * 22 * pose.depth;
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${pose.tilt.toFixed(2)}deg) scale(${(pose.scale * zoom).toFixed(3)})`;
        el.style.zIndex = String(Math.round(pose.depth * 20));
        el.style.opacity = String(alpha);
      });
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      removeEventListener("resize", measure);
      removeEventListener("pointermove", onMove);
    };
  }, []);

  useScene(scope, ({ phone, q }) => {
    const side = phone ? 11 : 38;
    const opened = `inset(13% ${side}% 13% ${side}% round 44px)`;
    let ink = "light" as "light" | "dark";
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scope.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          fly.current = self.progress;
          if (self.progress > 0.03) startCall();
          scope.current?.classList.toggle("is-answered", self.progress > 0.01);
          const next = self.progress > 0.8 ? "dark" : "light";
          if (next !== ink) {
            ink = next;
            setDeal({ ink });
          }
        },
      },
    });
    tl.to(q(".hero__first"), { xPercent: -46, autoAlpha: 0, duration: 0.42 }, 0)
      .to(q(".hero__last"), { xPercent: 46, autoAlpha: 0, duration: 0.42 }, 0)
      .to(q(".hero__status, .hero__sub, .hero__actions"), { autoAlpha: 0, y: -28, duration: 0.14 }, 0)
      .fromTo(
        q(".portal"),
        { clipPath: `inset(100% ${side}% -72% ${side}% round 44px)` },
        { clipPath: opened, duration: 0.42, ease: "power2.out" },
        0.08,
      )
      .fromTo(
        q(".portal"),
        { clipPath: opened },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.42, ease: "power2.inOut", immediateRender: false },
        0.54,
      );
  });

  const accept = () => {
    startCall();
    playConnect();
    scrollToTarget("#lead", 2.8);
  };

  const shown = active ? photos[active] : null;

  return (
    <section id="top" ref={scope} className="hero is-ringing" data-ink="light" aria-label={t.hero.status}>
      <div className="hero__stage">
        <Ripple />
        <div className="hero__core">
          <p className="hero__status">{t.hero.status}</p>
          <h1 className="hero__name" lang={lang}>
            <span className="hero__first">{t.hero.first}</span>{" "}
            <span className="hero__last">{t.hero.last}</span>
          </h1>
          <p className="hero__sub" aria-live="polite">
            {shown ? `${shown.date[lang]}, ${shown.place[lang]}. ${shown.alt[lang]}.` : t.hero.sub}
          </p>
          <div className="hero__actions">
            <button type="button" className="callkey callkey--accept" onClick={accept} data-cursor={t.cursor.accept}>
              <span className="callkey__disc">
                <PhoneIcon />
              </span>
              <span className="callkey__text">
                <strong>{t.hero.accept}</strong>
                <span>{t.hero.acceptHint}</span>
              </span>
            </button>
            <Link className="callkey callkey--decline" href="/cv" data-cursor={t.cursor.decline}>
              <span className="callkey__disc">
                <PhoneIcon down />
              </span>
              <span className="callkey__text">
                <strong>{t.hero.decline}</strong>
                <span>{t.hero.declineHint}</span>
              </span>
            </Link>
          </div>
        </div>

        <div ref={ring} className="ring" data-focus={Boolean(active)}>
          {ringKeys.map((key, i) => {
            const pose = ringPose(i, ringKeys.length, 0);
            const photo = photos[key];
            const wide = photo.w > photo.h;
            return (
              <button
                key={key}
                type="button"
                className="ring__frame"
                data-wide={wide}
                data-on={active === key}
                data-cursor={t.cursor.frame}
                aria-label={`${t.hero.jump} ${t.stages[photo.stage]}: ${photo.alt[lang]}`}
                style={{
                  left: `${round(50 + pose.cos * 58)}%`,
                  top: `${round(50 + pose.sin * 39)}%`,
                  transform: `translate(-50%, -50%) rotate(${round(pose.tilt)}deg) scale(${round(pose.scale)})`,
                  zIndex: Math.round(pose.depth * 20),
                }}
                onPointerEnter={() => {
                  paused.current = true;
                  setActive(key);
                }}
                onPointerLeave={() => {
                  paused.current = false;
                  setActive(null);
                }}
                onFocus={() => {
                  paused.current = true;
                  setActive(key);
                }}
                onBlur={() => {
                  paused.current = false;
                  setActive(null);
                }}
                onClick={() => {
                  startCall();
                  scrollToTarget(`#${stageIds[photo.stage]}`, 2.6);
                }}
              >
                <Pic id={key} sizes="200px" hidden eager={i < 12} />
              </button>
            );
          })}
        </div>

        <div className="portal" aria-hidden="true">
          <p className="portal__status">
            {t.hero.connected} <CallClock />
          </p>
          <p className="portal__line">{t.hero.line}</p>
          <p className="portal__hint">{t.hero.scroll}</p>
        </div>
      </div>
    </section>
  );
}
