# Production-Level Design System & Architecture Specification
**Project:** Antigravity (Product-Level Web Application)  
**Target Standard:** Enterprise-Grade UI/UX & Modern Aesthetic Framework

---

## 1. Executive Summary & Philosophy
Building a product-level website means moving beyond static brochures into dynamic, intuitive, and performant web applications. Every component must balance **clarity, performance, and accessibility**, ensuring users can achieve their goals with minimal cognitive load.

---

## 2. Core Design Principles

### A. Clarity & Visual Hierarchy
* **The 3-Second Rule:** A user landing on any page must immediately understand its primary value proposition and call-to-action (CTA).
* **Typographic Scale:** Establish strict mathematical scaling using rem units to maintain rhythm across viewports.
  * *Display / H1:* $3.5\text{rem}$ ($56\text{px}$) with tight line-height ($1.1$)
  * *H2 / Section Title:* $2.25\text{rem}$ ($36\text{px}$)
  * *Body / Text:* $1\text{rem}$ ($16\text{px}$) with comfortable reading line-height ($1.6$)
* **Color Contrast:** All text must meet WCAG AA standards (minimum $4.5:1$ contrast ratio for normal text).

### B. State Management & Feedback Loops
Every interactive element must account for all core UI states:
1. **Default:** Resting state with clear affordance.
2. **Hover / Focus:** Clear visual shift (color tint, scale, or border glow) and distinct keyboard focus rings.
3. **Active / Pressed:** Immediate tactile feedback.
4. **Loading / Pending:** Skeleton screens or inline spinners rather than blocking UI freezes.
5. **Success / Error / Empty:** Clear inline messaging with recovery paths.

---

## 3. Modern Aesthetic Tokens (The "Antigravity" Look)

### A. Color Palette (Dark-First Theme Architecture)
* **Canvas / Background:** Deep obsidian / midnight slate (`#0B0F17` to `#111827`)
* **Surfaces / Cards:** Translucent slate with subtle elevation (`#1F2937` with opacity layers)
* **Primary Accent (Action):** Electric Indigo or Neon Cyan (`#6366F1` / `#38BDF8`)
* **Borders & Dividers:** Subtle white rim lighting (`border-white/10` or `#374151`)

### B. Layout Paradigms
* **Bento Grid Layouts:** Asymmetrical, modular card containers used for dashboard analytics and feature highlights.
* **Glassmorphism & Depth:** Backdrop blurs (`backdrop-filter: blur(12px)`) combined with subtle inner shadows and 1px borders to establish depth layers.
* **Micro-Interactions:** Smooth, spring-physics transitions ($200\text{ms}$–$300\text{ms}$) for modals, dropdowns, and hover lifts.

---

## 4. Component-Driven Checklist

* [ ] **Buttons:** Variants for Primary, Secondary, Ghost, and Destructive. Support for loading spinner states.
* [ ] **Inputs & Forms:** Explicit labels, inline validation text, helper tooltips, and distinct focus states.
* [ ] **Navigation:** Responsive header with mobile drawer, breadcrumbs for deep hierarchies, and user profile menus.
* [ ] **Data Displays:** Clean tables with sorting/filtering, empty states with illustration or guidance, and pagination or infinite scroll.
* [ ] **Modals & Overlays:** Accessible focus trapping, backdrop dimming, and escape-key dismissal.

---

## 5. Technical & Accessibility (a11y) Requirements
* **Semantic HTML:** Proper use of `<header>`, `<main>`, `<nav>`, `<section>`, and `<article>`.
* **Keyboard Navigation:** Fully operable via `Tab`, `Shift+Tab`, `Enter`, and `Space`.
* **Performance Budget:** First Contentful Paint (FCP) $< 1.2\text{s}$, Cumulative Layout Shift (CLS) $= 0$.