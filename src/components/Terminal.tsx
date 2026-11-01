"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { stageIds } from "@/content/copy";
import { useLang } from "@/lib/lang";
import { scrollToTarget } from "@/lib/motion";

type Line = { id: number; kind: "in" | "out" | "err"; text: string };

const konami = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const visible = ["whoami", "ls", "goto", "wins", "stack", "lang", "dial", "clear", "exit", "help"];

export function openTerminal() {
  window.dispatchEvent(new Event("terminal:open"));
}

export function Terminal() {
  const { t, lang, setLang } = useLang();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const history = useRef<string[]>([]);
  const cursor = useRef(-1);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");

  const open = useCallback(() => {
    const el = dialog.current;
    if (!el || el.open) return;
    el.showModal();
    input.current?.focus();
  }, []);

  useEffect(() => {
    let progress = 0;
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as Element).closest?.("input, textarea");
      if (!typing && (event.key === "`" || event.key === "~" || event.key === "ё" || event.key === "Ё")) {
        event.preventDefault();
        open();
        return;
      }
      if (typing) return;
      progress = event.key === konami[progress] ? progress + 1 : 0;
      if (progress === konami.length) {
        progress = 0;
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("terminal:open", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("terminal:open", open);
    };
  }, [open]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines]);

  const print = (entries: Array<[Line["kind"], string]>) => {
    setLines((current) => [
      ...current,
      ...entries.map(([kind, text]) => ({ id: nextId.current++, kind, text })),
    ]);
  };

  const close = () => dialog.current?.close();

  const goTo = (id: string) => {
    close();
    scrollToTarget(`#${id}`, 2.2);
  };

  const run = (raw: string) => {
    const text = raw.trim();
    print([["in", text]]);
    if (!text) return;
    history.current.unshift(text);
    cursor.current = -1;

    const [command, ...rest] = text.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    const out = (...items: string[]) => print(items.map((item) => ["out", item]));

    switch (command.toLowerCase()) {
      case "help":
        out(...t.terminal.help);
        break;
      case "whoami":
        out(t.terminal.whoami);
        break;
      case "ls":
        out(...t.stages.map((name, i) => `${stageIds[i].padEnd(12)}${name}`));
        break;
      case "wins":
        out(...t.terminal.wins);
        break;
      case "stack":
        out(t.terminal.stack);
        break;
      case "goto":
        if ((stageIds as readonly string[]).includes(arg)) goTo(arg);
        else print([["err", t.terminal.noStage]]);
        break;
      case "lang":
        if (arg === "en" || arg === "ru") setLang(arg);
        else out(lang);
        break;
      case "dial":
      case "hire-me":
        goTo("contact");
        break;
      case "sudo":
        out(t.terminal.sudo);
        setTimeout(() => goTo("contact"), 700);
        break;
      case "rm":
        out(t.terminal.rm);
        break;
      case "fortune":
        out(t.terminal.fortune);
        break;
      case "ring":
        out(t.terminal.ring);
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "hangup":
        close();
        break;
      default:
        print([["err", `${t.terminal.unknown} ${command}`]]);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      const step = event.key === "ArrowUp" ? 1 : -1;
      const next = Math.min(history.current.length - 1, Math.max(-1, cursor.current + step));
      cursor.current = next;
      setValue(next === -1 ? "" : history.current[next]);
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const match = visible.find((name) => name.startsWith(value.trim().toLowerCase()));
      if (value.trim() && match) setValue(`${match} `);
    }
  };

  return (
    <dialog
      ref={dialog}
      className="term"
      aria-label={t.terminal.title}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <div className="term__bar">
        <span>{t.terminal.title}</span>
        <button type="button" onClick={close} aria-label="exit">
          esc
        </button>
      </div>
      <div ref={log} className="term__log" onClick={() => input.current?.focus()}>
        <pre className="term__line">{t.terminal.intro}</pre>
        {lines.map((line) => (
          <pre key={line.id} className="term__line" data-kind={line.kind}>
            {line.kind === "in" ? `${t.terminal.prompt} $ ${line.text}` : line.text || " "}
          </pre>
        ))}
      </div>
      <form
        className="term__form"
        onSubmit={(event) => {
          event.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <label htmlFor="term-input">{t.terminal.prompt} $</label>
        <input
          ref={input}
          id="term-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.terminal.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
    </dialog>
  );
}
