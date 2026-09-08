---
name: Veridict Clarity
colors:
  surface: '#fbf8ff'
  surface-dim: '#d6d8f2'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ececff'
  surface-container-high: '#e4e7ff'
  surface-container-highest: '#dee1fb'
  on-surface: '#161b2d'
  on-surface-variant: '#464555'
  inverse-surface: '#2b2f43'
  inverse-on-surface: '#f0efff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#5951b4'
  on-secondary: '#ffffff'
  secondary-container: '#9f97ff'
  on-secondary-container: '#33288d'
  tertiary: '#00533b'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4f'
  on-tertiary-container: '#7ef1c2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e4dfff'
  secondary-fixed-dim: '#c5c0ff'
  on-secondary-fixed: '#140067'
  on-secondary-fixed-variant: '#41379b'
  tertiary-fixed: '#86f8c9'
  tertiary-fixed-dim: '#68dbae'
  on-tertiary-fixed: '#002115'
  on-tertiary-fixed-variant: '#00513a'
  background: '#fbf8ff'
  on-background: '#161b2d'
  surface-variant: '#dee1fb'
typography:
  display-hero:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
  code-metric:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  container-padding-mobile: 1rem
  container-padding-tablet: 1.5rem
  container-padding-desktop: 2.5rem
  max-content-width: 1200px
---

## Brand & Style

This design system pairs the rigor of contemporary fintech with the modular, editorial warmth of modern documentation workspaces. Built specifically for automated financial and academic evaluation explainability, the interface translates opaque computational logic into articulate, humane, and reassuring narratives. 

Key attributes:
- **Tone:** Authoritative yet radically clear, objective, reassuring, and approachable without feeling playful or frivolous.
- **Audience:** Applicants, academic financial aid committees, and credit officers seeking explainability, actionable recourse, and transparency.
- **Design Movement:** Clean Modern Workspace meets Tactile Editorial Minimalism. It avoids generic corporate sterility through soft cream backdrops, structured modular card stacks, distinct micro-borders, and carefully calibrated status pigments.

## Colors

The palette balances analytical authority with emotional consideration:
- **Primary Deep Indigo (`#4F46E5`):** Denotes primary action paths, AI confidence indicators, and primary navigation states.
- **Secondary Violet (`#7F77DD`):** Signals contextual hints, machine-assisted suggestions, and metadata groupings.
- **Status Triad:** 
  - **Approved Mint (`#1D9E75`):** Used for positive outcomes, matched criteria, and upward score vectors.
  - **Warm Amber (`#EF9F27`):** Marks borderline criteria, manual review queues, and weighted trade-offs.
  - **Coral Rose (`#D85A30`):** Reserved for unfulfilled factors, rejected outcomes, and critical application gaps.
- **Neutral & Canvas Foundations:** Crisp white (`#FFFFFF`) modules sit over a layered warm cream slate (`#FBFBFA` and `#F4F4F6`), grounded by deep slate typography (`#1E2235`) to ensure strict WCAG AAA readability for dense tabular metrics.

## Typography

The type system blends structural geometric display properties with high-legibility UI body types:
- **Manrope (Headlines & Decision Callouts):** Provides a robust, contemporary, geometric presence that maintains structural clarity at heavy weights without appearing aggressive.
- **Inter (Body, Metrics, Interface States):** Deployed for all operational text, scoring factors, dense decision breakdowns, and data tables. Provides optical clarity across dense layout matrices.
- **Micro-Copy & Metric Roles:** All numerical values, feature weightings, and model probabilities rely on tabular figures (`tnum`) inside `Inter` to ensure strict horizontal alignment across comparison tables.

## Layout & Spacing

Layout follows an 8px architectural grid inside a constrained fluid container:
- **Breakpoint Rhythm:**
  - **Desktop (>= 1024px):** 12-column grid, 24px gutter, maximum width capped at `1200px` for high readability. Supports two-pane inspection models (left: primary explainability score breakdown; right: interactive counterfactual "what-if" simulations).
  - **Tablet (768px - 1023px):** 8-column layout, 16px gutter, dynamically stacked lateral panes into sequential audit stages.
  - **Mobile (< 768px):** 4-column layout, 12px gutter, 16px horizontal edge gutters. All side-by-side metric tiles collapse into single-column vertical flows.
- **Whitespace Allocation:** Structural components favor deliberate padding (`space-xl` internally on cards) to evoke calm, workspace-like clarity instead of high-frequency dashboard clutter.

## Elevation & Depth

This design system avoids dark or heavy drop shadows, opting instead for ambient diffusion and layered card surfaces that resemble physical sheets of premium paper:

- **Surface Layer 0 (Base Canvas):** `#FBFBFA` creates a warm, calm, low-glare backdrop.
- **Surface Layer 1 (Primary Modular Cards):** `#FFFFFF` bordered with `1px solid rgba(229, 231, 235, 0.9)`. Ambient shadow: `0 1px 3px rgba(30, 34, 53, 0.04), 0 6px 16px -4px rgba(30, 34, 53, 0.03)`.
- **Surface Layer 2 (Interactive Flyouts & Hover Cards):** `#FFFFFF` paired with an indigo-tinted shadow: `0 8px 24px -4px rgba(79, 70, 229, 0.08), 0 2px 6px rgba(30, 34, 53, 0.04)`.
- **Surface Layer 3 (Decision Modals & Overlays):** `#FFFFFF` with a deeper resting drop: `0 20px 32px -8px rgba(30, 34, 53, 0.12), 0 4px 8px rgba(30, 34, 53, 0.04)`.
- **Focus Rings & Accent Depth:** Elements in focus leverage an offset dual ring (`2px #FFFFFF`, `2px #4F46E5`) ensuring high-contrast accessibility.

## Shapes

The interface balances soft friendliness with structured precision:
- **Card Containers:** Standardize on `16px` to `20px` corner radii (`rounded-lg` to `rounded-xl`), creating comfortable, approachable panels for decision breakdowns.
- **Interactive Controls (Inputs, Dropdowns):** Defined at `8px` to `10px` (`rounded`) to retain mechanical clarity and functional crispness.
- **Status Tags & Metric Badges:** Pure pill geometry (`9999px`) to immediately distinguish evaluative metadata, confidence flags, and status categories from operational cards.

## Components

### Buttons
- **Primary:** Deep Indigo background (`#4F46E5`), crisp white text, 8px corner radius, `10px 18px` padding. Resting subtle bottom stroke (`inset 0 -1px 0 rgba(0,0,0,0.2)`). Hover state lifts brightness subtly to `#4338CA`.
- **Secondary:** White surface, neutral text (`#1E2235`), subtle border (`#E5E7EB`). Hover brings background to `#F9FAFB` with border `#D1D5DB`.
- **Ghost:** Transparent fill, `#4F46E5` label, `#EEF2FF` hover background.

### Pill Badges & State Flags
- **Approved Pill:** Soft mint fill (`#E7F6F1`), dark emerald text (`#116348`), 1px solid `rgba(29, 158, 117, 0.2)`. Border-radius: `9999px`.
- **Review Pill:** Warm amber fill (`#FEF5E7`), burnt amber text (`#9A6310`), 1px solid `rgba(239, 159, 39, 0.2)`.
- **Rejected Pill:** Soft coral fill (`#FCEEE9`), deep rose text (`#973B1C`), 1px solid `rgba(216, 90, 48, 0.2)`.
- **Confidence Indicator:** Indigo tint (`#EEF2FF`), `#4F46E5` label, optional leading pulsing dot.

### Explainability Cards
- Layered white base (`#FFFFFF`) with `18px` corner radius.
- Includes a dedicated header strip: factor title on the left, impact weight badge (e.g., `+18 pts` or `-12 pts`) on the right.
- Contains an embedded confidence micro-bar (horizontal track: 4px height, `#F3F4F6`, filled with status tone).

### Form Inputs & Counterfactual Sliders
- **Text Inputs:** 8px radius, border `#E5E7EB`, internal inset shadow `inset 0 1px 2px rgba(0,0,0,0.02)`. Active state produces an Indigo boundary `#4F46E5` with `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- **What-If Sliders:** Track height 6px, `#E5E7EB` baseline, `#4F46E5` active segment, with a 20px circular white thumb casting a light ambient drop shadow.

### Data Lists & Metric Rows
- Clean borderless rows with `1px` subtle divider lines (`#F3F4F6`). 
- Feature weight labels feature monospace alignment for numerical outputs alongside human-readable plain language labels.