# AEGIS — Design System

> **Analyst's Console** — quiet, dense, evidence-first.
> A workbench for embedded-security analysts, not a marketing product.
> Light-first, dark-ready. Korean-optimized (Paperlogy) with mono data (Geist Mono).

---

## 1. Philosophy

| Principle | In practice |
|---|---|
| **Information over decoration** | No gradients-as-background. Color = meaning. |
| **One accent color** | Electric blue for *interactive* only. Severity uses its own ramp. |
| **Density with air** | Compact rows, but generous section gaps (`--space-9` / 40px). |
| **Mono for data, sans for prose** | Geist Mono on IDs, counts, timestamps, slugs. Paperlogy on everything else. |
| **Animation = signal, not delight** | Pulse = "live right now". Laser bar = "working". That's it. |
| **Restraint in shadows** | Shadows only on floating surfaces (popover, modal, dragging). |

---

## 2. File Layout

```
assets/
  tokens.css                 ← :root custom props + dark overrides
  fonts.css                  ← Paperlogy @font-face, Geist Mono import
  base.css                   ← reset, html/body defaults, .sr-only, .mono, focus-visible
  auth-console.css           ← shared Login/Signup 58/42 split shell
  components/
    button.css               .btn .btn-primary .btn-ghost .btn-outline .btn-sm .btn-lg .trailing-btn
    input.css                .field .input .input-wrap .checkbox-row
    panel.css                .panel .panel-head .panel-tools .panel-foot
    pill.css                 .filter-pills .pill .approvals-pill
    seg.css                  .seg  (segmented control for Tweaks)
    toggle.css               .toggle-row .toggle
    severity.css             .sev-chip .gate .cell-gate .num-cell
    lang-tag.css             .lang-tag (C / C++ / Rust / Python / TS)
    divider.css              .divider .divider-v
    choreography.css         [data-chore] .chore.c-1..c-9 fade-up stagger
    nav.css                  .nav .nav-brand .nav-search .nav-icon .nav-user
  pages/
    login.css                .status-block (system heartbeat panel)
    signup.css               .onboard-list .notice .strength .section-group .org-verify
    dashboard.css            .main .page-head .attention-grid .cols .projects .activity .tweaks
  shield.svg.md              canonical shield SVG (nav + auth-console variants)
```

**Load order (every page):**
1. `fonts.css`
2. `tokens.css`
3. `base.css`
4. component CSS (any order, they don't cross-depend)
5. page CSS (last; wins on specificity ties)

---

## 3. Color

### 3.1 Surfaces (neutral cool grays)

| Token | Use |
|---|---|
| `--background` | App background. Near-white with 0.002-chroma cool tint. |
| `--surface` | Cards, panels, table, navbar. |
| `--surface-sunken` | Inset wells: thead, filter pills container, activity chips, inline search. |
| `--surface-raised` | Popovers, modals, Tweaks panel. |
| `--surface-overlay` | Modal scrim. |

### 3.2 Foreground

`--foreground` → `--foreground-muted` → `--foreground-subtle` → `--foreground-disabled`.
Body copy uses `muted`, primary emphasis uses `foreground`, captions use `subtle`.

### 3.3 Primary (single accent)

`--primary: oklch(0.58 0.18 250)` — electric blue.
**Only** used for: primary buttons, link accent, focus ring, running-state indicators, active filter, timeline `.proj` tags, user-avatar surface.
Never used as a decorative gradient — the avatar uses a *flat* `--primary` fill with `--primary-foreground` text, not a hue blend.

**`.proj` exception.** The timeline `.proj` label in Activity feed rows is colored `--primary` because it marks a project-identity link preview — the whole row is the click target, and the project name resolves to a route. This is the single non-button usage permitted.

### 3.4 Severity (meaning palette)

| Level | Color | Use |
|---|---|---|
| critical | red `0.55 0.21 25` | SEV-critical findings, blocked gate, live-build fail, alerts |
| high | orange `0.68 0.17 50` | SEV-high, warn gate, needs-revalidation |
| medium | amber `0.75 0.14 85` | SEV-medium, needs-review |
| low | muted-blue `0.62 0.12 230` | SEV-low, open status |
| info | neutral gray | default/unclassified |

Every severity has `-surface` (8-10% alpha tint) and `-border` (22-24% alpha) pair.
Severity colors NEVER appear on non-severity UI (buttons, links, navigation).

**Narrow exception — severity-bound numerals.** A bare integer that *itself* carries severity information (e.g. "3 critical findings", the counts in Activity feed lines, the `크리티컬 3건` in the page greeting) may be tinted with its matching severity color. The numeral IS the signal, not decoration. Never apply this to surrounding prose, icons, or unrelated chrome.

### 3.5 Dark theme

Set `data-theme="dark"` on `<html>`. Overrides surfaces, foregrounds, borders, primary (brighter for contrast), input, code-bg, ring. Severity colors unchanged.

**Pre-paint location.** The theme-restoration IIFE must sit at the **end of `<head>`**, *after* stylesheet links but *before* `</head>`. Any later (inside `<body>`) and the browser paints one frame in light mode before the class flips — visible as a white flash on reload. All pages conform: Login, Signup, Dashboard.

---

## 4. Typography

### 4.1 Families

- **Paperlogy** (Korean-optimized sans) — 300/400/500/600/700. Primary typeface.
- **Geist Mono** (variable) — all numbers, IDs, codes, timestamps, slugs, labels in uppercase, keyboard shortcuts.

### 4.2 Scale (medium density)

```
--text-2xs 11   --text-xs 12   --text-sm 13   --text-base 14
--text-md 15    --text-lg 17   --text-xl 20   --text-2xl 24
--text-3xl 30   --text-display 40
```

### 4.3 Weight & tracking

Weights: `regular 400 / medium 500 / semibold 600 / bold 700`.
Caps labels always pair `text-transform: uppercase` + `--tracking-caps (0.06em)` + mono.
Headings use `--tracking-tight (-0.01em)`.

### 4.4 Usage patterns

| Element | Font | Size | Weight |
|---|---|---|---|
| Page H1 (greeting) | sans | 28px | 600 |
| Section H2 | sans | 15px | 600 |
| Body | sans | 13px | 400 |
| Caps label | **mono** | 10-10.5px | 500-600 uppercase |
| Data number (count, SEV#) | **mono** | inherit | 600, tabular-nums |
| Timestamp, slug, ID | **mono** | 10.5-11px | 400 |
| Code / syntax | mono | 13px | 400 |

---

## 5. Spacing (4px base)

```
space-1  2     space-2  4     space-3  8     space-4  12
space-5  16    space-6  20    space-7  24    space-8  32
space-9  40    space-10 48    space-11 64    space-12 80    space-13 96
```

**Section rhythm:**
- Inside a panel body: `--space-5` padding, `--space-4` gap.
- Between top-level dashboard sections: `--space-9` (40px).
- Outer page padding: `--space-9 --space-7 --space-10`.

---

## 6. Radius, Shadow, Motion

**Radius:** `xs 4 / sm 6 / md 8 / lg 12 / xl 16 / pill 999`. Default is `md`; cards step up to `lg`.

**Shadow:** extremely restrained. Only `shadow-md` on card hover-lift; `shadow-lg` on Tweaks panel / popovers. Everything else flat with 1px border.

**Motion:**
- `--duration-fast 140ms` — hover, focus, filter switches.
- `--duration-base 200ms` — enter animations (choreography fade-up).
- Easing: `--ease-out cubic-bezier(.2,0,0,1)` is the default. Spring only on celebratory micro-interactions (unused in v1).
- **All motion respects `prefers-reduced-motion`** (handled in `base.css` + `choreography.css`).

---

## 7. Components (quick reference)

### Button
`.btn` base → `.btn-primary` (solid blue) / `.btn-ghost` (transparent, hover-fills) / `.btn-outline` (bordered) / `.btn-danger`.
Sizes: `.btn-sm` (28px) · default (38px) · `.btn-lg` (44px).
Pair with inline `<svg>` (16px default, 14px sm).

### Input
`.field > label + .input-wrap > [.leading] + .input + [.trailing-btn]`.
Label is always a caps-mono label with optional right-aligned meta link (`<a>` inside label).
Focus: 3px ring `--ring` + primary border.

### Panel
`.panel > .panel-head (h3 + count + .panel-tools) + content + .panel-foot`.
Used for Projects table, Activity feed. Rounded-lg, 1px border, `overflow:hidden`.

### Pill / Filter pills
`.filter-pills` container; `.pill` items with optional `.dot.critical|blocked|running|stale`. Active pill lifts.

### Seg (segmented)
Used only in Tweaks. 2px inset background, active segment raises with xs shadow.

### Toggle
32×18px track, 14×14px knob. `.on` flips primary + slides knob.

### Severity
- `.sev-chip` — compact chip with dot + label (used in Attention cards).
- `.gate` — bigger status gate (BLOCKED / WARN / PASS / RUNNING).
- `.cell-gate` — inline gate inside table cells.
- `.num-cell .crit / .high / .med` — numeric column coloring.

### Lang-tag
Tiny mono chip with colored dot: `.l-c .l-cpp .l-rust .l-py .l-ts`.

### Choreography
Wrap a region in `[data-chore]`, mark children with `.chore .c-1`..`.c-9`. Fade-up, 60ms stagger, respects reduced-motion.

---

## 8. Patterns

### 8.1 Live / Running indicator

Three shapes of the same signal:
- **Dot pulse** — `.cell-name .n.running::after`, `.activity-foot .live-dot` (2s breathing dot with expanding halo).
- **Gate pulse** — `.gate.running::before` / `.cell-gate.running::before` (1.4s dot inside the badge).
- **Laser bar** — `.att-progress::after` (1.6s moving gradient).

All three disable simultaneously under `body.no-live` (Tweaks option) or `prefers-reduced-motion`.

### 8.2 Severity rail

Attention cards use `::before` — a 3px vertical rail in the severity color. The critical variant adds a `2px 0 12px` glow. The card itself gets a subtle top-down tinted wash (`oklch(... / 0.06)`) that fades to transparent at 60%.

### 8.3 Timeline rail (Activity feed)

`.activity-item::before` — 1px vertical line between icons. Last item suppresses the rail.

### 8.4 Caps-mono label

Whenever the label is UI metadata (not prose): mono + uppercase + `tracking-caps 0.06em` + `--foreground-subtle`. Examples: column headers, section hints, Tweaks group labels, env/region badges.

### 8.5 Responsive & density (Dashboard)

**"Needs Attention" is never hidden.** At ≤1100px the 3-up grid collapses to 2-up, then at ≤900px to a single-column vertical stack with a compressed two-column body layout (title/meta on the left, severity chips on the right). All three cards stay visible — this is a hard rule because it is an operational-risk signal.

**Tables** at narrow widths scroll horizontally by default. Users can switch to card layout via the Tweaks panel (`body.layout-cards`).

**Density modes:**

- `body.density-compact` — table cell padding drops from `14px` to `10px`.
- `body.layout-cards` — hides the table, shows `.projects-cards` grid.
- `body.no-activity` — collapses the 2-col grid to 1-col and hides activity panel.
- `body.no-live` — kills all pulses/laser.

All toggled via the Tweaks panel; persisted via the host's `__edit_mode_set_keys`.

### 8.6 Choreography on first paint

Dashboard main sections (`needs-attention`, `projects`, `activity`) marked with `[data-chore]` and `.chore.c-1/c-2/c-3`; enter staggered from `translateY(8px)` to 0 over 200ms. Reduced-motion skips entirely.

---

## 9. Accessibility

- **Contrast:** foreground/muted on all surfaces ≥ 4.5:1 (checked). Severity colors are paired with icon/text labels — never color-only.
- **Focus:** shared `:focus-visible` ring (`3px --ring`, blue at 35% alpha) via `base.css`.
- **Motion:** all pulses, laser, and choreography collapse under `@media (prefers-reduced-motion: reduce)`.
- **Korean text:** `text-wrap: pretty` on headlines, `word-break: keep-all` recommended for long Korean headings (applied ad-hoc).

---

## 10. Extending

When adding a new page:

1. Drop a new file in `assets/pages/<page>.css`.
2. Link it **after** components in the page's `<head>`.
3. Authenticated routes (anything post-login) should also link `components/nav.css` and reuse the `<nav class=\"nav\">` markup — do not duplicate nav styles in a page file.
4. Prefer existing tokens; if you need a new color, lift it from the severity ramp before inventing.
5. Prefer existing components; if you need a variant, extend in the component file (not the page file), so every page inherits.
6. If the new page has its own dense \"view mode\" (cards vs. table, compact vs. relaxed), gate it with a `body.<mode>` class so Tweaks can toggle it.
7. Operational-signal regions (like Needs Attention) must never be hidden under a breakpoint — stack or compress, but keep visible.

---

## 11. Known gaps / v2 candidates

- **Role chip is mock data.** `LEAD · SECOPS` in `.nav-user .role` is hard-coded in template markup. Backend `auth v2` will expose a `role` field; until then this renders a fixed value so the layout is stable. When the field lands, the `.role` span becomes server-driven and acceptable values should be enumerated alongside this doc.
- **Shield icon → `<ShieldIcon variant>` component.** Currently documented as frozen SVG in `assets/shield.svg.md` with two inline variants (`compact`, `detailed`). At React-migration time this collapses to a single component taking a `variant` prop; the `.md` becomes the source of truth for the two code paths.
- **Dark theme** is keyed out but not yet visually tuned; some severity surfaces look muddy on dark.
- **Chart palette** (`--chart-1..6`) is defined but unused — to be applied when we build the Findings analytics view.
- **Code / syntax surface** tokens exist but no finding-detail view yet uses them.
- **Toast system** — z-index reserved (`--z-toast 1200`), component not built.
