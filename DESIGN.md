---
version: alpha
name: Portfolio Design System
description: A light-first, ink-on-stone interpretation of the getdesign.md Website Starter Kit — a paper-gray canvas (#ececec) where the primary action colour IS the ink (#1e2124), a single Forest Green accent (#16a34a) is reserved only for "New" status dots, and binary near-black hero/CTA/footer bands punctuate an otherwise quiet, hairline-ruled surface. Geist carries the narrative, Geist Mono carries the small uppercase labels, and every rectangle is a tight 4px.

colors:
  primary: "#1e2124"
  on-primary: "#ffffff"
  primary-inverse: "#ffffff"
  on-primary-inverse: "#1e2124"
  accent: "#16a34a"
  ink: "#1e2124"
  ink-soft: "#1e1f2b"
  heading: "#1e2124"
  body: "#767676"
  mute: "#aaaaaa"
  canvas: "#ffffff"
  canvas-soft: "#f5f4f2"
  background: "#ececec"
  background-deep: "#e3e3e0"
  hairline: "#c8c8c8"
  hairline-soft: "#ececec"
  border: "#c8c8c8"
  border-soft: "#aaaaaa"
  surface-dark: "#1e2124"
  hero-band: "#0f1013"
  announce-bg: "#1e2124"
  footer-band: "#000000"
  danger: "#ff4136"
  success: "#3f4247"
  badge-new: "#16a34a"
  dark-background: "#0a0a0a"
  dark-canvas: "#15171a"
  dark-canvas-soft: "#1a1a1a"
  dark-foreground: "#ededed"
  dark-foreground-muted: "#a1a1a1"
  dark-border: "#2e2e2e"
  dark-primary: "#ededed"
  dark-on-primary: "#1e2124"
  dark-accent: "#b9bcc1"
  dark-badge-new: "#4ade80"
  dark-surface-dark: "#2a2d33"
  dark-surface-elevated: "#33373d"

typography:
  display-xl:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 60px
    fontWeight: 600
    lineHeight: 61.2px
    letterSpacing: -2.5px
  display-lg:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 38px
    fontWeight: 500
    lineHeight: 38px
    letterSpacing: -1.5px
  display-md:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 32px
    fontWeight: 500
    lineHeight: 39px
    letterSpacing: -1.2px
  heading-lg:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 21px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: -0.5px
  heading-md:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 19px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: -0.4px
  heading-sm:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 19px
    letterSpacing: -0.5px
  body-lg:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 17px
    fontWeight: 400
    lineHeight: 27px
  body-md:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 26px
  body-sm:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 15px
    fontWeight: 400
    lineHeight: 23px
  body-xs:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  caption:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 13px
    fontWeight: 400
    lineHeight: 16px
  caption-mono:
    fontFamily: '"Geist Mono", ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace'
    fontSize: 11px
    fontWeight: 600
    lineHeight: 13px
    letterSpacing: 0.6px
  label-mono:
    fontFamily: '"Geist Mono", ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace'
    fontSize: 11px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 1.1px
  eyebrow:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 14px
    letterSpacing: -0.26px
  button-md:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 16px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0.162px
  button-sm:
    fontFamily: Geist, system-ui, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.162px

rounded:
  none: 0px
  xxs: 2px
  xs: 3px
  sm: 4px
  md: 6px
  lg: 6px
  xl: 6px
  "2xl": 6px
  pill: 60px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 15px
  base: 20px
  lg: 24px
  xl: 30px
  "2xl": 42px
  gutter: 24px
  container: 1360px
  section-sm: 72px
  section-md: 105px
  section-lg: 160px

components:
  nav-bar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    padding: "13px 24px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-xs}"
  announce-bar:
    backgroundColor: "{colors.announce-bg}"
    textColor: "{colors.on-primary}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
  button-primary-on-dark:
    backgroundColor: "{colors.primary-inverse}"
    textColor: "{colors.on-primary-inverse}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    borderColor: "{colors.border-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
  button-outline-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-inverse}"
    borderColor: "{colors.border-soft}"
    typography: "{typography.button-md}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
  button-sm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
  button-sm-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border-soft}"
    typography: "{typography.button-sm}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border-soft}"
    typography: "{typography.body-xs}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.border}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
  card-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "{spacing.lg}"
  hero-band:
    backgroundColor: "{colors.hero-band}"
    textColor: "{colors.on-primary}"
    typography: "{typography.display-xl}"
    padding: "{spacing.section-sm} {spacing.lg}"
  content-band:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.section-sm} {spacing.lg}"
  content-band-soft:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    padding: "{spacing.section-sm} {spacing.lg}"
  footer:
    backgroundColor: "{colors.footer-band}"
    textColor: "#a1a1a1"
    typography: "{typography.body-md}"
    padding: "{spacing.2xl} {spacing.lg}"
  badge-new:
    backgroundColor: transparent
    textColor: "{colors.badge-new}"
    borderColor: "{colors.badge-new}"
    typography: "{typography.caption-mono}"
    rounded: "{rounded.sm}"
    padding: "1px 5px"
  badge-neutral:
    backgroundColor: transparent
    textColor: "{colors.body}"
    borderColor: "{colors.border}"
    typography: "{typography.caption-mono}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  chip-filter:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-xs}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} 14px"
  eyebrow-mono:
    textColor: "{colors.body}"
    typography: "{typography.label-mono}"
---

## Overview

This system is an ink-on-stone reading surface that occasionally turns the lights out. The page floor is a paper-gray `{colors.background}` (`#ececec`) — never pure white — so white cards (`{colors.canvas}`) and near-black bands (`{colors.surface-dark}` / `{colors.hero-band}`) read as deliberate contrast layers rather than default browser chrome. The single chromatic accent, a Forest Green `{colors.accent}` (`#16a34a`), is reserved exclusively for the "New" badge and status dots; every call-to-action is instead a dark ink fill (`{colors.primary}` `#1e2124`), which is the brand's signature move — the primary action colour IS the text colour.

The decorative system is restrained and geometric. There is no gradient mesh, no illustration suite, no material elevation. Hierarchy is carried by background contrast, 1 px hairlines (`{colors.hairline}` `#c8c8c8`), and a tight 4 px rectangle vocabulary. The only soft shape on the whole site is a 60 px pill reserved for a single footer link. Typography pairs **Geist** for narrative with **Geist Mono** for small uppercase labels, card category tags, and decimal indices — the mono never carries body copy, only metadata.

**Key Characteristics:**

- **Ink is the primary action colour.** Buttons are dark `{colors.primary}` (`#1e2124`) fills with white text — a polarity-flipped CTA, not a coloured one. On dark bands the button inverts to white-on-ink. There is no "brand blue" or "brand green" button.
- **One chromatic accent, used scarcely.** Forest Green `{colors.accent}` (`#16a34a`) appears only as the "New" badge and live/status dots. It is never a button, never a headline, never a body fill.
- **Binary light/dark bands.** The page alternates a stone-gray floor with white card surfaces and near-black hero/CTA/footer bands. The hero is dark (`{colors.hero-band}` `#0f1013`); content sections are light; the closing CTA and footer return to near-black.
- **4 px rectangles, not pills.** Buttons, inputs, cards, and filter pills all use `{rounded.sm}` 4 px. The sole exception is a 60 px pill on one footer link.
- **Hairlines, not shadows.** Elevation is background contrast plus 1 px `{colors.hairline}` borders. The only drop-shadow is reserved for floating product-UI mockups.
- **Negative tracking that crashes with size.** Letter-spacing tightens as type grows: `-0.4 px` at 19 px, `-1.5 px` at 38 px, `-2.5 px` at 60 px. Headlines pull inward; small mono labels push outward (`+0.6 px` to `+1.1 px`).

## Colors

### Brand & Accent

- **Ink** (`{colors.ink}` — `#1e2124`): The primary text colour AND the primary action colour. Headlines, body, and button fills are all the same hex — the system's centre of gravity. One value does both jobs.
- **Primary Inverse** (`{colors.primary-inverse}` — `#ffffff`): The polarity-flipped button on dark bands (white fill, ink text) and the headline colour on dark surfaces.
- **Forest Green** (`{colors.accent}` — `#16a34a`): The single chromatic accent. Reserved for the "New" badge, status dots, and "live" indicators only. Never a CTA, never body text.

### Surface

- **Background** (`{colors.background}` — `#ececec`): The stone-gray page floor. Warmer and softer than pure white; the default marketing surface.
- **Background Deep** (`{colors.background-deep}` — `#e3e3e0`): A slightly deeper stone for nested or alternating bands.
- **Canvas** (`{colors.canvas}` — `#ffffff`): White cards and elevated surfaces that sit on the stone floor to register as deliberate contrast.
- **Canvas Soft** (`{colors.canvas-soft}` — `#f5f4f2`): A faint warm tint for alternating bands, filter pills, and testimonial cards.
- **Surface Dark** (`{colors.surface-dark}` — `#1e2124`): The near-black band — app sidebars, dark CTA tiles, partner logo strips.
- **Hero Band** (`{colors.hero-band}` — `#0f1013`): A slightly blue-shifted near-black reserved for the hero declaration band.
- **Footer Band** (`{colors.footer-band}` — `#000000`): Pure black for the closing footer.

### Lines

- **Hairline** (`{colors.hairline}` — `#c8c8c8`): The 1 px divider and card border. The brand's universal edge.
- **Hairline Soft** (`{colors.hairline-soft}` — `#ececec`): Faint section separators on white surfaces.
- **Border Soft** (`{colors.border-soft}` — `#aaaaaa`): The slightly stronger hairline used for outlined-button borders and input focus.

### Text

- **Ink** (`{colors.ink}` — `#1e2124`): Primary headlines, body, button labels.
- **Ink Soft** (`{colors.ink-soft}` — `#1e1f2b`): A quarter-step warmer ink for atmospheric headings and dark product-UI emphasis.
- **Body** (`{colors.body}` — `#767676`): Muted body — footer columns, secondary metadata, supporting copy.
- **Mute** (`{colors.mute}` — `#aaaaaa`): Silver. The signature "fading-into-the-page" gray for atmospheric hero sub-text and tertiary labels.

### Semantic

- **Error** (`{colors.danger}` — `#ff4136`): Validation and destructive actions — product UI only, never marketing.
- **Success** (`{colors.success}` — `#3f4247`): A muted ink-green for confirmations; the marketing surface uses the forest-green badge instead.

### Dark Mode

The system inverts cleanly: the floor becomes `{colors.dark-background}` (`#0a0a0a`), cards become `{colors.dark-canvas}` (`#15171a`), the primary button flips to white-on-ink (`{colors.dark-primary}` `#ededed`), and the forest-green accent brightens to `{colors.dark-badge-new}` (`#4ade80`). Borders soften to `{colors.dark-border}` (`#2e2e2e`).

## Typography

### Font Families

1. **Geist** for every display, body, button, and link role. Weights 400 / 500 / 600 / 700 are the working set. A modern, slightly-humanist grotesque that reads calm at large sizes and precise at small sizes.
2. **Geist Mono** (`"Geist Mono"` with `ui-monospace` / SF Mono / Menlo fallbacks) for small uppercase labels, card category tags, decimal indices, and footer micro-copy. Never body paragraphs — only metadata and tags. Weights 400 / 600.

### Hierarchy

| Token                       | Size | Weight | Line Height | Letter Spacing | Use                                                  |
| --------------------------- | ---- | ------ | ----------- | -------------- | ---------------------------------------------------- |
| `{typography.display-xl}`   | 60px | 600    | 61.2px      | -2.5px         | Hero declaration headline (on dark band).            |
| `{typography.display-lg}`   | 38px | 500    | 38px        | -1.5px         | Major section headers.                               |
| `{typography.display-md}`   | 32px | 500    | 39px        | -1.2px         | Sub-hero / paragraph-styled lead heading.            |
| `{typography.heading-lg}`   | 21px | 600    | 22px        | -0.5px         | Card titles (large).                                 |
| `{typography.heading-md}`   | 19px | 600    | 24px        | -0.4px         | Card / blog post titles.                             |
| `{typography.heading-sm}`   | 18px | 600    | 19px        | -0.5px         | Dense card titles.                                   |
| `{typography.body-lg}`      | 17px | 400    | 27px        | 0              | Lead paragraph (hero sub-text).                      |
| `{typography.body-md}`      | 16px | 400    | 26px        | 0              | Default body paragraph.                              |
| `{typography.body-sm}`      | 15px | 400    | 23px        | 0              | Secondary body.                                      |
| `{typography.body-xs}`      | 14px | 400    | 20px        | 0              | Metadata, nav links.                                 |
| `{typography.caption}`      | 13px | 400    | 16px        | 0              | Fine print.                                          |
| `{typography.caption-mono}` | 11px | 600    | 13px        | 0.6px          | Uppercase mono badges ("New", "Demo").               |
| `{typography.label-mono}`   | 11px | 400    | 16px        | 1.1px          | Card category labels, decimal indices, footer micro. |
| `{typography.eyebrow}`      | 12px | 400    | 14px        | -0.26px        | Topic-tag pill labels (uppercase).                   |
| `{typography.button-md}`    | 16px | 600    | 20px        | 0.162px        | Primary button label.                                |
| `{typography.button-sm}`    | 13px | 600    | 16px        | 0.162px        | Nav / secondary button label.                        |

### Principles

- **Negative tracking scales with size.** Display type pulls inward (`-2.5 px` at 60 px); small mono labels push outward (`+1.1 px` at 11 px). The contrast is the brand's typographic voice.
- **Two faces, strict roles.** Geist for anything you read; Geist Mono for anything you'd tag, index, or label. The mono never carries a sentence.
- **Calm weights.** Display sits at 500–600, never 700+. Section headers stay at weight 500 to read like editorial, not advertising.

## Layout

### Spacing System

- **Base unit**: 8 px, with parallel sub-scales at 4 px / 12 px / 15 px for micro-tuning.
- **Tokens**: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 15 · `{spacing.base}` 20 · `{spacing.lg}` 24 · `{spacing.xl}` 30 · `{spacing.2xl}` 42.
- **Section rhythm**: `{spacing.section-sm}` 72 px when the canvas colour stays the same; `{spacing.section-md}` 105 px when it shifts; `{spacing.section-lg}` 160 px for major chapter breaks.

### Grid & Container

- Marketing container centres at `{spacing.container}` 1360 px with `{spacing.gutter}` 24 px gutters.
- Feature-card grids: 2-up to 4-up at desktop, 1-up at mobile. The hero uses a `1.18fr / 0.82fr` split between headline and product mockup.

### Responsive Strategy

#### Breakpoints

| Name    | Width       | Key Changes                                                                                    |
| ------- | ----------- | ---------------------------------------------------------------------------------------------- |
| Mobile  | < 640px     | Nav collapses to chevron + hamburger + sign-in pill. Cards 1-up. Hero display-xl → display-lg. |
| Tablet  | 640–960px   | Nav stays horizontal but utility links collapse. Featured carousel 2-up.                       |
| Laptop  | 960–1200px  | Full nav, 3-up feed grid. Hero may step down to display-lg.                                    |
| Desktop | 1200–1500px | Full nav, 4-up feed grid, side-by-side closing CTA at full 50/50.                              |
| Wide    | ≥ 1500px    | Container caps at ~1480 px; extra space becomes outer margin.                                  |

#### Touch Targets

Primary buttons are 41 px tall (meet WCAG AAA). Outlined buttons are 40 px. Filter pills at 32 px fall below AAA on touch — boost to 40 px on mobile. Nav buttons are 36 px (paired with 12 px gaps).

#### Collapsing Strategy

Nav: full horizontal → chevron + hamburger + sign-in pill on mobile. Hero declaration scales fluidly `display-xl → display-lg → display-md`. Closing 50/50 CTA stacks vertically on mobile. Section padding reduces `105 px → 72 px → 24 px` at narrow widths.

## Elevation & Depth

Almost all elevation is **background contrast plus 1 px hairlines** — never material shadows.

| Level                 | Treatment                                            | Use                                            |
| --------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Level 0 — Flat        | No shadow, no border.                                | Full-bleed bands on the stone floor.           |
| Level 1 — Hairline    | 1 px solid `{colors.hairline}` on `{colors.canvas}`. | Default for cards, inputs, and dividers.       |
| Level 2 — Outlined    | 2 px hairline frame.                                 | Emphasised / featured cards.                   |
| Level 3 — Tone        | `{colors.canvas-soft}` on `{colors.background}`.     | Alternating bands, filter pills, testimonials. |
| Level 4 — Invert      | `{colors.surface-dark}` on `{colors.background}`.    | Dark CTA tiles, partner strips, sidebars.      |
| Level 5 — Soft Shadow | `0 1px 2px #1e21240a` or `0 4px 12px #1e21241a`.     | Floating product-UI mockups only.              |

### Decorative Depth

- White cards on the stone floor IS the elevation system.
- A 2 px hairline occasionally marks "featured" or "active" status.
- The soft drop-shadow (`{colors.shadow-lg}`) is reserved for floating app/UI mockups — never for marketing cards.

## Shapes

### Border Radius Scale

| Token            | Value  | Use                                                   |
| ---------------- | ------ | ----------------------------------------------------- |
| `{rounded.none}` | 0px    | Full-bleed bands.                                     |
| `{rounded.xxs}`  | 2px    | Featured / testimonial cards (barely rounded).        |
| `{rounded.xs}`   | 3px    | Tab panels, dropdowns.                                |
| `{rounded.sm}`   | 4px    | **Workhorse** — buttons, inputs, filter pills, cards. |
| `{rounded.md}`   | 6px    | Image frames, large content tiles.                    |
| `{rounded.pill}` | 60px   | The GitHub footer link — the only soft shape.         |
| `{rounded.full}` | 9999px | True circles — status dots, topic tags.               |

## Components

### Buttons

**`button-primary`** — the ink CTA (the brand's signature).

- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button-md}`, 41 px tall, padding `0 32px`, shape `{rounded.sm}` 4 px.

**`button-primary-on-dark`** — polarity-flipped on dark bands.

- Background `{colors.primary-inverse}` (white), text `{colors.on-primary-inverse}` (ink), same type / radius.

**`button-outline`** — the hairline secondary.

- Transparent, 1 px solid `{colors.border-soft}`, text `{colors.ink}`, same type / radius / height.

**`button-outline-on-dark`** — outlined on dark bands.

- Transparent, 1 px solid `{colors.border-soft}`, text `{colors.primary-inverse}`.

**`button-sm` / `button-sm-outline`** — nav-sized (36 px tall, `{typography.button-sm}`, `0 14px` padding).

**`text-link`** — inline link, ink-coloured, underlined on hover.

### Badges & Pills

**`badge-new`** — the single chromatic accent surface.

- Transparent fill, `{colors.badge-new}` text and border, `{typography.caption-mono}` (11 px mono, tracked), 4 px radius, `1px 5px` padding. Reserved for "New" / live status.

**`badge-neutral`** — neutral outlined tag ("Demo").

- Transparent, `{colors.body}` text, `{colors.border}` border, same mono type.

**`chip-filter`** — the filter pill.

- `{colors.canvas-soft}` fill, `{colors.ink}` text, `{typography.body-xs}`, 4 px radius, `{spacing.xs} 14px` padding. Active state flips to `{colors.canvas}` + hairline border.

### Cards & Containers

**`card`** — the white card on stone.

- Background `{colors.canvas}`, text `{colors.ink}`, 1 px solid `{colors.border}`, padding `{spacing.lg}` 24 px, shape `{rounded.sm}` 4 px.

**`card-soft`** — the warm-tint alternating card.

- Background `{colors.canvas-soft}`, same chrome, for testimonials and alternating bands.

**`card-dark`** — the near-black card.

- Background `{colors.surface-dark}`, text `{colors.on-primary}`, for dark CTA tiles and product mockups.

### Inputs & Forms

**`text-input`** — 44 px tall, `{colors.canvas}` fill, 1 px `{colors.border-soft}`, `{typography.body-xs}`, `{rounded.sm}` 4 px. Focus replaces the border with a 2 px ink outline.

### Navigation

**`nav-bar`** — sticky on the stone floor.

- Background `{colors.background}`, text `{colors.ink}`, padding `13px 24px`, container capped at 1360 px.

**`announce-bar`** — the slim top strip.

- Background `{colors.announce-bg}` (ink), text `{colors.on-primary}`.

**`footer`** — the pure-black closing band.

- Background `{colors.footer-band}`, text `#a1a1a1`, padding `{spacing.2xl} {spacing.lg}`.

### Signature Components

**`hero-band`** — the near-black declaration band.

- Background `{colors.hero-band}` (`#0f1013`), headline `{colors.on-primary}` in `{typography.display-xl}` (60 px / weight 600 / `-2.5 px` tracking), sub-text in `{colors.mute}` silver.

**`content-band`** — the standard light section.

- Background `{colors.background}`, section headline in `{typography.display-lg}`, padding `{spacing.section-sm}` 72 px.

**`content-band-soft`** — the alternating warm band.

- Background `{colors.canvas-soft}`, same rhythm, used to break long light runs.

## Do's and Don'ts

### Do

- Use `{colors.primary}` (`#1e2124`) ink as the primary button fill — the dark CTA IS the brand's signature. On dark bands, invert to `{colors.primary-inverse}` white.
- Keep the page floor `{colors.background}` (`#ececec`) stone-gray, never pure white. White `{colors.canvas}` is for cards only.
- Reserve `{colors.accent}` (`#16a34a`) Forest Green for the "New" badge and status dots — nothing else.
- Build elevation with background contrast and 1 px `{colors.hairline}` borders, not shadows.
- Set every button, input, card, and pill to `{rounded.sm}` 4 px. Use `{typography.label-mono}` for all small uppercase labels and indices.
- Tighten letter-spacing on display type (`-1.5 px` at 38 px, `-2.5 px` at 60 px) and widen it on mono labels (`+1.1 px`).

### Don't

- Don't introduce a coloured CTA. The primary button is always ink or white — never green, never blue.
- Don't use the Forest Green accent as a headline, body fill, or button. It is badge-only.
- Don't drop heavy drop-shadows on marketing cards. Shadows are reserved for floating product-UI mockups.
- Don't round corners beyond 6 px (except the single 60 px footer pill). Pills and `rounded-full` are for status dots and the one footer link only.
- Don't use Geist Mono for body paragraphs — it carries labels, tags, and indices only.
- Don't set display type heavier than weight 600. Section headers stay at 500; the calm weight is part of the editorial voice.
