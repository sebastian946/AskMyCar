---
name: Precision Manuals
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#38393a'
  surface-container-lowest: '#0c0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2b'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#1a1a1a'
  on-primary-container: '#848282'
  inverse-primary: '#5f5e5e'
  secondary: '#ffb5a0'
  on-secondary: '#5f1500'
  secondary-container: '#d73b00'
  on-secondary-container: '#fffbff'
  tertiary: '#c9c6c5'
  on-tertiary: '#313030'
  tertiary-container: '#1a1a1a'
  on-tertiary-container: '#848282'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862200'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  chat-text:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is engineered for the intersection of automotive precision and high-performance software. It captures the visceral feeling of sitting in a high-end modern cockpit—focused, dark, and highly legible under pressure. The target audience includes car enthusiasts, owners of complex modern vehicles, and DIY mechanics who value technical accuracy and speed.

The visual style is a blend of **Modern SaaS** and **Automotive Instrumentation**. It utilizes a "Cockpit" approach: deep matte surfaces, high-contrast typography, and functional accents that mimic warning lights and gauge needles. The emotional response is one of authority and reliability; the AI isn't just a chatbot, it’s a master technician.

Key stylistic markers include:
- **Instrumentation Borders:** Containers use subtle, high-precision outlines.
- **Vibrant Accents:** Use of "Deep Orange" to highlight active states, mimicking dashboard notifications.
- **Tech-Optimized:** Dark mode is the primary state, reducing eye strain during night-time garage use.

## Colors

The palette is rooted in the high-contrast environment of night driving.

- **Primary (Graphite - #1A1A1A):** Used for the main application background and deep structural elements.
- **Surface (Matte Black - #0D0D0D):** Used for interactive cards, input fields, and chat bubbles to create depth against the primary background.
- **Accent (Deep Orange - #FF5722):** Reserved for primary actions, active indicators, and critical information. It mimics the "Check Engine" or "Sport Mode" lighting.
- **Text (Off-white - #F5F5F5):** High-readability neutral to ensure AI-generated instructions are clear in all lighting conditions.
- **Functional Colors:** Success (Green) and Error (Red) follow standard automotive warning light conventions.

## Typography

Typography prioritizes rapid information scanning. 

- **Headlines:** Montserrat provides a wide, confident, and "engineered" feel. It should be used for section headers and vehicle titles.
- **Body:** Inter is used for the core chat experience and manual excerpts for its exceptional legibility and neutral tone.
- **Labels:** JetBrains Mono (monospaced) is used for technical data, VIN numbers, and status labels to evoke a diagnostic tool aesthetic.

All headlines should use tighter letter-spacing for a more aggressive, modern look. Labels should be uppercase with generous tracking to mimic industrial plate engraving.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain the "Dashboard" feel, centered on the screen. On mobile, it transitions to a fluid vertical stack.

- **Grid System:** A 12-column grid is used for desktop. 
- **The "Cockpit" Layout:** Content is grouped into distinct modular zones. The left zone is for vehicle status, the center for the AI chat (the "HUD"), and the right for technical diagrams or manual references.
- **Safe Margins:** Use 24px (md) as the default padding for all containers to ensure technical diagrams have room to breathe.

## Elevation & Depth

This design system avoids traditional shadows in favor of **Tonal Layering** and **High-Precision Outlines**.

- **Layer 0 (Background):** Graphite (#1A1A1A).
- **Layer 1 (Surfaces):** Matte Black (#0D0D0D). Surfaces are defined by 1px solid borders in a slightly lighter grey (#333333) rather than shadows.
- **Active State:** When an element is focused or active, the border color changes to the Accent Orange (#FF5722) with a very subtle outer glow (0px 0px 8px rgba(255, 87, 34, 0.3)).
- **Glassmorphism:** Use a subtle backdrop blur (12px) for sticky headers to maintain a sense of layered materials.

## Shapes

The shape language is **Technical and Precise**. 

- **Soft Edges:** A base radius of 0.25rem (4px) is used to prevent the UI from feeling dangerously sharp while maintaining a rigid, mechanical quality.
- **Standard Radius:** 4px for buttons, inputs, and small modules.
- **Large Radius:** 8px (rounded-lg) for main chat containers and dashboard cards.
- **Specific Cuts:** Buttons may feature "chamfered" corners (angled 45 degrees) on one side to mimic custom automotive parts.

## Components

- **Buttons:** Primary buttons are Solid Orange (#FF5722) with black text. Secondary buttons use a Matte Black fill with a 1px Graphite border.
- **Vehicle Chip:** A specialized component showing [Year] [Brand] [Model]. It features a small circular "status light" (Green/Red) indicating if the manual data is fully indexed.
- **Chat Bubbles:** AI responses appear on Matte Black (#0D0D0D) with a thin orange accent line on the left side, mimicking a gauge needle.
- **Progress Bars:** Designed to look like "RPM Gauges." Instead of a smooth fill, they use segmented blocks that light up as they progress.
- **Gauge Cards:** Small cards used for quick stats (e.g., Oil Type, Tire Pressure). They include a "Label-Caps" header and a large, bold value in Montserrat.
- **Inputs:** Text fields are inset (inner shadow) to appear recessed into the dashboard surface, with a high-contrast cursor in Accent Orange.