"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { useLang } from "./lang";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;

/** One scroll clock for the whole page: Lenis drives, GSAP's ticker owns the frame. */
export function startSmoothScroll() {
  const touch = matchMedia("(hover: none)").matches;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (touch || calm) return () => {};

  const instance = new Lenis({ lerp: 0.12, wheelMultiplier: 1, autoRaf: false });
  lenis = instance;
  const raf = (time: number) => instance.raf(time * 1000);
  instance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    instance.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: string | number, duration = 1.6) {
  if (lenis) {
    lenis.scrollTo(target, { duration, easing: (t) => 1 - Math.pow(1 - t, 3) });
    return;
  }
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior = calm ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior });
  }
}

type SceneTools = {
  phone: boolean;
  q: (selector: string) => Element[];
};

/**
 * A scrubbed or triggered scene. Everything built here only exists when motion
 * is allowed, so the CSS finished composition is what reduced motion gets.
 * Rebuilt on language change because the words are different elements.
 */
export function useScene(scope: RefObject<HTMLElement | null>, build: (tools: SceneTools) => void) {
  const { lang } = useLang();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          phone: "(max-width: 760px)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          build({
            phone: Boolean(context.conditions.phone),
            q: gsap.utils.selector(scope),
          });
        },
      );
      return () => mm.revert();
    },
    { scope, dependencies: [lang], revertOnUpdate: true },
  );
}
