# Terminal, loader, easter-egg and cursor portfolio references

Method note: ~13 searches and fetches. Several primary pages (Codrops, Medium) returned 403, so those claims rest on search-result excerpts and are marked. Only URLs that appeared in search or fetch results are listed. Most "live" terminal examples are GitHub-Pages hobby sites, not Awwwards winners. I found no verified Awwwards Site of the Day terminal portfolio. The result set is thinner than the 8-12 target for loaders and cursors, and the gaps are listed in each section.

## What are the best-executed terminal portfolios and how do they stay usable for recruiters?

### Takeaway
The best terminal portfolios keep the terminal as one view among several. They add a `help` command, tab completion, and a guided recruiter path. Verified terminal examples are mostly open-source projects. Vlad Burca's is the only one I found with Awwwards recognition (Honorable Mention). A GUI fallback was documented in none of the repos I read, so it is an opportunity.

### Cited Findings
- **1. Vlad Burca, vladburca.com** — a CLI-style product-design portfolio where visitors type commands. It has autocomplete, project cards, and a CLI-style 404 with a glitch effect and animated log. Awwwards Honorable Mention, 26 Mar 2026, built in plain HTML/CSS/JS, and the listing includes "Terminal Boot Sequence with System Init Animation" in its Loading category. Community scores average about 7.7, and usability votes ranged 4 to 9, so it is polarizing. Worth copying: the 404 page as a themed log, so a dead end still fits the brand. — [Awwwards listing](https://www.awwwards.com/sites/vlad-burca-product-designer); [Awwwards boot-sequence entry](https://www.awwwards.com/inspiration/terminal-boot-sequence-with-system-init-animation-vlad-burca-product-designer) (live URL vladburca.com comes from the listing; I did not open the live site).
- **2. Omganesh014 Terminal-Based-Portfolio** — live at omganesh014.github.io/Terminal-Based-Portfolio/. It has a boot sequence, a login gate, and a shell with ls, cd, cat, tree, find, grep, pipes and redirection. Stack: React 19, TypeScript, Vite, Zustand, xterm.js, with Playwright and axe-core in tests. It also has a graphical Desktop Workspace with resizable windows and an AI assistant (Groq, Llama 3.3, with offline Fuse.js search fallback). Worth copying: **Recruiter Mode**, a role-based tour (frontend, full-stack, backend, AI-ML) with a 3-minute inspection path. The README says "desktop-first with mobile-aware layouts" and does not mention reduced motion. — [GitHub](https://github.com/Omganesh014/Terminal-Based-Portfolio)
- **3. Termfolio (Solomon Neas)** — React 19 and TypeScript with xterm.js. Content sits in a virtual filesystem (ls, cd, cat). Visiting /projects runs `cd projects && ls`, so URLs deep-link into terminal state. It tells visitors to type `help`. The page I fetched (solomonneas.dev/projects/termfolio) returned 404, so this rests on a search summary only. — [search result](https://solomonneas.dev/projects/termfolio). Worth copying: URL routing mapped to terminal commands, which makes pages linkable and shareable.
- **4. Terminal OS (oyi77)** — xterm.js, 20+ custom commands. `whoami` shows a professional profile and leadership experience, and the site pulls live repo data from the GitHub API. Summary-level only, not fetched. — [oyi77.is-a.dev](https://oyi77.is-a.dev/portfolio/terminal/welcome-to-terminal-os/). Worth copying: `whoami` as the story entry point, and live GitHub data in `projects`.
- **5. ErionNezha terminal-portfolio** — live at erionnezha.github.io/terminal-portfolio/. Vanilla JS and Canvas API. Commands: help, about-me, projects, skills, contact, clear, snake. The `snake` game has touch controls. No GUI fallback documented. Worth copying: a short command list, with a game as one of the commands. — [GitHub](https://github.com/ErionNezha/terminal-portfolio)
- **6. USER1043 PortfolioWebsite (PR #7)** — a PR describing hidden commands, which are not an official feature. Jokes (`sudo`, `rm -rf /`, a fake vim session, `fortune`, `cowsay`, `coffee`, `hire-me`) live in `fun.js`. Hidden commands are excluded from `help`, Tab completion and "did you mean", so recruiters see a clean help. The help ends with a teaser that not every command is listed. A hidden `.secrets` file shows only in `ls -a`. Under `prefers-reduced-motion`, lines appear without fade-in and `coffee` skips its progress animation. The only URL is a Vercel preview, with no confirmed production domain. Worth copying: **hide easter-egg commands from help and completion, but hint that they exist.** — [PR #7](https://github.com/USER1043/PortfolioWebsite/pull/7)
- **7. pasanhansaka Portfolio** — live at pasanhansaka.github.io/Portfolio/. Vanilla JS, GSAP, Canvas and Web Audio. Boot logs from HTML/CSS keyframes simulate system checks, then a console with skills, projects, and a `matrix` command for matrix rain. No skip, reduced-motion or mobile notes in the README. — [GitHub](https://github.com/pasanhansaka/Portfolio)
- **8. ninja-ops-guy developer-portfolio (deprecated)** — a single `index.html` with no build step. It has a CRT look (scanlines, vignette, flicker), a boot sequence, and a typewriter hero with leetspeak glitch. It respects `prefers-reduced-motion` by disabling boot animation, flicker and glitch. The README names a successor, ninja-ops-guy.github.io/theemrld-portfolio, which I did not verify. Worth copying: the CRT effects are all gated on the reduced-motion query. — [GitHub](https://github.com/ninja-ops-guy/developer-portfolio)
- Other terminal-style repos surfaced but were not verified: [Arya7n/portfolio-Os](https://github.com/Arya7n/portfolio-Os) (boot, then desktop OS with a terminal app), [PortfolioOS demo](https://portfolio-os-beta.vercel.app/) (page text did not load for me), and [Blake Stevenson's portfolio](https://gh.r-mj.com/BlakeStevenson/portfolio) (Next.js and Tailwind, with `whoami --verbose`).
- Accessibility pattern from CLI tools generally, not portfolios: a linear plain-text mode toggled by flag, environment variable or `TERM=dumb`. — [lockedin-cli wiki](https://github.com/xjamesmorris/lockedin-cli/wiki/Accessibility-en-SG). I found nothing recruiter-specific.

### Inferences
- Recruiters need a path that needs no typing: clickable command chips, `help` shown on load, and a "classic view" toggle. Only Omganesh014's Recruiter Mode comes close to this in what I read.
- Vlad Burca's mixed usability scores (4 to 9) suggest terminal-only navigation costs usability points even when it wins on creativity.
- An xterm.js terminal is a canvas or DOM-renderer widget with weak screen-reader support. A parallel semantic HTML version of the content is the safer design. This is my reasoning and I found no source for it.

### Gaps
- No Awwwards Site of the Day or FWA terminal portfolio was verified.
- No source tested a terminal portfolio with Lighthouse or recruiter feedback.
- Mobile handling (virtual keyboard, tap-to-run commands) was undocumented in nearly all repos.

## What makes a preloader feel cinematic rather than annoying, and how do top sites tie it to their story?

### Takeaway
Evidence is limited. The documented patterns are: preload real assets, build the loader from content-themed copy (boot logs, counters), and use the loading phase for real work such as shader compilation. I found no source with data on ideal duration or skip buttons, so those are open questions.

### Cited Findings
- Joffrey Spitzer's portfolio (Astro, GSAP, Lenis, Three.js, Swup) has a preloader that mainly loads media and key assets so the site feels faster and more reliable. It uses ScrollTrigger timelines and SplitText with autoSplit. This is from a search excerpt, and the Codrops page returned 403, so I could not see the live URL or preloader timing. — [Codrops, Feb 2026](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)
- Gabriel Contassot's 2024 portfolio uses a preloader that does not monitor real loading. It is a block of changing numbers animated with transformX. An example of a purely theatrical counter. Search-excerpt only. — [Codrops, Apr 2024](https://tympanus.net/codrops/2024/04/24/case-study-gabriel-contassots-portfolio-2024/)
- A 2026 Codrops article on a 3D portfolio uses its preloader phase to precompile shaders with `gl.compileAsync()`. Search-excerpt only. Worth copying: the loader hides real GPU work, so the hero starts without a hitch. — [Codrops, Jun 2026](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)
- Terminal boot sequences double as thematic loaders: Vlad Burca (listed under the Awwwards "Loading" category), pasanhansaka (simulated system checks), Omganesh014 (boot then login gate). Links are in the section above.
- Bruno Simon's portfolio (Three.js, Cannon.js, GLTF with Draco compression, 50-70% lighter files) is a drivable 3D car scene. Over 400,000 visitors, Awwwards Site of the Month. I did not read his loader details because the case study returned 403. Sources disagree on whether it also won Site of the Year (Creative Bloq says yes, Pastel says nominated). — [Bruno Simon case study](https://medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b); [Creative Bloq](https://www.creativebloq.com/news/3d-car-portfolio); [Pastel](https://usepastel.com/blog/how-a-design-portfolio-got-the-attention-of-400-000-visitors)
- Other 2025 Codrops case studies that could hold loader details but were not read: [Stefan Vitasović](https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/) (shader effects, WebGL video grid, page transitions), [Gianluca Gradogna](https://tympanus.net/codrops/2025/01/30/case-study-gianluca-gradogna-portfolio-25/) (Nuxt, GSAP, custom smooth scroll).

### Inferences
- The best fit for a developer is a boot log whose lines reflect real tasks (fonts, assets, shader compile). That makes the loader both theme and function.
- A guard like `sessionStorage` to show the loader once per session, a skip key, and a short total time are standard advice. I found no source for them here.

### Gaps
- No source gave data on loader duration, skip rates, or bounce impact.
- I could not fetch the Codrops case studies, so GSAP timeline structures are unverified.
- No verified live Awwwards winner with a cinematic loader tied to the owner's profession.

## What hidden easter eggs, mini-games and cursor features are worth copying?

### Takeaway
Easter eggs work best when they respect accessibility (Esc to dismiss, reduced-motion) and are hinted rather than announced. The verified cursor evidence is about libraries and components, not specific live portfolios.

### Cited Findings
- **Bruno Salgado's portfolio (brunosalgado.dev)** documents six eggs: Konami code; six taps on the "BS" badge within 7 s; six presses of the 6 key within 5 s; six clicks on a footer "checksum: 0x06" within 8 s; six theme toggles within 8 s; and `?trace=6` in the URL. Esc dismisses any effect, and reduced-motion is respected. The page itself warns that rapid theme changes may be uncomfortable. It gives no keyboard alternative for the tap and click eggs. Worth copying: a single numeric motif ("six") across all eggs, and a published write-up of them. — [Bruno Salgado](https://brunosalgado.dev/writing/six-small-easter-eggs-hidden-in-this-portfolio)
- Hidden `snake` command (Erion Nezha) and `matrix` command (pasanhansaka): see section 1.
- Konami libraries: [konami-js](https://www.github.com/georgemandis/konami-js) supports keyboard and touch. Background on the code: [Wikipedia](https://en.wikipedia.org/wiki/Konami_Code).
- **Blobity** (gmrchk/blobity) is a canvas blob cursor with spring physics. A `data-blobity-tooltip` attribute turns the blob into a text label. It supports vanilla JS, React and Vue, has about 948 stars when indexed, and is GPLv3 with a commercial license. It has essentially no touch-device support. Worth copying: contextual labels via data attributes. — [docsearch listing](https://docsearch.algolia.com/mcp/docs/repo/gmrchk/blobity); [mirror](https://github.com/gregbyte/blobity); [Product Hunt](https://producthunt.com/posts/blobity)
- **Intent Label** (21st.dev, MIT) morphs a dot into a labeled pill via `data-intent`, with spring animation and keyboard-focus support. — [21st.dev](https://21st.dev/@ham7a311/components/intent-label.md)
- A Webflow portfolio uses a different emoji cursor per case study, editable from the CMS. — [Webflow](https://webflow.com/made-in-webflow/website/jchopra-l7684qmu)
- Codrops 2025 included a p5.js stop-motion crayon cursor tutorial (title only, not read). — [2025 year in review](https://tympanus.net/codrops/2025/12/29/2025-a-very-special-year-in-review/)
- Other cursor references seen only as search results: [Awwwards custom cursor with labels (NVRMND)](https://www.awwwards.com/inspiration/custom-cursor-with-labels-nvrmnd-studio), [supermouse.js cookbook](https://supermouse.js.org/docs/guide/cookbook).
- Bruno Simon's drivable 3D scene is the strongest example of the whole portfolio being a game (see the loader section for details).
- Custom cursors only work with a mouse; touch users never see them. — [Impact Media](https://www.impactmedia.co.uk/insights/add-some-fun-and-practicality-with-custom-cursors/)

### Inferences
- Gate the custom cursor behind `(hover: hover) and (pointer: fine)` and keep the native cursor for keyboard and touch users. My reasoning, not sourced.
- Egg triggers need a keyboard path and a reduced-motion variant, a gap Bruno Salgado's own write-up shows.

### Gaps
- I did not find specific live Awwwards portfolios with morphing-blob cursors that I could verify. Only libraries and components are verified.
- No Lighthouse or performance figures for any of these sites. Reduced-motion is documented only for ninja-ops-guy, USER1043 and Bruno Salgado. Canvas and WebGL cursor cost on low-end devices is unmeasured.
