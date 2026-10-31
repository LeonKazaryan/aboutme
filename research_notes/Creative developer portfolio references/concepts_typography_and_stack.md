# Concept-driven portfolios, kinetic typography, counter walls, and Next.js stack guidance

Scope note: ~17 tool calls. Only URLs that appeared in search/fetch results are cited. Search tool returned few dated, verified Awwwards write-ups; many requested niche examples (telephony-metaphor, hackathon/trophy-metaphor portfolios) were NOT found. See Gaps.

## 1. Which real sites prove concept-driven storytelling works, and how do they structure sections?

### Takeaway
Verified examples show a metaphor tied to the owner's identity (a drivable car for a 3D dev; kinetic type for a kinetic-typography artist) is what earns awards and virality, and the best ones keep a conventional content skeleton underneath. I found no verified telephony-metaphor or hackathon/leaderboard-metaphor portfolio; those are open niches (see Inferences).

### Cited Findings
- Bruno Simon's portfolio: visitor drives a toy 3D car in a bird's-eye WebGL world with five sections: intro, a crossroads of statues/signposts, projects, personal info + contact, and a physics playground. Won Awwwards Site of the Month, November (article dated Dec 17, 2019). Details like tab-title tracking and brake-light response add polish. — [Awwwards](https://www.awwwards.com/bruno-simon-portfolio-wins-site-of-the-month-november.html)
- Same site: built with Three.js plus Cannon.js (physics on simplified primitives synced to the Three.js scene each frame), ~3 months of work, 400,000+ visitors, Awwwards Site of the Year 2020 (per the Pastel summary). Camera moves above the car and looks down when entering a project section so projects are readable. Critics note it is slow/hard to navigate as a normal homepage. — [Pastel](https://usepastel.com/blog/how-a-design-portfolio-got-the-attention-of-400-000-visitors); [Bruno Simon case study (Medium)](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b?rel=muzli); [Creative Bloq](https://www.creativebloq.com/news/3d-car-portfolio). (Search-snippet-level; the Awwwards page above directly confirms only the SOTM and the concept.)
- Mat Voyce portfolio (matvoyce.tv, UK kinetic typography artist): concept "the type is the interface", i.e., headlines act as hero, nav cue and personality. Dev Hon Tran with Uncommon studio and designer Huy Phan. Claimed Awwwards Site of the Day Jan 2025 and nominated GSAP Site of the Year 2025. Stack: Next.js, GSAP (SplitText, ScrollTrigger), Strapi CMS, selective WebGL/canvas. Domain "matvoyce.tv" came from search snippet only, not fetched. — [Hon Tran case study](https://www.hontran.dev/blog/mat-voyce-case-study-award-winning-portfolio)
- Mat Voyce structure (from case study): intro, credits, brief, craft (kinetic hero, motion system, commercial selector + showreels, CMS layer), results/awards. — same source
- Awwwards 2025 portfolio listings with SOTD + Developer Award (listing snippets only, concepts not verified): Stefan Vitasović Portfolio25 (Sep 20, 2025), Olha Lazarieva (Oct 2, 2025), Wildy Riftian Portfolio by Surd Studio (Sep 12, 2025); Roman Jean-Elie "Portfolio '25" SOTD (Nov 2, 2025). — [Awwwards listing](https://www.awwwards.com/websites/%23E3530F/?page=4); [listing 2](https://www.awwwards.com/websites/%23FFEDB3/?page=5)
- Codrops case studies of developer portfolios (2025-2026): Stefan Vitasović Portfolio 2025 (minimalist, shader effects) at [Codrops](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/) (fetch returned 403, so only search-snippet description); Corentin Bernadou (Mar 2026: Swiss editorial design, Three.js geometry, Figma-style interactive rulers, vanilla JS) at [Codrops](https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/); Bruno Arizio case study at [Codrops](https://tympanus.net/codrops/?p=45700); Arnaud Rocca (GSAP motion system to fluid WebGL) at [engineered.at](https://engineered.at/articles/arnaud-rocca-s-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl).
- Community metaphor portfolios (lower authority, DEV.to, not award-level): chat-based portfolio ([DEV](https://dev.to/nasimkuniyil/breaking-the-traditional-portfolio-my-chat-based-approach-4298)); GUI-vs-terminal split ([DEV](https://dev.to/ptbdtq/my-portfolio-has-a-split-personality-gui-vs-terminal-3olc)); retro terminal/Windows 95 ([DEV](https://dev.to/arya_koste_5845807df94776/back-to-the-roots-a-retro-terminal-portfolio-that-takes-you-to-1995-2ehb)); cyberpunk with terminal + talking avatar ([DEV](https://dev.to/arunkushwaha007/i-built-a-cyberpunk-portfolio-with-a-talking-avatar-and-an-interactive-browser-terminal-5hm2)); a 2017 vintage-OS chat console ([One Page Love, Heather Vandervecht](https://onepagelove.com/heather-vandervecht)).
- DEV's portfolio challenge commentary: winners made it obvious within 3 seconds what they do and have built. — [DEV](https://dev.to/devteam/congrats-to-the-new-year-new-you-portfolio-challenge-winners-and-runner-ups-1l9h/comments)
- DigitalOcean App Platform hackathon named a floating-city personal portfolio as winner (Abhinav Chawla) — [DigitalOcean](https://digitalocean.com/blog/announcing-the-winners-of-the-app-platform-hackathon)

### Inferences
- Concept ideas for the user (React/RN dev, Twilio/JustCall/Zoiper, AmoCRM/Pipedrive/HubSpot; HackNU 2026, Business Cup 2026, 3rd nFactorial; NU CS). None verified as existing sites; they are my proposals built on the verified pattern "metaphor = the owner's work":
  1. "Incoming call": page loads as a softphone/dialer; hero is a ringing call (animated waveform/signal bars), "Accept" starts the story; sections = call timeline with a live call timer; contacts = "dial pad" CTA. Wins shown as call-log entries ("HackNU 2026 - Won - 1st").
  2. "Pipeline" (CRM kanban): stages Lead -> Qualified -> Demo -> Won, a deal card travels down as the user scrolls; each achievement is a "Closed Won" deal with a value badge. Ties telephony + AmoCRM/Pipedrive/HubSpot together.
  3. "Signal/call-routing": nodes (Twilio, JustCall, Zoiper, CRMs) as a routing graph; scroll routes a call through the graph (SVG/canvas, cheap).
  4. "Leaderboard/podium": hackathon trophies as an arcade score table with a count-up score; 1st/1st/3rd podium (3D optional). Combine with #1: "call log" + "leaderboard".
  5. "Compiler/terminal": CS-student metaphor, boot log of build output; cheapest, but the most common (many DEV.to examples above), so least distinctive.
  Recommended: #1 + #2 hybrid (call ringing hero -> pipeline scroll -> wins as Closed Won -> contact as dial pad) because it is unique, directly explains the profession, and is achievable with DOM/SVG + GSAP without heavy WebGL.
- Structure pattern from verified examples: concept hero -> projects/work -> about/personal -> contact, with the metaphor shaping transitions rather than replacing content (Bruno Simon five sections; Mat Voyce intro/work/results).
- Bruno Simon's critique (slow, hard to navigate) suggests offering a plain, fast fallback/skip route.

### Gaps
- No verified real portfolio using a phone/chat/telephony metaphor at award level, nor a hackathon-winner trophy/podium/arcade portfolio; searches returned only generic hackathon-winner announcements. Not verified Henry Heffernan's portfolio (search not answered).
- Could not fetch Awwwards pages for Vitasović, Lazarieva, Jean-Elie; their concepts are unverified.

## 2. Standout kinetic typography hero sections and achievement/stat counter walls

### Takeaway
Best verified kinetic-type reference is Mat Voyce (GSAP SplitText per-character staggers with back.out overshoot and random rotation, transform/opacity only). For counter walls I found only implementation techniques and components, not named award-winning stat walls.

### Cited Findings
- Mat Voyce technique list: split text into chars/words, staggered transforms and opacity, `back.out` ease, random per-character rotation, ScrollTrigger section reveals with softer `expo.out`, shared set of eases/durations, animate only transform and opacity, split once and reuse the timeline, only one showreel plays at a time, lazy-load below-fold video, static rendering with revalidation, respects prefers-reduced-motion. — [Hon Tran](https://www.hontran.dev/blog/mat-voyce-case-study-award-winning-portfolio)
- Awwwards inspiration entries for kinetic type: "Kinetic Type with Twist Distortion" (tagged 3D / Cinema 4D) at [Awwwards](https://www.awwwards.com/inspiration/kinetic-type-with-twist-distortion); "Type transformation - Kinetic Type Animation" (CSS/JS) at [Awwwards](https://www.awwwards.com/inspiration/type-transformation-kinetic-type-animation); also [Pact Media hero typography](https://www.awwwards.com/inspiration/pact-media-hero-typography), [Hero typeface one-all](https://www.awwwards.com/inspiration/hero-typeface-one-all). These are inspiration pages with little detail; dates unconfirmed.
- Roundups: [Studiomeyer kinetic typography guide (Nov 2025)](https://studiomeyer.io/en/blog/kinetische-typografie) (notes the animated CSS properties decide perf cost); [Digital Silk](https://www.digitalsilk.com/web-design/web-trends/kinetic-typography/); [SVGator 50 examples](https://www.svgator.com/blog/50-kinetic-typography-examples/) (video/motion examples, not necessarily web).
- GSAP SplitText with "auto" aria option: split element gets an aria-label and char/word/line elements hidden from screen readers; GSAP and all plugins (SplitText, ScrollTrigger, etc.) are now free. — [Webflow blog](https://webflow.com/blog/gsap-becomes-free)
- Counter techniques: tween a plain object with GSAP and write text in `onUpdate` (flexible, but heavier than a standalone lib if GSAP isn't already loaded); ScrollTrigger with `once: true` so counters run once; CountUp.js ~5kb with IntersectionObserver; odometer-style digit-roll components on 21st.dev. — [learnwithhasan CountUp](https://learnwithhasan.com/js-libraries/countup-js/); [21st.dev Number Counter](https://21st.dev/@hyperiux/components/number-counter.md); [21st.dev Odometer Stats](https://21st.dev/@ham7a311/components/odometer-stats.md); [Webflow stat bars](https://webflow.com/made-in-webflow/website/animated-cms-stat-bars)

### Inferences
- Since GSAP is already in the stack, use `gsap.to(obj,{val, onUpdate})` with ScrollTrigger `once:true`; use `tabular-nums` and fixed-width containers to avoid layout shift (my recommendation, not sourced).
- Achievement wall for this user: count-ups are weak for 3 wins; consider "score" counters (hackathons entered, integrations shipped, etc., only with real numbers) and a podium/call-log presentation instead.

### Gaps
- No named, verified award-winning stat/achievement counter wall site found. No verified URLs for live kinetic hero sites other than Mat Voyce (domain from snippet).

## 3. Current stack and pitfalls for Next.js App Router (Next 16 / React 19)

### Takeaway
Use `lenis/react` with `autoRaf:false`, driven from `gsap.ticker`, plus `useGSAP` in client components; load R3F via `next/dynamic` with `ssr:false` inside a Client Component, gated by capability/reduced-motion checks. R3F v9 pairs with React 19.

### Cited Findings
- Lenis + ScrollTrigger (official README): `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `gsap.ticker.lagSmoothing(0)`. — [Lenis README via Context7](https://github.com/darkroomengineering/lenis/blob/main/README.md)
- React binding: `import { ReactLenis } from 'lenis/react'`; `<ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />`; in `useEffect` add a ticker callback calling `lenisRef.current?.lenis?.raf(time*1000)` and remove it on cleanup. — [Lenis React README](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md)
- Tutorials agree: mount provider once in root layout as a client component; need `'use client'`; avoid two RAF loops; destroy Lenis/remove ticker on unmount; older guides use `@studio-freight/lenis` (renamed to `lenis`). Tutorial snippets were partial; verify against official docs. — [Han Tran](https://www.hontran.dev/blog/nextjs-smooth-scroll-gsap-lenis); [Rahul Patel](https://rahhuul.github.io/blog/gsap-scrolltrigger-lenis-nextjs-scroll-animations/)
- `useGSAP` (`@gsap/react`): replacement for useEffect/useLayoutEffect using `gsap.context()` for cleanup; `scope` ref limits selectors; wrap post-hook callbacks (click handlers, timeouts) in `contextSafe()`; handles React Strict Mode double-effects; SSR-safe (layout effect when window exists); in App Router add `"use client"`; `revertOnUpdate:true` reverts on deps change. Page does not cover matchMedia/reduced motion. — [GSAP React docs](https://gsap.com/resources/React/)
- GSAP: every plugin free, available in the public npm package via `gsap/SplitText` etc. (search-result skill pages; Webflow announcement). `gsap.matchMedia()` supports responsive and accessibility-aware animations (aggregator mention only; no code seen). — [Webflow](https://webflow.com/blog/gsap-becomes-free)
- Next.js docs (updated 2026-03-10): `ssr:false` with `next/dynamic` only works in Client Components; errors in Server Components; `loading` option for a placeholder; `React.lazy`+Suspense prerenders by default. — [Next.js lazy loading](https://nextjs.org/docs/app/guides/lazy-loading)
- R3F: v9 pairs with React 19 (v8 with React 18); React Three Fiber v10 branch exists in Context7 index (not verified as released); Next.js 13.1+ may need `transpilePackages: ['three']`; `<Canvas frameloop="demand">` renders only on change. — [R3F installation docs](https://github.com/pmndrs/react-three-fiber/blob/master/docs/getting-started/installation.mdx); [R3F scaling performance](https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx)
- Mobile: complex scenes, high-res textures, heavy postprocessing overwhelm mobile GPUs; recommended gating 3D behind WebGL capability + reduced-motion checks, rendering a static image otherwise. — [fixdevs R3F troubleshooting](https://fixdevs.com/blog/react-three-fiber-not-working/)
- Perf practices from Mat Voyce case study: transform/opacity only, split text once, lazy-load media, static rendering. — [Hon Tran](https://www.hontran.dev/blog/mat-voyce-case-study-award-winning-portfolio)

### Inferences
- Suggested wiring: `SmoothScroll` client provider in root layout; register ScrollTrigger once; call `ScrollTrigger.refresh()` after fonts load (my recommendation); wrap animations in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` and disable Lenis (`lerp:1`/not mounted) when reduced motion is set.
- Shader background: a single full-screen fragment shader on a small `<Canvas dpr={[1,1.5]} frameloop="demand"|"always" while visible>`, dynamically imported with `ssr:false` after idle/IntersectionObserver, paused when off-screen; CSS gradient/poster fallback for mobile and reduced motion. Keep the LCP element as HTML text (not canvas) so the canvas load never gates LCP. These are standard recommendations I did not source from docs.
- Lazy loading: keep the hero as server-rendered/static text; load R3F/three (large bundle) only on demand; avoid layout shift by reserving canvas size (CLS); avoid animating layout properties (INP).

### Gaps
- Exact current versions of next, react, gsap, @gsap/react, lenis, three, @react-three/fiber, drei were NOT verified (no npm registry lookup). Verify with `npm view` before pinning. Not verified: R3F v9 explicitly tested on Next 16; Lenis behavior with Next 16 view transitions/route changes (ScrollTrigger refresh on navigation).
- No official Core Web Vitals page fetched; web.dev guidance (LCP/CLS/INP thresholds) not cited here.
- Official GSAP matchMedia/prefers-reduced-motion docs not fetched; drei docs not queried.
