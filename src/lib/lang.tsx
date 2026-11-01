"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { copy, type Copy, type Lang } from "@/content/copy";

const listeners = new Set<() => void>();

function readLang(): Lang {
  return document.documentElement.dataset.lang === "ru" ? "ru" : "en";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeLang(next: Lang) {
  const root = document.documentElement;
  root.dataset.lang = next;
  root.lang = next;
  try {
    localStorage.setItem("lang", next);
  } catch {}
  listeners.forEach((fn) => fn());
}

type Origin = { x: number; y: number };

type LangValue = {
  lang: Lang;
  t: Copy;
  setLang: (next: Lang, origin?: Origin) => void;
};

const LangContext = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, () => "en" as Lang);

  // The server always sends English; Russian readers wait one frame for hydration.
  useEffect(() => {
    document.documentElement.classList.remove("wait");
    document.title = copy[lang].title;
  }, [lang]);

  const setLang = useCallback((next: Lang, origin?: Origin) => {
    if (next === readLang()) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || calm) {
      writeLang(next);
      return;
    }
    // The new language dials in as a circle growing out of the toggle.
    const root = document.documentElement;
    root.style.setProperty("--wipe-x", `${origin?.x ?? innerWidth - 80}px`);
    root.style.setProperty("--wipe-y", `${origin?.y ?? 40}px`);
    document.startViewTransition(() => flushSync(() => writeLang(next)));
  }, []);

  const value = useMemo(() => ({ lang, t: copy[lang], setLang }), [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang must be used inside LangProvider");
  return value;
}
