"use client";

import { useSyncExternalStore } from "react";

type State = {
  stage: number;
  prize: number;
  closed: boolean;
  ink: "light" | "dark" | "solid";
};

const initial: State = { stage: -1, prize: 0, closed: false, ink: "light" };

let state = initial;
let callStartedAt: number | null = null;
const listeners = new Set<() => void>();

export function setDeal(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((fn) => fn());
}

export function useDeal<T>(pick: (s: State) => T) {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => pick(state),
    () => pick(initial),
  );
}

/** The call clock starts the first time the visitor accepts or scrolls in. */
export function startCall() {
  callStartedAt ??= Date.now();
}

export function callSeconds() {
  return callStartedAt === null ? 0 : Math.floor((Date.now() - callStartedAt) / 1000);
}

export function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
