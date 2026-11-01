"use client";

import Link from "next/link";
import { links } from "@/content/copy";
import { LangToggle } from "@/components/Chrome";
import { useLang } from "@/lib/lang";

export default function PlainCV() {
  const { t } = useLang();
  const cv = t.cv;
  const entries = (items: typeof cv.work) =>
    items.map((item) => (
      <article key={item.role}>
        <h3>{item.role}</h3>
        <p className="plain__when">{item.when}</p>
        <ul>
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </article>
    ));

  return (
    <main className="plain">
      <nav className="plain__nav">
        <Link href="/">{cv.back}</Link>
        <LangToggle />
      </nav>
      <h1>{cv.title}</h1>
      <p className="plain__tag">{cv.tagline}</p>
      <p className="plain__links">
        {t.contact.lines.map((line) => (
          <a key={line.label} href={line.href}>
            {line.label === "CV" || line.href === links.pdf
              ? cv.print
              : line.value}
          </a>
        ))}
      </p>

      <section>
        <h2>{cv.experience}</h2>
        {entries(cv.work)}
      </section>
      <section>
        <h2>{cv.education}</h2>
        {entries(cv.education_items)}
      </section>
      <section>
        <h2>{cv.wins}</h2>
        <ul>
          {cv.wins_items.map((win) => (
            <li key={win}>{win}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{cv.projects}</h2>
        <ul>
          {t.projects.rows.map((row) => (
            <li key={row.name}>
              <a href={row.href}>{row.name}</a>: {row.note}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>{cv.skills}</h2>
        <dl>
          {t.projects.stack.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
