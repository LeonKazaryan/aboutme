"use client";

import { useEffect } from "react";
import { ScrollTrigger, startSmoothScroll } from "@/lib/motion";
import { setDeal, startCall } from "@/lib/store";
import { Boot, Cursor, DealCard, Header } from "./Chrome";
import { Contact, Footer, Projects } from "./Closing";
import { HackNU } from "./HackNU";
import { Hero } from "./Hero";
import { Incubator } from "./Incubator";
import { School, University } from "./School";
import { Terminal } from "./Terminal";
import { Warsaw } from "./Warsaw";
import { Work } from "./Work";
import { Zimran } from "./Zimran";

export function Experience() {
  useEffect(() => startSmoothScroll(), []);

  // Whatever part of the page is under the bar decides the bar's ink and the deal's stage.
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    document.querySelectorAll<HTMLElement>("[data-stage]").forEach((el) => {
      const stage = Number(el.dataset.stage);
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          onEnter: () => {
            startCall();
            setDeal({ stage });
          },
          onLeaveBack: () => setDeal({ stage: stage - 1 }),
        }),
      );
    });

    document.querySelectorAll<HTMLElement>("[data-prize]").forEach((el) => {
      const value = Number(el.dataset.prize);
      const before = value === 500000 ? 0 : 500000;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          onEnter: () => setDeal({ prize: value }),
          onLeaveBack: () => setDeal({ prize: before }),
        }),
      );
    });

    document.querySelectorAll<HTMLElement>("[data-ink]:not(.bar)").forEach((el) => {
      const ink = el.dataset.ink as "light" | "dark" | "solid";
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 40px",
          end: "bottom 40px",
          onToggle: (self) => {
            if (self.isActive) setDeal({ ink });
          },
        }),
      );
    });

    return () => triggers.forEach((trigger) => trigger.kill());
  }, []);

  // Parts of a section arrive once, in reading order.
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          seen.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    document.querySelectorAll("[data-rise]").forEach((el) => seen.observe(el));
    return () => seen.disconnect();
  }, []);

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    addEventListener("load", refresh);
    return () => removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <Boot />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <School />
        <University />
        <Incubator />
        <Work />
        <HackNU />
        <Zimran />
        <Warsaw />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <DealCard />
      <Terminal />
    </>
  );
}
