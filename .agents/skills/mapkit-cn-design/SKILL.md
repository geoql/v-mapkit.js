---
name: mapkit-cn-design
description: Project-level design skill for apps/mapkit-cn. Pins the Apple (Modern Minimal) direction. Use BEFORE any visual work in this app.
---

# mapkit-cn · Design System

Pinned direction: **Apple / Modern Minimal** (apple.com / developer.apple.com reference set).

This skill overrides `design-discipline`'s `references/directions.md` defaults for everything inside `apps/mapkit-cn/`. The library (`packages/v-mapkit`) and the docs site (`apps/docs`) are out of scope.

---

## Why Apple / Modern Minimal (and not the others)

mapkit-cn is the showcase site for `v-mapkit` — Vue 3 components for **Apple MapKit JS**, installed via `npx shadcn-vue add ...`. The product wraps Apple's own mapping engine, so the site must feel like it belongs in Apple's ecosystem: clean white (and true-black dark) surfaces, generous whitespace, SF-Pro-flavored type (Geist), Apple's signature blue, soft-but-not-bubbly radii, and subtle layered shadows. The audience is Apple-platform and Vue developers who already recognize this visual language as "native". Editorial / brutalist / warm-soft / Tech-Utility (Linear-style sharp+borders-only) directions all read as _off-brand_ against an Apple Maps product — sharp 8px corners and shadow-less borders would actively fight the Apple association we're trading on.

This is the key divergence from the sibling `mapcn-vue` (which pins **Tech Utility** because MapLibre is a neutral open-source engine). MapKit is Apple's, so we go Apple.

---

## Token Contract — Tailwind v4 `@theme`

All tokens MUST be referenced via Tailwind's semantic names (`bg-background`, `text-foreground`, `bg-primary`, `border-border`). NEVER hardcode `oklch(...)` in components. NEVER use raw Tailwind color utilities (`bg-blue-500`, `text-emerald-500`, etc).

Tokens live in `app/assets/css/main.css`. Light mode is the `@theme` block; dark mode is the `.dark` block.

### Light mode (default surface)

```css
--color-background: oklch(1 0 0); /* pure white, Apple's canvas */
--color-foreground: oklch(0.21 0.004 286); /* #1d1d1f near-black text */
--color-card: oklch(0.985 0.001 286);
--color-primary: oklch(0.585 0.185 252); /* Apple blue #0071e3 */
--color-primary-foreground: oklch(1 0 0);
--color-muted-foreground: oklch(0.52 0.006 286);
--color-border: oklch(0.92 0.002 286);
--color-destructive: oklch(0.63 0.23 27);
--color-success: oklch(0.74 0.18 150);
--color-warning: oklch(0.76 0.17 65);
--radius: 0.75rem; /* 12px — Apple's soft corners */
```

### Dark mode (mirror)

```css
.dark {
  --color-background: oklch(0.15 0.003 286); /* near-black, not pure #000 */
  --color-foreground: oklch(0.97 0.002 286);
  --color-card: oklch(0.19 0.004 286);
  --color-primary: oklch(0.64 0.19 252); /* brighter blue for dark */
  --color-border: oklch(0.27 0.004 286);
}
```

Neutral grays are pinned at **hue 286** (cool, Apple-like). The single accent is **Apple blue (~hue 252)**. Status colors (destructive/success/warning) are the only other hues permitted.

---

## Type Stack

ONE family. No serif. Mono for code/IDs/keyboard hints only.

```css
--font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
--font-display: var(--font-sans);
```

Loaded via `@nuxt/fonts` (already in `nuxt.config.ts`). No manual `<link>` to Google Fonts.

### Weight & tracking rules (Apple's tight, large display tracking)

- **Display headlines (≥48px)**: `font-weight: 700`, `letter-spacing: -0.03em` (`--tracking-tighter`), tight line-height
- **Section headings (24–48px)**: `font-weight: 600–700`, `letter-spacing: -0.02em` (`--tracking-tight`)
- **Body**: `font-weight: 400`, `letter-spacing: -0.01em` (`--tracking-normal`)
- **Caption / label**: `font-weight: 500`
- **Data numbers / coordinates**: `font-variant-numeric: tabular-nums`, mono family
- Apple permits **600** for headings (unlike Tech Utility) — it reads as confident here, not indecisive.

---

## Hard Bans (in addition to global design-discipline rules)

1. **NO gradient-text headlines.** No `bg-clip-text` + `bg-gradient-to-*`. Solid `text-foreground` / `text-primary` + weight contrast only.
2. **NO raw Tailwind color utilities**: `bg-blue-*`, `text-emerald-*`, `bg-red-*`, etc. Use semantic tokens (`bg-primary`, `text-destructive`, `text-success`, `text-warning`).
3. **NO `font-serif`** anywhere — there is one family.
4. **NO pure `#000` / `#fff`** in dark mode — background is `oklch(0.15 ...)`, never `#000`. (Light mode `--color-background: oklch(1 0 0)` white is the intentional Apple canvas exception.)
5. **NO banned fonts**: Inter, Plus Jakarta, Space Grotesk, Roboto, Poppins, Outfit. Geist only.
6. **Radii**: use `rounded-lg` (12px) as the default; `rounded-xl`/`rounded-2xl` allowed for hero cards and the largest surfaces (Apple uses generous corners). Do NOT go sharper than `rounded-md` on interactive chrome.
7. **Shadows ARE allowed** (unlike Tech Utility): use the layered `--shadow-*` scale for elevation. Pair subtle shadow + hairline border. Backdrop blur (`--blur-chrome: 20px`) is the signature for floating chrome (headers, toolbars).

---

## Apple / Modern Minimal — Must-Include Checklist (per surface)

A compliant surface MUST satisfy at least **4 of these 6**:

- [ ] Generous whitespace (Apple breathes — don't crowd)
- [ ] ONE focal element per viewport (hero map, hero metric, or hero install command)
- [ ] Tabular numerals (`tabular-nums`) on any data / coordinates
- [ ] Mono font for code / IDs / install commands / coordinates
- [ ] Soft radii (`rounded-lg`+) and layered shadow OR hairline border for elevation
- [ ] ONE accent (Apple blue) used decisively; everything else neutral

---

## Distinctive Moment Catalog (Hard Rule #9)

Every surface needs ONE memorable, non-default visual decision. For mapkit-cn specifically, pick from:

1. **Live MapKit hero** — a real, interactive `<VMap>` with annotation pins anchoring the homepage hero (the product demonstrating itself).
2. **Oversized monospace install command** — `npx shadcn-vue add ...` set at 32px+ as the typographic event of the surface.
3. **Coordinate flourish** — a real coordinate pair (`37.3349° N, 122.0090° W`, Apple Park) in mono at 12px as a meta-row anchored to a section header or hero panel.
4. **Hero metric** — a single huge tabular-num metric (component count, example count) replacing a conventional KPI row.
5. **Apple-glass floating chrome** — a `backdrop-blur` header/toolbar with hairline border that floats over the map content.

If a surface lacks ONE of these (or an equivalent), it's anonymous output. Rebuild.

---

## Rule #10 — Hero Composition

Homepage hero MUST:

- Use `min-height: 100dvh` on the hero `<section>`
- Place primary CTA above the fold at both 1440×900 desktop AND 390×844 mobile
- Lead with the live MapKit hero or oversized headline; keep the install command + primary CTA in the first viewport
- Asymmetric split on desktop (text + live map), stacked vertical on mobile

---

## When to Refuse

If a future request asks for any of:

- "Add a gradient to the headline"
- "Use Inter / Plus Jakarta / Space Grotesk"
- "Make these cards purple/emerald/green" with raw Tailwind colors
- "Use pure black `#000` background in dark mode"
- "Make the corners sharp / borders-only like Linear"

…respond per `design-discipline` Hard Rule #8 — refuse + offer a compliant alternative. Direct the user to override this skill via `apps/mapkit-cn/CLAUDE.md` if they really want to bypass.

---

## File Inventory (where the design lives)

| File                                      | Owns                                               |
| ----------------------------------------- | -------------------------------------------------- |
| `app/assets/css/main.css`                 | All tokens, weight rules, base typography, shadows |
| `app/pages/index.vue`                     | Homepage hero — the canonical surface              |
| `app/components/layout/Header.vue`        | Floating glass header (blur + hairline border)     |
| `app/components/layout/Footer.vue`        | Footer                                             |
| `app/components/example/ExampleCard.vue`  | Example gallery card primitive                     |
| `app/components/example/GalleryCard.vue`  | Gallery card                                       |
| `app/components/example/MapContainer.vue` | Per-example live map frame                         |
| `app/components/example/CodeBlock.vue`    | Mono code sample block                             |
| `app/components/ui/*`                     | shadcn-vue primitives (Button, Card, Badge, Input) |
| `nuxt.config.ts`                          | `@nuxt/fonts` config (Geist + Geist Mono)          |

---

## Reference

Apple's own surfaces are the visual ground truth: `apple.com`, `developer.apple.com`, and the macOS/iOS Maps app. Any implementation that diverges from that calm, white-canvas, blue-accent, soft-cornered posture should be questioned.
