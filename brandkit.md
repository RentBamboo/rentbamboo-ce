# RentBamboo Design System

## Brand Identity

| Property | Value |
|---|---|
| **Font** | Aeonik (Regular 400, Medium 500, Bold 700) |
| **Border Radius** | `0.5rem` (base), `0.25rem` (sm), `0.375rem` (md), `0.75rem` (lg) |
| **Spacing Unit** | Tailwind default (4px = 1 unit) |
| **Design Language** | Clean, modern, high-contrast, warm neutral + sage green accents |

---

## Color Palette

### Primary — Sage Green
| Token | Hex | HSL | Usage |
|---|---|---|---|
| `green-50` | `#f0fdf4` | `142 76% 97%` | Subtle green backgrounds |
| `green-100` | `#dcfce7` | `142 76% 93%` | Hover backgrounds |
| `green-200` | `#bbf7d0` | `142 76% 85%` | Selected states |
| `green-500` | `#22c55e` | `142 71% 54%` | Success indicators, dot pulses |
| `green-600` | `#16a34a` | `142 71% 39%` | Success text |
| `green-700` | `#15803d` | `142 71% 29%` | **Primary CTA, links, accents** |
| `green-800` | `#166534` | `142 71% 23%` | Hover dark |
| `green-900` | `#14532d` | `142 71% 20%` | Dark green text |

### Brand Custom Properties (`--zd-*`)
| Token | Hex | Usage |
|---|---|---|
| `--zd-teal` | `#6b9e5a` | Primary accent — buttons, links, badges, dot indicators |
| `--zd-teal-light` | `#7db86b` | Accent hover state |
| `--zd-teal-dim` | `#c5dfb9` | Subtle green text on dark backgrounds |
| `--zd-teal-dark` | `#3d6e2a` | Dark green variant, text on light backgrounds |
| `--zd-black` | `#0a0a0a` | Primary text, dark section backgrounds |
| `--zd-off-black` | `#111111` | Slightly lighter dark |
| `--zd-dark` | `#1a1a1a` | Card backgrounds in dark sections |
| `--zd-mid` | `#2c2c2c` | Borders in dark sections |
| `--zd-white` | `#fafaf8` | Page background, light text on dark |
| `--zd-surface` | `#f4f3f0` | Card backgrounds, panels |
| `--zd-surface-2` | `#eeecea` | Secondary surface |
| `--zd-muted` | `#7a766d` | Secondary text, descriptions |
| `--zd-border` | `#e0dcd3` | Borders, dividers |
| `--zd-border-dark` | `#3a3a34` | Borders in dark mode |
| `--zd-ink` | `#0a0a0a` | Body text |

### Neutral Grays (Dashboard)
| Token | Hex | Usage |
|---|---|---|
| `gray-50` | `#f9fafb` | Page background |
| `gray-100` | `#f3f4f6` | Card backgrounds |
| `gray-200` | `#e5e7eb` | Borders |
| `gray-400` | `#9ca3af` | Disabled text |
| `gray-500` | `#6b7280` | Muted text |
| `gray-700` | `#374151` | Body text |
| `gray-900` | `#111827` | Headings |
| `neutral-800` | `#262626` | Dark mode card surfaces |
| `neutral-900` | `#171717` | Dark mode backgrounds |

---

## Shadcn/UI Variable Map

### Public Pages (`.public-theme`)
```css
.public-theme {
  --background: 0 0% 100%;
  --foreground: 163 88% 10%;
  --primary: 142 71% 29%;          /* #15803d */
  --primary-foreground: 0 0% 100%;
  --secondary: 142 40% 96%;
  --secondary-foreground: 163 88% 20%;
  --muted: 163 20% 96%;
  --muted-foreground: 163 30% 40%;
  --accent: 163 88% 20%;
  --accent-foreground: 0 0% 100%;
  --border: 163 20% 90%;
  --input: 163 20% 90%;
  --ring: 142 71% 29%;
}
```

### Dashboard (default, no class)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;          /* neutral dark */
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 10% 3.9%;
}
```

### Dark Mode (`.dark` on `<html>`)
| Scope | Background | Foreground | Primary | Border |
|---|---|---|---|---|
| Dashboard `.dark` | `240 10% 3.9%` | `0 0% 98%` | `0 0% 98%` (inverted) | `240 3.7% 15.9%` |
| Public `.dark .public-theme` | `163 88% 5%` | `0 0% 98%` | `142 71% 40%` | `163 30% 15%` |
| Landing `.dark --zd-*` | `--zd-black` → `#fafaf8` | `--zd-white` → `#0a0a0a` | `--zd-teal` → `#7db86b` | `--zd-border` → `#3a3a34` |

---

## Component States

### Buttons
| State | Primary (green) | Secondary (outline) | Destructive | Disabled |
|---|---|---|---|---|
| **Default** | `bg: #15803d`, `text: white` | `bg: transparent`, `border: gray-200`, `text: gray-700` | `bg: red-600`, `text: white` | `opacity: 0.5`, `pointer-events: none` |
| **Hover** | `bg: #166534` (darken) | `bg: gray-50`, `border: gray-300` | `bg: red-700` | — |
| **Focus** | `ring-2 ring-green-500 ring-offset-2` | `ring-2 ring-gray-400 ring-offset-2` | `ring-2 ring-red-500` | — |
| **Active** | `bg: #14532d` | `bg: gray-100` | `bg: red-800` | — |
| **Loading** | Spinner + disabled cursor | Spinner + disabled cursor | Spinner + disabled cursor | — |

### CTA (Landing Page)
| Variant | Light Mode | Dark Mode |
|---|---|---|
| **Hero Primary** | `bg: #fafaf8`, `text: #0a0a0a` | `bg: #0a0a0a`, `text: #fafaf8` |
| **Hero Secondary** | `text: #fafaf8`, transparent bg | `text: #555`, transparent bg |
| **Section Primary** | `bg: #0a0a0a`, `text: #fafaf8` | `bg: #fafaf8`, `text: #0a0a0a` |
| **Nav CTA** | `bg: #0a0a0a`, `text: white`, uppercase tracking | same |

### Cards
| State | Light | Dark |
|---|---|---|
| **Default** | `bg: white`, `border: gray-200`, `rounded-xl` | `bg: neutral-900`, `border: neutral-700` |
| **Hover** | `border: gray-300`, `shadow-sm` | `border: neutral-600`, `shadow: neutral-800/50` |
| **Selected** | `border-2 border-green-500`, `shadow-xl` | `border-2 border-green-500/70` |
| **Disabled** | `opacity: 0.5`, `pointer-events: none` | same |

### Inputs
| State | Light | Dark |
|---|---|---|
| **Default** | `bg: white`, `border: gray-200`, `text: gray-900` | `bg: neutral-800`, `border: neutral-700`, `text: white` |
| **Hover** | `border: gray-300` | `border: neutral-600` |
| **Focus** | `border: green-500`, `ring-1 ring-green-500` | `border: green-500/70`, `ring-1 ring-green-500/30` |
| **Error** | `border: red-500`, `ring-1 ring-red-500` | same |
| **Disabled** | `bg: gray-50`, `opacity: 0.6` | `bg: neutral-900`, `opacity: 0.4` |
| **Placeholder** | `text: gray-400` | `text: neutral-500` |

### Links / Nav Items
| State | Light | Dark |
|---|---|---|
| **Default** | `text: gray-500` | `text: neutral-400` |
| **Hover** | `text: green-700` | `text: green-400` |
| **Active** | `text: green-700`, `border-bottom-2 border-green-700` | `text: green-400`, `border-bottom-2 border-green-400` |
| **Disabled** | `opacity: 0.5`, `cursor: not-allowed` | same |

### Badges / Tags
| Variant | Style |
|---|---|
| **Default** | `bg: gray-100`, `text: gray-700`, `rounded-full`, `px-2 py-0.5`, `text-xs` |
| **Success** | `bg: green-100`, `text: green-700` |
| **Warning** | `bg: amber-100`, `text: amber-700` |
| **Error** | `bg: red-100`, `text: red-700` |
| **NEW pill** | `bg: #6b9e5a`, `text: white`, `rounded-full`, `text-[10px]`, `font-bold` |
| **Coming Soon** | `bg: #6b7280`, `text: white`, `rounded-full`, `text-[11px]` |
| **Feature tag** | `bg: rgba(107,158,90,0.1)`, `text: #6b9e5a`, `border: rgba(107,158,90,0.25)`, `text-[9px]`, uppercase |

### Loading / Skeleton States
| Component | Style |
|---|---|
| **Skeleton** | `bg: gray-200`, `animate-pulse`, `rounded` |
| **Spinner** | `border-2 border-gray-200 border-t-green-600 animate-spin rounded-full` |
| **Skeleton Text** | `h-4 bg-gray-200 rounded animate-pulse` |
| **Skeleton Card** | `h-32 bg-gray-100 rounded-xl animate-pulse` |
| **Dot pulse** | `w-6 h-6 rounded-full bg-green-500 animate-pulse` (live indicators) |

---

## Typography Scale

| Token | Size | Weight | Letter Spacing | Usage |
|---|---|---|---|---|
| `text-hero` | `70px` | `500` | `-0.03em` | Landing hero headline |
| `text-display` | `38-42px` | `800` | `-0.025em` | Section titles |
| `text-heading` | `28px` | `700` | `-0.02em` | Workflow titles |
| `text-subheading` | `16-17px` | `300-600` | normal | Descriptions |
| `text-body` | `13-15px` | `400` | normal | Body copy |
| `text-label` | `9-11px` | `600` | `0.1-0.2em` | Uppercase labels |
| `text-mono` | `9-12px` | `500` | `0.06-0.12em` | Mono labels, stats, badges |

---

## Border Radius Scale
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.25rem` | Small inputs, tags |
| `--radius-md` | `0.375rem` | Buttons, dropdown items |
| `--radius-lg` / `--radius` | `0.5rem` | Cards, modals, sections |
| `--radius-xl` | `0.75rem` | Large cards |
| `rounded-2xl` | `1rem` | Chat windows, panels |
| `rounded-full` | `9999px` | Badges, pills, avatars |

---

## Animation Tokens
| Name | Duration | Easing | Usage |
|---|---|---|---|
| `transition-colors` | `150ms` | ease | Color changes |
| `transition-all` | `200ms` | ease | Card hover scale |
| `pulse-dot` | `2s` | ease-in-out infinite | Live indicators |
| `hc-anim-up` | `0.3s` | ease | Chat message appear |
| `hc-anim-drop` | `0.35s` | ease | Chat message drop |
| `marquee-scroll` | `28s` | linear infinite | Feature marquee |
| `conv-pulse` | `2s` | ease-in-out infinite | Conversion bar glow |
| `cflow-icon-pulse` | `1s` | ease-in-out infinite | Call flow icon |
| `funnel-step` | `0.4s` | ease | Funnel step highlight |
| `spin` | `0.7s` | linear infinite | Loading spinner |

---

## Shadow Scale
| Token | Value |
|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)` |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)` |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)` |
| Chat window | `0 32px 80px rgba(0,0,0,0.28)` |
| Plan card | `0 8px 40px rgba(107,158,90,0.12)` |

---

## Z-Index Scale
| Layer | Value | Usage |
|---|---|---|
| Background | `-1` | Grid, gradients |
| Content | `0-1` | Default |
| Dropdown | `50` | Nav, hover cards |
| Sticky nav | `50` | Navigation bar |
| Modal overlay | `50` | Video modals |
| Toast | `100` | Notifications |
