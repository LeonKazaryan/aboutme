# Award-winning creative developer portfolios: scroll-driven animation and WebGL/3D

Scope note: I did about 14 tool calls. Many Codrops and Awwwards pages returned 403 or only snippets. Implementation details marked "(inferred)" are my reasoning, not a source claim. Only URLs that appeared in search or fetch results are listed.

## Which portfolios use a 3D camera-flythrough or scroll-driven journey, and how is it built?

### Takeaway
Verified examples are Bruno Simon (drivable 3D world, not scroll-driven), Lusion's Oryzo (scroll moves the camera on Z), Explore Primland (camera glides over terrain on scroll) and Cartier Watches & Wonders (scroll through 3D rooms, Three.js + GLSL + GSAP + Lenis). Of these, only Bruno Simon's is a personal portfolio. The rest are studio or brand sites that show the scroll-to-camera pattern. No source gave source-level implementation, so the camera mapping below is inferred.

### Cited Findings
- Bruno Simon, Bruno's Portfolio. Live: https://bruno-simon.com. Awwwards Site of the Day on Jan 21, 2026 (8.11) plus Dev Award (7.65). Tags: 3D, WebGL, GSAP, Three.js. — [Awwwards](https://www.awwwards.com/sites/brunos-portfolio)
- The 2019 version was a Three.js world where you drive a red car. Collisions used Cannon.js primitive shapes, and the Three.js scene was updated each frame from the physics bodies. It was Awwwards Site of the Month (Nov 2019) and Developer Site of the Year 2019 (User's Choice). — [Awwwards annual awards 2019](https://awwwards.com/annual-awards-2019), [Awwwards SOTM](https://awwwards.com/bruno-simon-portfolio-wins-site-of-the-month-november.html), [Bruno's case study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b?rel=muzli)
- The newer version (repo named folio-2025) reportedly runs on WebGPU via TSL when available. A search snippet also shows "Portfolio Honors Dec 2025". I did not confirm either on the primary page. — [search-sourced Bruno case study listing](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b?rel=muzli)
- Oryzo by Lusion. Live: oryzo.ai. Awwwards Site of the Month (April 2026) plus Developer Award. A single cork-coaster product is rendered in Three.js, with eased inertial motion, and scrolling moves the camera along the Z-axis for real depth. — [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Explore Primland. Live: explore.ownprimland.com. Awwwards SOTD (Feb 2026). Cinematic terrain flythrough in Three.js with atmospheric fog; the camera glides as the user scrolls. Creator not named. — [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Cartier Watches & Wonders 2026 by Immersive Garden. Live: cartier.com/en-fr/watchesandwonders. Awwwards SOTD. Six self-contained 3D alcoves scrolled like museum rooms, with Three.js, GLSL, GSAP, Lenis and Web Audio. — [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Sleep Well Creative (sleep-well-creatives.com), Awwwards SOTD (Jan 2026). A scroll-driven illustrated 3D narrative on a Three.js stage. — [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Henry Heffernan, https://henryheffernan.com. The repo is MIT-licensed, about 2.6k stars, and has a companion repo for a 2D OS. A third-party project says its 3D outer layer is adapted from Heffernan's site. — [GitHub](https://github.com/henryjeff/portfolio-website), [ecosyste.ms mention](https://awesome.ecosyste.ms/projects/github.com%2Fhenryjeff%2Fportfolio-website)

### Inferences
- Single idea to copy (Oryzo / Primland): drive the camera from scroll progress. Likely implementation: Lenis feeds scroll progress into a GSAP ScrollTrigger timeline with `scrub`, which tweens `camera.position` / `lookAt` along a CatmullRomCurve3 path; in R3F this goes in a `useFrame` loop with damping. (Inferred; no source shows the code.)
- Single idea to copy (Bruno Simon): a physical, playable world as the portfolio's navigation. Cannon.js plus Three.js is a documented approach. It is a large solo effort.
- Single idea to copy (Cartier): section-per-scene structure. Each scroll section owns one self-contained 3D "room", which keeps scenes budgetable.
- Heffernan: I could not confirm Three.js, awards or the computer scene from fetched content. Mark unverified.

### Gaps
- No award found for Henry Heffernan's site. The "old computer" concept is from memory and unconfirmed here.
- No FWA win confirmed for Bruno Simon in these searches.
- No source gave camera-path code for Oryzo, Primland or Cartier.
- Awwwards pages for Primland, Cartier and Oryzo were not fetched directly. Awards come from one secondary roundup (Utsubo).

## Which use pinned horizontal timelines or stacked-card project sections?

### Takeaway
I did not find a verified portfolio documented as using a pinned horizontal timeline or stacked cards. This is a gap. The nearest verified items are Stefan Vitasović's shared scroll engine (WebGL project grid plus DOM pages) and Minh Pham's scroll-reveal system.

### Cited Findings
- Stefan Vitasović Portfolio 2025 (Codrops case study, Mar 5, 2025). A creative developer in Stockholm. The core problem was merging a WebGL scroll with navigation scroll. The solution was a shared scroll engine that keeps the same feel across a WebGL project grid and DOM motion on the about page. Search summary only; the page returned 403. — [Codrops](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/)
- Minh Pham portfolio, https://minhpham.design/, case study by creative developer Hon Tran (2026). Awwwards SOTD with developer score 7.77 and SOTD score 7.37. Uses GSAP + ScrollTrigger, inertia smooth scrolling, `gsap.matchMedia()` for reduced motion, and one shared easing/timing system for all scroll reveals. — [Hon Tran case study](https://www.hontran.dev/blog/minh-pham-portfolio-case-study)
- Awwwards scoring notes (jury-member blog, partisan source): the three scores furthest from the average are dropped; 6.5+ earns Honorable Mention. — [Hon Tran](https://www.hontran.dev/blog/how-to-build-an-award-winning-portfolio-site)

### Inferences
- Single idea to copy (Vitasović): one scroll source of truth. A single Lenis-style instance feeds both DOM (ScrollTrigger) and WebGL (uniform / mesh offsets), so the grid and pages feel identical. (Inferred.)
- Single idea to copy (Pham): one easing and duration token set shared by every reveal.
- Pinned horizontal sections are standard GSAP: ScrollTrigger `pin: true`, `scrub`, and an `x` tween on a wide track. Stacked cards use pinned sections with scale/y offsets. This is general knowledge and not from a cited portfolio.

### Gaps
- No verified award-winning portfolio specifically documented with pinned horizontal timelines or stacked cards. Needs a manual Awwwards filter.
- Vitasović's live URL and awards were not obtained.

## Which use full-screen shader, fluid or noise backgrounds that react to scroll or cursor?

### Takeaway
Verified: Minh Pham (noise-displacement fragment shader transitions driven by GSAP), Arnaud Rocca (optional fluid WebGL visuals, per Codrops summary), and Hubtown (cursor reveal in a 3D scene).

### Cited Findings
- Minh Pham: a fragment shader blends outgoing and incoming textures, displacing the UVs with a noise map. GSAP drives the blend uniform so shader motion shares easing with DOM motion. The scene initializes lazily, the render loop pauses off-screen, and pixel ratio is capped at 2. — [Hon Tran](https://www.hontran.dev/blog/minh-pham-portfolio-case-study)
- Arnaud Rocca's portfolio (Codrops, Mar 31, 2026): Nuxt/Vue, a reusable GSAP effect system (for example "fadeColor"), a `useGSAP`-style wrapper that scopes a GSAP context and cleans up ScrollTriggers, and optional fluid WebGL visuals. The fluid implementation and the live URL were not in the retrieved text, and no award was mentioned. — [Engineered.at summary](https://engineered.at/articles/arnaud-rocca-s-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl), [Codrops](https://tympanus.net/codrops/?p=112139)
- A Codrops piece "From Shader Uniforms to Clip-Path Wipes: How GSAP Drives My Portfolio" exists, which suggests GSAP tweening shader uniforms. I saw only its title and an aggregator. — [Engineered.at](https://engineered.at/articles/from-shader-uniforms-to-clip-path-wipes-how-gsap-drives-my-portfolio)
- Hubtown by Unseen Studio. Live: hubtown.co.in. Awwwards SOTD (June 2026). Glowing 3D monolith over a reflective landscape (Three.js, WebGL, GSAP), with a mouse-reveal that uncovers geometry and lighting. — [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- IVRESS by Utsubo. Live: brand.ivress.co.jp. FWA Site of the Month (May 2026). Three.js WebGPURenderer with WebGL fallback, with shaders written once in TSL. — [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- Robin Payot (Paris freelance creative developer). His 2021 portfolio won SOTD on Awwwards and FWA per his own Codrops interview. His Awwwards "Overlay menu" element is tagged webgl/glsl. Awwwards pages exist for 2018 (SOTD 7.44, Feb 24, 2018, concept/3D by Robin Poitevin) and 2022 (SOTD 7.52). Those are not from the 2024-2026 window. — [Codrops spotlight](https://tympanus.net/codrops/?p=96001), [Awwwards 2022](https://www.awwwards.com/sites/robin-payot-portfolio-2022)

### Inferences
- Single idea to copy (Pham): treat a shader uniform as just another GSAP tween target (`gsap.to(material.uniforms.uProgress, {...})`), so the DOM and WebGL share one timeline. Cheap in R3F.
- Single idea to copy (Hubtown): cursor-position uniform for a localized light or reveal. Cursor to uniform is a common approach (inferred).
- Pause the render loop off-screen and cap DPR at 2. This is a documented performance practice (Pham).

### Gaps
- The fluid-simulation technique (likely a Navier-Stokes style FBO) is not confirmed in sources.
- Robin Payot's 2021 portfolio URL and stack were not confirmed. The 2018 and 2021 awards may be different sites.

## Which are made by developers (not agencies) and are realistic to replicate solo with Next.js + GSAP + Lenis + R3F?

### Takeaway
Solo-developer sites verified: Bruno Simon, Stefan Vitasović, Hon Tran / Minh Pham (dev + designer pair), Arnaud Rocca, Clay Boan (collaboration), Robin Payot, Henry Heffernan. Most replicable solo: Pham-style shader transitions and Vitasović's shared scroll engine. Least: Bruno Simon's physics world and the Lusion / Immersive Garden / Unseen scenes, which are studio-scale.

### Cited Findings
- Clay Boan's portfolio: Codrops case study "The Underdog's Crown: Clay Boan's 3D Playground of Design, Motion, and GSAP Magic", a collaborative project blending 3D, WebGL and GSAP. Technical details not retrieved (403). — [Codrops](https://tympanus.net/codrops/?p=101496)
- Other 2025 Codrops portfolio case studies surfaced in search (summary only): Gianluca Gradogna "Portfolio '25" (Jan 30, 2025), Troa (Mar 2025, performance focus), stabondar.com (Mar 2025, GSAP, Three.js, physics effects). — [Codrops search listing](https://tympanus.net/codrops/2025/01/)
- Related: a Three.js forum "For Hire" post cites Awwwards Honors and GSAP SOTD for "mousham.design", year not stated. Unverified. — [Three.js forum](https://discourse.threejs.org/t/for-hire-creative-frontend-developer-three-js-r3f-gsap-awwwards-honors/93985)

### Inferences
- Recommended build order for a solo Next.js stack: (1) Lenis + ScrollTrigger synced via `gsap.ticker`; (2) DOM scrubbed text reveals with one shared easing set; (3) one R3F canvas with a plane shader (noise-displacement transition) driven by a GSAP uniform tween; (4) optional scroll-linked camera path. Skip physics worlds.
- The stack combination (GSAP + Lenis + Three.js) is also what Cartier used, per Utsubo, so it holds up at the top end.

### Gaps
- Solo-feasibility is my judgment; no source rates effort.
- I did not verify Next.js use on any listed site. Rocca's is Nuxt/Vue; Heffernan's repo uses Express and a bundler.
- Unfetched, so unverified: Vitasović's and Boan's live URLs and awards, the Awwwards pages for Oryzo / Primland / Cartier / Hubtown, and any CSSDA entries.
