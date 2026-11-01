"use client";

import { useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { ScrollTrigger, gsap, useScene } from "@/lib/motion";
import { Lines } from "./Pic";

const phoneLines = ["Twilio", "JustCall", "Zoiper"] as const;
const crms = ["AmoCRM", "Pipedrive", "HubSpot"] as const;

function eventFor(step: number, line: string, crm: string, contact: string, stage: string) {
  const base = { from: "+1 646 555 0142", provider: line.toLowerCase() };
  const events = [
    { event: "call.ringing", ...base, to: "sales-line-1" },
    { event: "webhook.received", ...base, status: "in-progress" },
    { event: "crm.contact.matched", crm: crm.toLowerCase(), contact, stage },
    { event: "deal.activity.logged", crm: crm.toLowerCase(), duration: "04:12", push: true },
  ];
  return JSON.stringify(events[step], null, 2);
}

export function Work() {
  const { t } = useLang();
  const scope = useRef<HTMLElement>(null);
  const [step, setStep] = useState(3);
  const [line, setLine] = useState<(typeof phoneLines)[number]>("Twilio");
  const [crm, setCrm] = useState<(typeof crms)[number]>("HubSpot");

  useScene(scope, ({ q }) => {
    setStep(0);
    q(".work__step").forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 62%",
        end: "bottom 62%",
        onToggle: (self) => {
          if (self.isActive) setStep(i);
        },
      });
    });
    gsap.fromTo(
      q(".work__ground"),
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  const steps = [line, "Webhook", crm, t.work.pipeline[3]];

  return (
    <section id="contract" ref={scope} className="work" data-stage="3" data-ink="light">
      <span className="work__ground" aria-hidden="true">
        Salesautomators
      </span>
      <div className="work__intro">
        <Lines lines={t.work.title} className="work__title" />
        <div className="work__who" data-rise>
          <p>
            <strong>{t.work.role}</strong>
            <br />
            {t.work.where}
          </p>
          <p>{t.work.body}</p>
        </div>
      </div>

      <div className="work__flow">
        <ol className="work__steps">
          {t.work.steps.map((item, i) => (
            <li className="work__step" key={item.title} data-now={i === step}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ol>

        <div className="work__sticky">
          <div className="softphone" data-ui style={{ "--step": step } as React.CSSProperties}>
            <div className="softphone__chips">
              <fieldset>
                <legend>{t.work.line}</legend>
                {phoneLines.map((name) => (
                  <button type="button" key={name} aria-pressed={line === name} onClick={() => setLine(name)}>
                    {name}
                  </button>
                ))}
              </fieldset>
              <fieldset>
                <legend>{t.work.crm}</legend>
                {crms.map((name) => (
                  <button type="button" key={name} aria-pressed={crm === name} onClick={() => setCrm(name)}>
                    {name}
                  </button>
                ))}
              </fieldset>
            </div>

            <div className="route" aria-hidden="true">
              <span className="route__dot" />
              {steps.map((name, i) => (
                <span className="route__node" key={i} data-on={i <= step}>
                  {name}
                </span>
              ))}
            </div>

            <div className="softphone__body">
              <div>
                <div className="board" aria-hidden="true">
                  {t.work.pipeline.map((name) => (
                    <span className="board__col" key={name}>
                      {name}
                    </span>
                  ))}
                  <span className="board__card">
                    <strong>{t.work.contactName}</strong>
                    <span>{t.work.company}</span>
                  </span>
                </div>
                <pre className="softphone__event">
                  <code>{eventFor(step, line, crm, t.work.contactName, t.work.pipeline[2])}</code>
                </pre>
              </div>
              <div className="mini" aria-hidden="true">
                <span className="mini__name">{t.work.contactName}</span>
                <span className="mini__line">{step === 0 ? line : step === 1 ? "00:12" : t.work.company}</span>
                <span className="mini__ring" data-on={step === 0} />
                <span className="mini__push" data-on={step === 3}>
                  {crm}: {t.work.steps[3].title}
                </span>
              </div>
            </div>
            <p className="softphone__note">{t.work.sample}</p>
          </div>
        </div>
      </div>

      <div className="work__stack">
        <Lines lines={[t.work.stackTitle]} as="h3" className="head" />
        <dl>
          {t.work.stack.map(([label, value], i) => (
            <div key={i} data-rise style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
