# FootyScope — Research & Planning Document

**Date:** 2026-03-30
**Brand:** FootyScope
**Purpose:** AFL draft prospect scouting & analytics website

---

## 1. Project Vision

FootyScope aims to be the **247Sports of AFL draft prospects** — a structured, database-driven scouting platform that separates itself from existing competitors through **direct, analytical content** rather than hype. The site doubles as a portfolio piece and a foundation for a growing brand (website + Instagram + paid scouting reports).

### Core Goals (Year 1)
- Prospect rankings page modelled on 247Sports (sortable, filterable — first of its kind in AFL)
- Individual player profile pages (stats, written analysis, embedded video)
- Homepage with articles/reports (player names link to profiles)
- Expression of interest form for paid junior scouting reports
- Visually striking, modern design that works as a job portfolio

### Future Goals (Year 2+)
- Composite/consensus rankings aggregating multiple analysts
- Interactive comparison tools (side-by-side player comparisons)
- Community features (user phantom drafts, polls)
- Premium/subscription tier for deep analysis
- Podcast integration
- Live draft tracker

---

## 2. Competitive Landscape

### Direct Competitors

| Site | Strengths | Weaknesses | Opportunity for FootyScope |
|------|-----------|------------|---------------------------|
| **Rookie Me Central** | Deep content library, radar charts, strong social, free access | WordPress-based, static profiles, no interactive data tools, hype-focused tone | Be more analytical & direct, offer dynamic database-driven rankings |
| **Baseline Sports** | Strong video integration, grassroots coverage | Smaller scale, less comprehensive written analysis | Combine video quality with deeper written scouting |
| **AFL.com.au Draft Hub** | Official source, Cal Twomey's Phantom, massive reach | Partial paywall (AFL+), prospect profiles are articles not structured data, buried in general AFL content | Dedicated draft-only experience with structured data |
| **Zero Hanger** | Broad coverage, mock drafts, free | General AFL site, draft is a subsection | Dedicated focus gives depth advantage |
| **DraftGuru** | Unmatched historical database, pick value calculator | No prospect scouting/profiles, minimal visual design | Combine historical context with forward-looking scouting |
| **HPN Footy** | Analytics-focused, consensus phantom draft concept | Academic tone, niche audience | Make analytics accessible and visually engaging |
| **The Mongrel Punt** | Independent voice, detailed phantoms | Blog format, community-driven quality varies | Professional presentation with consistent analytical quality |

### Key People in the Space
- **Cal Twomey** (AFL.com.au) — Pre-eminent AFL draft analyst, Phantom Form Guide
- **Kevin "Shifter" Sheehan** — AFL Talent Ambassador
- **Chris Doerre / "Knightmare"** (ESPN) — Long-running draft expert
- **"The Wolfman"** (Mongrel Punt) — Independent phantom drafter
- **BigFooty community analysts** — "Goodoil" and others

### Instagram Competitors
- @thedraftscout — Dedicated AFL draft scouting
- Baseline Sports — Strong Instagram presence
- Rookie Me Central — Active social media

---

## 3. Market Gaps & FootyScope's Opportunity

These are the **key gaps** in the current AFL draft content landscape that FootyScope can fill:

### Gap 1: No 247Sports Equivalent
No AFL site offers structured, database-driven prospect profiles with standardised ratings and filterable/sortable rankings. **This is FootyScope's primary differentiator.**

### Gap 2: No Star Rating / Standardised Scoring System
HPN does a consensus phantom draft, but there's no standardised prospect rating system equivalent to 247's star ratings. FootyScope can pioneer this for AFL.

### Gap 3: Limited Interactive Data Tools
Most sites are article-based. No one offers interactive comparison tools, data exploration dashboards, or dynamic filtering for AFL prospects.

### Gap 4: Champion Data's 2026 Expansion
Full statistical capture at ALL Coates Talent League and state league games means far more data is available than ever before. No consumer-facing site is presenting this data accessibly.

### Gap 5: Video + Data Integration
No site seamlessly combines structured prospect data with embedded video in a polished profile experience.

### Gap 6: Modern UX
Most existing sites are WordPress-based with dated design. A modern, mobile-first experience would immediately stand out.

---

## 4. The AFL Draft Ecosystem (Reference)

### Draft Types
- **National Draft** (late November): Primary event, 44-57 picks. Reverse ladder order.
- **Rookie Draft** (afternoon after National): ~24 selections, rookie list (cheaper cap hit)
- **Mid-Season Rookie Draft** (May): Fill vacancies from injuries/retirements
- **Pre-Season Draft**: Rarely conducted now

### Key Pathways
- **Coates Talent League** (formerly NAB League): Primary Victorian pathway, has its own app with live stats
- **State leagues**: SANFL, WAFL, NEAFL for non-Victorian prospects
- **National Championships**: U18 and U16 carnivals, major scouting events
- **AFL Draft Combine**: National and state-level testing
- **Next Generation Academies (NGA)**: Club-linked development programs
- **Father-Son**: Players whose fathers played 100+ games for a club

### Key Stats & Metrics for Prospects
**Combine Testing:** 20m sprint, agility test, standing/running vertical jump, 2km time trial, kicking efficiency, disposal efficiency

**In-Game Stats:** Disposals, contested/uncontested possessions, marks, contested marks, tackles, inside 50s, clearances, metres gained, time on ground

**Physical:** Height, weight, wingspan, standing reach

**GPS:** Speed, distance, high-speed running, acceleration

**Intangibles:** Skills assessment, mindset, character (interviews, observation)

---

## 5. FootyScope Rating System (Proposed)

Inspired by 247Sports but adapted for AFL:

### Scope Rating (1-100 scale)
- **90-100 — Elite Prospect (5 Scopes):** Top 5-8 players in the draft class. Likely top-10 picks.
- **80-89 — Premium Prospect (4 Scopes):** First-round quality. Strong chance of immediate senior impact.
- **70-79 — Quality Prospect (3 Scopes):** Second/third round projected. Solid AFL pathway players.
- **60-69 — Developing Prospect (2 Scopes):** Rookie draft or mature-age pathway. Upside but needs development.
- **Below 60 — Watch List (1 Scope):** On the radar but unproven at this stage.

### Rating Attributes (Radar Chart)
1. **Athleticism** — Speed, endurance, agility, power
2. **Kicking** — Efficiency, range, both feet
3. **Marking** — Contested and uncontested
4. **Ball Winning** — Contested possessions, clearances, tackling
5. **Decision Making** — Disposal by foot and hand under pressure
6. **Football IQ** — Positioning, game sense, reading the play
7. **Versatility** — Ability to play multiple positions/roles
8. **Competitiveness** — Intensity, willingness to contest, effort
9. **Ceiling** — Projected upside and development trajectory

---

## 6. Site Architecture

```
FootyScope.com.au
│
├── Home
│   ├── Hero section (featured prospect / latest article)
│   ├── Latest articles/reports feed
│   └── Quick links to rankings, top prospects
│
├── Rankings
│   ├── Sortable/filterable table (247Sports style)
│   ├── Filters: Year, Position, State, Rating, Height range
│   ├── Search bar
│   └── Each row links to player profile
│
├── Player Profile (dynamic route: /players/[slug])
│   ├── Header: Photo, name, rating, position, physical stats
│   ├── Radar chart (9 attributes)
│   ├── Bio & key info (team, pathway, age, draft eligible year)
│   ├── Stats table (combine + in-game)
│   ├── Scouting report (written analysis — strengths, weaknesses, projection)
│   ├── Video section (embedded YouTube highlights)
│   └── Related articles mentioning this player
│
├── Articles / Reports
│   ├── Article list with filters (type, date, player tags)
│   └── Individual article pages (player names link to profiles)
│
├── About
│   ├── About FootyScope & the analyst
│   └── Contact / Expression of Interest form
│
└── (Future) Tools
    ├── Player comparison
    ├── Mock draft builder
    └── Draft tracker
```

---

## 7. Recommended Tech Stack

### Frontend Framework: **Nuxt 3 (Vue.js)**
- **Why:** Vue ecosystem — developer is familiar with Vue, Nuxt provides SSR/SSG for SEO, file-based routing, auto-imports, server API routes, and excellent DX. Nuxt 4 compatibility mode enabled.
- **Alternative considered:** Next.js (React — larger job market but developer prefers Vue)

### Styling: **Tailwind CSS + shadcn-vue + GSAP/Vue Motion**
- **Tailwind CSS:** Utility-first, rapid development, consistent design system
- **shadcn-vue:** Vue port of shadcn/ui — beautiful, accessible components (tables, forms, cards, dialogs)
- **GSAP or @vueuse/motion:** Scroll animations, page transitions, hover effects for the "flashy" factor

### Content Management: **Nuxt Content (Markdown/MDX) → Headless CMS later**
- Start with Nuxt Content module for articles and player data (markdown files, version controlled, no external dependencies)
- Migrate to **Sanity** or **Payload CMS** when content volume grows
- Player data can live in structured JSON/YAML files initially

### Data Visualization: **Chart.js (vue-chartjs) + custom SVG**
- vue-chartjs for radar charts, bar charts, stat comparisons
- Custom SVG for the "Scope Rating" visual indicator
- Consider D3.js for more complex visualizations later

### Backend/Database: **Firebase**
- **Firebase Hosting:** Free tier (10GB storage, 360MB/day transfer), global CDN, custom domain support
- **Firestore:** NoSQL database for player data, form submissions, user accounts (future)
- **Firebase Functions:** Server-side logic when needed (form processing, email notifications)
- **Firebase Auth:** Ready for future premium/subscription features
- Cost-effective: generous free Spark plan, pay-as-you-go Blaze plan scales cheaply

### Video: **YouTube embeds**
- Free, reliable, widely used by the target audience
- Lazy-load embeds for performance (use lite-youtube-embed or similar)

### Forms: **VeeValidate + Zod**
- Expression of interest form with validation
- Firebase Functions or Nuxt server route to handle submissions (email notification or Firestore storage)

### Hosting: **Firebase Hosting**
- Free Spark plan for launch, Blaze plan if traffic grows
- Custom domain: footyscope.com.au
- Automatic SSL, global CDN

### Analytics: **Firebase Analytics + Plausible (or PostHog)**
- Privacy-friendly, lightweight
- Track which players/articles get most views

---

## 8. Design Direction

### Visual Identity
- Use existing FootyScope logos and colour scheme (from client's brand assets)
- Dark mode primary (sports/analytics feel — similar to Rookie Me Central, ESPN)
- Light mode available as toggle
- Bold typography — strong headings, clean body text
- Card-based layouts for prospect lists and articles

### "Flashy" Elements
- **Animated page transitions** (Framer Motion) — smooth route changes
- **Scroll-triggered animations** — stats and radar charts animate in on scroll
- **Parallax hero sections** — dynamic, layered hero images
- **Hover effects on player cards** — subtle scale, glow, stat preview
- **Animated rating reveal** — Scope Rating animates up to its value
- **Gradient accents** — brand colours used as gradients on borders, backgrounds
- **Skeleton loading states** — polished loading experience
- **Micro-interactions** — buttons, toggles, filters respond with smooth animations

### Typography Suggestions
- Headings: Bold, condensed sans-serif (e.g., Inter Tight, Oswald, or Bebas Neue)
- Body: Clean sans-serif (e.g., Inter, DM Sans)
- Stats/numbers: Monospace or tabular figures (e.g., JetBrains Mono, Space Mono)

### Responsive Design
- Mobile-first approach
- Rankings table collapses to card view on mobile
- Player profiles stack vertically on mobile
- Touch-friendly filter controls

---

## 9. Monetisation Strategy (Phased)

### Phase 1 — Free (Year 1)
- All content free to build audience and credibility
- Focus on growing Instagram + website traffic
- Paid junior scouting reports via expression of interest form (direct service, not site subscription)

### Phase 2 — Soft Monetisation (Year 2)
- Tip jar / Buy Me a Coffee
- Sponsored draft guides or articles
- Newsletter with sponsor slots

### Phase 3 — Premium (Year 3+)
- Freemium model: basic rankings free, detailed scouting reports behind paywall
- Subscription tiers (basic free, premium $5-10/month)
- Paid PDF draft guides
- Community Discord access

---

## 10. Content Strategy

### Launch Content (Minimum Viable)
- 20-30 player profiles for current draft class (top prospects)
- Rankings page with all profiled players
- 2-3 introductory articles (draft class overview, methodology explanation, top 10 breakdown)
- About page with analyst bio and EOI form

### Ongoing Content
- Player profile updates as season progresses
- Match reports / round reviews (when time allows)
- Rankings updates (monthly or after key events like National Championships, Combine)
- Instagram cross-promotion (link Instagram content to full website profiles)

### SEO Strategy
- Target long-tail keywords: "[Player Name] AFL draft profile", "2026 AFL draft rankings", "AFL draft prospect rankings"
- Structured data (JSON-LD) for player profiles
- Fast page loads via static generation
- Internal linking: every player name mention links to their profile

---

## 11. Development Phases

### Phase 1 — Foundation (Weeks 1-3)
- [ ] Next.js project setup with Tailwind + shadcn/ui
- [ ] Design system: colours, typography, spacing, components
- [ ] Layout: header, footer, navigation, responsive shell
- [ ] Home page with hero, article feed placeholder
- [ ] Dark/light mode toggle

### Phase 2 — Core Features (Weeks 3-6)
- [ ] Rankings page with sortable/filterable table
- [ ] Player profile page template
- [ ] Player data structure (JSON/MDX schema)
- [ ] Radar chart component for player attributes
- [ ] Stats display components
- [ ] YouTube video embed section
- [ ] Populate 10-15 player profiles as proof of concept

### Phase 3 — Content & Polish (Weeks 6-8)
- [ ] Articles/blog section with MDX support
- [ ] Article page template with player name auto-linking
- [ ] About page
- [ ] Expression of interest form (with email notification)
- [ ] Animations and micro-interactions (Framer Motion)
- [ ] SEO optimization (metadata, structured data, sitemap)

### Phase 4 — Launch & Iterate (Week 8+)
- [ ] Deploy to Vercel with custom domain
- [ ] Analytics setup
- [ ] Populate remaining player profiles
- [ ] Cross-promote on Instagram
- [ ] Gather feedback and iterate

---

## 12. Key Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Time constraints (work + uni) | Phase approach, MVP first, content can be added incrementally |
| Limited player data availability | Start with publicly available combine/stats data, add own scouting notes |
| Copyright on game footage | Use YouTube embeds (fair use for analysis), credit sources |
| Competing with established brands | Differentiate through UX quality and analytical depth, not volume |
| Tech complexity for one developer | Use proven stack (Next.js + Tailwind + shadcn/ui), avoid over-engineering |
| Content freshness | Structured data (ratings, stats) is quick to update vs. full articles |

---

## 13. Sources & References

### Competitor Sites
- [Rookie Me Central](https://central.rookieme.com/afl/)
- [Baseline Sports](https://www.baselinesports.tv/)
- [AFL.com.au Draft Hub](https://www.afl.com.au/draft)
- [DraftGuru](https://www.draftguru.com.au/)
- [Zero Hanger AFL Draft](https://www.zerohanger.com/afl/afl-draft/)
- [HPN Footy](https://www.hpnfooty.com/)
- [The Mongrel Punt](https://themongrelpunt.com/)
- [BigFooty Draft Hub](https://www.bigfooty.com/forum/forums/draft-hub-with-phantom-drafts.284/)

### Inspiration Models
- [247Sports Recruit Rankings](https://247sports.com/Season/2026-Basketball/RecruitRankings/)
- [ESPN AFL Draft Coverage](https://www.espn.com/afl/)

### Market Data
- Champion Data 2026 stats expansion to full capture at all state/talent league games
- AFL social media: 2.1M+ reactions, 4.7M video views, 4.4M users on AFL Media Network
- Global sports technology market: USD 22.86B (2025) → USD 60.49B (2030)
- Sports analytics market: USD 4.2B (2023) → USD 19.3B (2030)
