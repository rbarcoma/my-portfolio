# 🚀 Developer Portfolio — Complete Implementation Plan

**Owner:** Renante Barcoma ("BARCOMA, RENANTE")
**Stack:** Laravel 13 · Inertia.js 2 · React 19 · Tailwind CSS 4 · shadcn/ui · Vite 8 · React Bits
**Status:** Plan (v1) — awaiting approval before implementation

---

## 0. Current State & Key Decisions

| Item | State |
|---|---|
| Laravel | 13.x (PHP 8.3+), fresh scaffold, SQLite, Sail available |
| Frontend | Vite 8 + Tailwind CSS 4 (`@tailwindcss/vite`), Bunny font: Instrument Sans |
| React / Inertia | ❌ Not installed yet — Phase 0 adds it |
| Node | v24.21.0 (installed via nvm) ✅ |
| Figma MCP | Configured ✅ — can extract design tokens from your Figma file on request |

**Architecture decision:** Use **Inertia.js 2 + React 19** on top of the existing Laravel app.
- ✅ Matches your skill set (Laravel, React, Inertia.js, Tailwind, shadcn/ui, Vite)
- ✅ Per-page code splitting (multi-page feel, SPA smoothness)
- ✅ Persistent layout shell → nav/footer/cursor never remount between pages
- ✅ Laravel backend powers contact form + GitHub API caching
- ✅ Ziggy gives typed route helpers in React

**New dependencies:**
```bash
composer require inertiajs/inertia-laravel tightenco/ziggy
npm install @inertiajs/react react react-dom @vitejs/plugin-react \
  framer-motion lucide-react class-variance-authority clsx tailwind-merge
# Only if specific React Bits need them (installed lazily per phase):
npm install gsap @gsap/react three @react-three/fiber ogl
```

---

## 1. Information Architecture

**Model: Multi-page Inertia app with a persistent shell** (nav + footer + custom cursor + scroll progress stay mounted; only page content swaps → instant-feeling transitions, real URLs, per-page code splitting).

```
/                    Home        — hero "FULL-STACK DEVELOPER"
/about               About       — bio, photo, values, quick facts
/skills              Skills      — categorized capability grid
/projects            Projects    — featured grid (3 projects)
/projects/{slug}     Case study  — deep-dive per project
/experience          Experience  — education/journey timeline (2023–2027 OLFU)
/contact             Contact     — form + direct channels
/cv                  CV download (PDF, tracked)
```

**Navigation:** Fixed top bar (desktop) with active-state indicator + `Dock` (React Bits) as a secondary quick-nav; mobile gets a full-screen `Sheet` menu. Footer is global with sitemap, socials, and "back to top".

**Content strategy:** All portfolio content lives in versioned PHP config files (`config/portfolio.php`, `config/projects.php`) — no database needed, easy to edit, fast to render. Contact messages persist to SQLite + email notification.

---

## 2. Visual Direction

**Concept: "Precision Engineering"** — dark, technical, confident. Feels like a high-end dev tool, not a template.

- **Theme:** Dark-first (`#0A0A0F` base) with a single electric accent — **lime `#C6FF3E`** (alt: cyan `#22D3EE`). Subtle grid lines + film-grain noise overlay for texture.
- **Typography (3 roles):**
  - Display: **Space Grotesk** (700) — oversized headings, `clamp(3rem → 8rem)` hero
  - Body: **Inter** (400/500) — readable, neutral
  - Mono: **JetBrains Mono** — labels, section indices (`01 — ABOUT`), code accents
- **Layout language:** 12-col grid, generous whitespace, oversized numerals, hairline borders (`white/10`), glass cards (`backdrop-blur`).
- **Motion personality:** Snappy & precise — 200–500ms, `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). Nothing floaty.
- **Design tokens:** Defined once in `app.css` via Tailwind 4 `@theme` (colors, fonts, easing, spacing) → consumed by shadcn/ui + React Bits.
- 🎨 **Figma tie-in:** If you share your Figma file link, I'll pull exact colors/typography via the Figma MCP and map them into the `@theme` tokens.

---

## 3. Page / Section Structure

### Home `/`
1. **Hero** — full viewport. Background: `Aurora` or `DotGrid` (lazy-loaded). Eyebrow: `HELLO, I'M RENANTE` (mono, ScrambleText). Main: **"FULL-STACK DEVELOPER"** in giant SplitText with staggered char reveal + GradientText on "DEVELOPER". Sub-line with `RotatingText` ("I build *Laravel apps / React UIs / APIs / dashboards*"). **CTA row: [↓ Download CV] (ClickSpark + StarBorder) + [View Projects]**. Scroll cue at bottom.
2. **Marquee strip** — `ScrollVelocity` band: `LARAVEL • REACT • TAILWIND • PHP • …`
3. **Featured projects preview** — 3 `TiltedCard`s + "View all →"
4. **Stats band** — `CountUp`: years coding, projects shipped, technologies, commits
5. **Mini About** — photo + 2-line bio + "More about me →"
6. **CTA footer band** — "Let's build something" → Contact

### About `/about`
Portrait (GlareHover) + bio, "how I work" values grid (SpotlightCard ×3), quick facts, tech comfort radar (simple bars), resume highlights, Download CV repeated.

### Skills `/skills`
Grouped by category with animated proficiency bars + icon grid:
- **Frontend:** HTML, CSS, JavaScript, React, Inertia.js, Tailwind CSS, shadcn/ui
- **Backend:** PHP, Laravel, Python, SQL, MySQL, Composer
- **Tools & DevOps:** Git/GitHub, Docker, NPM, Vite
- **Design:** Figma, Canva
Filter tabs (GooeyNav-style) + hover cards showing "used in → project X".

### Projects `/projects` + `/projects/{slug}`
| # | Project | Slug | Angle |
|---|---|---|---|
| 1 | Energy Consumption Forecasting with DSS | `energy-forecasting-dss` | Data/AI + decision support; charts, Python |
| 2 | Q8 Private Booking Resort | `q8-booking-resort` | Full-stack booking engine; Laravel + MySQL |
| 3 | Assembly and Disassembly Simulator | `assembly-simulator` | Interactive simulation/education tool |

Index: alternating large cards (PixelTransition image hover, tech badges, status pill: Live/WIP/Private). Case study: hero image, meta sidebar (role, year, stack, links), overview, features, challenges→solutions, gallery, big "Visit live site" CTA, prev/next project nav.

### Experience `/experience`
Vertical timeline, line draws on scroll (ScrollFloat):
- **2023–2027 — Our Lady of Fatima University** (BS program; add course name, relevant coursework, orgs, honors — placeholders to fill)
- Extensible: certifications, hackathons, freelance items later.

### Contact `/contact`
Split layout: left = big TrueFocus heading "LET'S TALK" + email/socials (Magnetic icons); right = form (name, email, subject, message) with Inertia validation, honeypot + rate limiting, success toast.

### Footer (global)
Oversized name watermark, sitemap links, socials, "Built with Laravel + React" line, local time (live clock), © year, back-to-top.

---

## 4. Component Architecture

```
resources/js/
├── app.jsx                    # Inertia bootstrap, Ziggy, theme init
├── Pages/                     # Inertia pages (lazy-loaded)
│   ├── Home.jsx  About.jsx  Skills.jsx
│   ├── Experience.jsx  Contact.jsx
│   └── Projects/Index.jsx  Projects/Show.jsx
├── Layouts/
│   └── RootLayout.jsx         # persistent: Navbar, Footer, CustomCursor,
│                              # ScrollProgress, PageTransition wrapper
├── Components/
│   ├── ui/                    # shadcn/ui (button, card, badge, input,
│   │                          # textarea, sheet, tooltip, dialog, separator)
│   ├── reactbits/             # vendored React Bits (JS + Tailwind variants)
│   ├── sections/              # Hero, Marquee, FeaturedProjects, StatsBand,
│   │                          # AboutTeaser, CtaBand, SkillsGrid,
│   │                          # ProjectCard, Timeline, ContactForm,
│   │                          # GitHubPanel, Footer
│   └── common/                # SectionHeading, CvButton, TechBadge,
│                              # StatusPill, MagneticIcon, Reveal
├── hooks/
│   ├── useReducedMotion.js  useMediaQuery.js  useScrollDirection.js
├── lib/
│   └── utils.js               # cn() helper
└── data/                      # (optional) JSON mirrors of PHP config for TS hints
```

**Backend:**
```
app/Http/Controllers/
├── HomeController.php  AboutController.php  SkillsController.php
├── ProjectController.php (index/show)  ExperienceController.php
├── ContactController.php (store + validation + mail + rate limit)
└── GitHubController.php (cached stats proxy)
routes/web.php: 7 GET routes + POST /contact + GET /cv + GET /github/stats
```

**Data flow:** Controllers pass plain arrays to Inertia (`Inertia::render('Home', [...])`). GitHub stats fetched server-side, cached 1h, delivered as props (no client API keys).

---

## 5. Animation Strategy

**Principles:** Purposeful > decorative · transform/opacity only (GPU-safe) · 60fps · everything respects `prefers-reduced-motion` (global hook swaps animations for instant fades).

| Layer | Tool | Where |
|---|---|---|
| Page transitions | Inertia + framer-motion `AnimatePresence` | fade+slide 250ms between pages |
| Section reveals | framer-motion `whileInView` | every section, stagger 80ms |
| Text reveals | React Bits SplitText / ScrambleText | hero, section headings |
| Micro-interactions | CSS + framer-motion | buttons, cards, links (scale 1.02, glare) |
| Ambient | Canvas/WebGL (lazy) | hero background only |
| Scroll-driven | framer-motion `useScroll` | parallax, marquee, timeline draw |

**Timing tokens:** `fast: 200ms · base: 350ms · slow: 600ms · ease: [0.16,1,0.3,1]` — defined in `@theme` and reused everywhere.

---

## 6. React Bits Components (Selected)

Vendored into `Components/reactbits/` using the **JavaScript + Tailwind CSS** variants. Heavy deps (three.js/gsap) only pulled in when the component using them is code-split.

| Component | Used For | Deps |
|---|---|---|
| `SplitText` | Hero "FULL-STACK DEVELOPER" char-stagger | framer-motion |
| `GradientText` / `ShinyText` | Accent words, CV button label | none |
| `ScrambleText` / `DecryptedText` | Mono eyebrow labels (`01 — ABOUT`) | none |
| `RotatingText` | Hero role rotator | framer-motion |
| `CountUp` | Stats band numbers | framer-motion |
| `AnimatedContent` / `FadeContent` | Generic section reveals | framer-motion |
| `ScrollVelocity` | Skills marquee band | framer-motion |
| `ScrollFloat` / `ScrollReveal` | Experience timeline, About copy | gsap |
| `Magnet` | CTAs, social icons | framer-motion |
| `ClickSpark` | CV download button | none |
| `StarBorder` | Featured project card frame | none |
| `SpotlightCard` | Values grid, skill groups | none |
| `TiltedCard` + `GlareHover` | Project cards | framer-motion |
| `PixelTransition` | Project image hover | gsap |
| `Dock` | Desktop quick-nav (bottom) | framer-motion |
| `GooeyNav` | Skills filter tabs | gsap |
| `FlowingMenu` | Contact social links list | gsap |
| `TrueFocus` | Contact "LET'S TALK" heading | framer-motion |
| `Aurora` / `DotGrid` / `Particles` | Hero background (pick 1, lazy) | ogl / three |
| `SplashCursor` | Hero-only easter egg (toggleable) | ogl |
| `ProfileCard` | About page interactive card | three (optional) |

> Rule: **max 1 ambient background + 1 cursor effect active at a time.** Every React Bits component is wrapped in a local adapter (`<LazyAurora/>` etc.) using `React.lazy` + `Suspense` so three.js/ogl never touch the main bundle.

---

## 7. Cursor Interactions

- **Custom cursor** (`CustomCursor.jsx`): 8px dot + 32px trailing ring (lerp 0.15), `mix-blend-difference`. Scales ×2.5 over `[data-cursor="hover"]` elements; morphs into a **"VIEW ↗" pill** over project cards; hides over inputs/textareas (native caret).
- **Magnetic pull:** `Magnet` wraps primary CTAs + social icons (strength 0.35, radius 120px).
- **SplashCursor:** enabled only on the Home hero, auto-disabled on touch devices and reduced-motion.
- **Fallbacks:** `pointer: coarse` → native cursor, zero custom listeners. `:focus-visible` always shows a real focus ring (keyboard users unaffected).

---

## 8. Scroll Interactions

1. **Scroll progress bar** — 2px accent line, top of viewport (persistent layout).
2. **Hero parallax** — background moves at 0.4× speed, content fades/translates out by 60% scroll.
3. **Section reveals** — `whileInView` fade+rise, staggered children, `once: true`.
4. **Skills marquee** — `ScrollVelocity` reacts to scroll speed/direction.
5. **Sticky project stack** — project cards pin and stack (cards overlap with scale-down) on the Projects index.
6. **Timeline draw** — Experience line `scaleY` 0→1 tied to scroll progress; items pop in as line passes.
7. **Navbar state** — transparent → blurred glass after 40px; hides on scroll-down, shows on scroll-up.
8. **Back-to-top** — appears after 1 viewport; smooth scroll.

---

## 9. Project Presentation & Live Demos

**Content model** (`config/projects.php`): slug, title, tagline, year, role, stack[], status (live/wip/private), cover, gallery[], links {live, repo, video}, overview, features[], challenges[{problem, solution}], outcomes[], featured(bool).

**Presentation:**
- Index cards: cover image (WebP, `srcset`, blur-up placeholder), hover = PixelTransition + tilt + glare, tech badges, status pill.
- Case studies: full narrative (overview → features → challenges/solutions → outcomes), gallery with lightbox, meta sidebar, prev/next navigation.
- **Live demos:** prominent "🚀 Live Demo" button (external, `target=_blank`, rel=noopener). If no deployment: embedded video/GIF demo. If repo private (e.g., Q8 client work): "🔒 Private project — walkthrough available" state with request-access mailto.
- **Per-project OG images** for shareable links.

---

## 10. GitHub Contribution Integration

**Backend (Laravel, cached):**
- `GitHubController` → Service class `GitHubService` using HTTP client:
  - Profile: `GET /users/{username}` (repos count, followers)
  - Top repos: `GET /users/{username}/repos?sort=updated` → filter/sort by stars
  - Contributions: `github-contributions-api.jogruber.de/v4/{username}` (public contributions heatmap data) — no token needed; optional PAT later for private counts
- Cache responses 6h (`Cache::remember`), stale-while-revalidate pattern; graceful empty-state on failure.

**Frontend (`GitHubPanel` on About + Home teaser):**
- Contribution heatmap grid (custom, shadcn Tooltip on cells, lime intensity scale)
- Stat chips: repos · stars · contributions this year (CountUp)
- Top languages bar (colored segments)
- Pinned repo cards (name, description, stars, language dot) linking to GitHub
- Username placeholder: `renantebarcoma` → confirm before Phase 6.

---

## 11. Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| `< 640px` (mobile) | Hamburger → full-screen Sheet nav; Dock hidden; custom cursor OFF; hero text `clamp()` ~3rem; single-column stacks; particle counts ↓ 60%; sticky-stack → simple vertical list; marquee slower |
| `640–1024px` (tablet) | 2-col grids; Dock appears (bottom center); cursor effects ON (if fine pointer) |
| `≥ 1024px` (desktop) | Full experience: Dock + top nav, 12-col grids, all ambient effects, max-w-7xl content |

- Fluid type via `clamp()` everywhere (no breakpoint-jumping text).
- All hover-only info duplicated on tap (or always-visible on touch).
- Images: `srcset` + `sizes`; hero art swaps to static gradient on small screens.

---

## 12. Accessibility

- **Structure:** semantic landmarks (`header/nav/main/section/footer`), one `h1` per page, logical heading order, skip-to-content link.
- **Keyboard:** full tab flow; Dock/menus/links operable via Enter/Space; visible `focus-visible` rings (lime, 2px, offset); no keyboard traps; Escape closes Sheet/lightbox.
- **Contrast:** AA 4.5:1 for text (lime-on-dark verified for large text; body text stays white/70+).
- **Motion:** `prefers-reduced-motion` → disable parallax, marquee, splash cursor, char-stagger (instant reveals).
- **Media:** meaningful `alt` text; decorative canvases `aria-hidden`; icons have `aria-label`s.
- **Forms:** labeled inputs, `aria-describedby` errors, `aria-live` announcements on submit success/failure.
- **Target:** axe DevTools clean + Lighthouse Accessibility ≥ 95.

---

## 13. Performance

**Targets:** LCP < 2.0s · CLS < 0.1 · INP < 200ms · Lighthouse Perf ≥ 90 (mobile).

- **Code splitting:** Inertia lazy-loads every Page; `React.lazy` for three.js/ogl components (Aurora, SplashCursor, ProfileCard) — loaded after first paint, only on pages using them.
- **Assets:** images → WebP/AVIF, responsive `srcset`, `loading="lazy"` + `decoding="async"` (hero eager + `fetchpriority=high`); CV PDF served with correct headers.
- **Fonts:** Bunny Fonts (already configured) with `font-display: swap`; preconnect; subset weights only (400/500/700).
- **JS budget:** < 200KB gzipped initial route; bundle-analyzer check each phase; tree-shake lucide icons.
- **Backend:** GitHub API cached 6h; static content from config (zero DB queries on read pages); OPcache + `php artisan optimize` in production; Vite build with hashing + long-lived cache headers.
- **Monitoring:** Lighthouse CI in Phase 8; `vite build --mode production` size report each phase.

---

## 14. Development Phases

| Phase | Scope | Deliverable / Acceptance |
|---|---|---|
| **0. Scaffold** (½ day) | Install Inertia+React+Ziggy, `@vitejs/plugin-react`, shadcn/ui init, fonts (Space Grotesk/Inter/JetBrains Mono), `@theme` tokens, RootLayout shell, `.env` additions | `npm run dev` + `php artisan dev` serve the app; blank pages route correctly |
| **1. Design System** (½ day) | shadcn components, SectionHeading, CvButton, TechBadge, StatusPill, container/spacing rhythm | Story-style `/dev` route or single page showcasing primitives |
| **2. Home Hero** (1 day) | SplitText hero, ambient background (lazy), RotatingText, CV download (`public/cv/renante-barcoma-cv.pdf`), marquee, stats band | Home above-the-fold matches direction; CV downloads |
| **3. About + Skills** (1 day) | Bio layout, values SpotlightCards, SkillsGrid + filters, GitHub teaser slot | Both pages complete & responsive |
| **4. Projects** (1–2 days) | `config/projects.php`, index grid (TiltedCard/PixelTransition), 3 case-study pages, prev/next nav | All 3 projects browsable with real content placeholders |
| **5. Experience + Contact + Footer** (1 day) | Timeline, contact form (validation, rate-limit, mail/log), footer with live clock | Form sends + persists; timeline animates |
| **6. GitHub Integration** (½ day) | GitHubService + cache, GitHubPanel heatmap/stats/repos | Live data renders, graceful fallback |
| **7. Motion Polish** (1 day) | Custom cursor, Magnet, page transitions, scroll progress, sticky stack, reduced-motion pass | Feels alive; 60fps on mid-range hardware |
| **8. A11y + Perf Audit** (½ day) | axe + Lighthouse runs, keyboard walkthrough, image/font tuning, meta/OG tags, favicon | Lighthouse ≥ 95 a11y, ≥ 90 perf; zero axe criticals |
| **9. Content + Deploy** (½ day) | Real copy, CV PDF, photos, project links, deploy (VPS/Sail or shared host w/ `npm run build`), custom domain | Live URL 🎉 |

**Total estimate:** ~7–8 focused working days.

**Needed from you:** CV PDF · profile photo · GitHub username · email + socials (GitHub/LinkedIn) · project screenshots or live URLs · (optional) Figma file link for exact design tokens.

---

## Risk Notes

- **React Bits heavy components** (three.js) can bloat the bundle → mitigated by lazy-loading + one-ambient-effect rule.
- **GitHub contributions API** (community endpoint) may rate-limit → cached server-side + static fallback.
- **Q8 Resort** may be client-private → case study supports "private" presentation mode.
- **Laravel 13 + Inertia 2** compatibility is current and supported (Inertia 2 targets Laravel 10+).

---

*Next step: approve this plan (or request edits) → I'll start with Phase 0 scaffold.*