# Decodelabs_Project-3
# DecodeLabs Interactive Sandbox

**Project 3: Interactive Web Elements**

A single-page demo built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no external libraries. It showcases four self-contained interactive components: a persistent theme switcher, a stateful counter, an accessible sliding menu, and a validated submission form.

---

## 1. File structure

```
sandbox/
├── index.html   → Markup and structure
├── style.css    → All visual styling, theme tokens, and responsive rules
└── app.js       → All interactivity (four independent modules)
```

Open `index.html` directly in a browser — no server or build process required.

---

## 2. Features

### 2.1 Theme Actuator (light/dark mode)
- Click **"Toggle Theme State"** to switch the entire interface between light and dark.
- The chosen theme is saved in `localStorage`, so it's remembered the next time the page loads.
- A small inline script in `<head>` applies the saved theme (or the operating system's preference, via `prefers-color-scheme`) **before the page paints**. This prevents the "flash of wrong theme" that happens when JavaScript only applies dark mode after the page has already rendered in light mode.

### 2.2 State Tracker (counter)
- **"Increment State"** adds 1 to the score; **"Reset State"** sets it back to 0.
- The score persists across page reloads via `localStorage`.
- Every update triggers a brief scale animation on the number for visual feedback.

### 2.3 Component Mutator (sliding menu)
- **"Toggle Component Menu"** expands or collapses a hidden panel.
- Built with a CSS Grid row transition (`grid-template-rows: 0fr → 1fr`) rather than a hardcoded height, so it animates smoothly regardless of how much content is inside.
- `aria-expanded` is kept in sync with the open/closed state for screen reader users, and the `≡` icon rotates 90° when open.

### 2.4 Data Conduit (submission form)
- A text field with a **"Submit Payload"** button.
- Submitting an empty field shows an inline error message and outlines the input in red.
- Submitting a non-empty value shows a success message and clears the field.
- The error clears automatically as soon as the user starts typing again — no need to resubmit first.
- Feedback text uses `aria-live="polite"` so assistive technology announces the result.

---

## 3. Design system

All colors are defined once as CSS variables on `:root` and overridden under a single `[data-theme="dark"]` block. No component rule ever hardcodes a color — everything references a variable (`var(--ink)`, `var(--accent)`, etc.), which is what makes the whole page re-theme correctly with one attribute change.

| Token | Purpose |
|---|---|
| `--bg`, `--surface` | Page background vs. card background |
| `--ink`, `--muted` | Primary vs. secondary text |
| `--accent` | Theme toggle / primary buttons |
| `--success`, `--danger` | Increment / reset / form feedback |
| `--border`, `--shadow` | Card outlines and elevation |

Buttons share one base selector (`[class^="btn-"]`) for shape, sizing, and hover/focus behavior; each variant (`.btn-primary`, `.btn-success`, `.btn-danger`, `.btn-secondary`) only needs to set a single background color.

---

## 4. JavaScript architecture

`app.js` is one IIFE (Immediately Invoked Function Expression) containing four independent `init` functions:

```
initThemeToggle()   — theme button + localStorage sync
initCounter()        — increment/reset + localStorage sync
initSlidingMenu()     — open/close + aria-expanded sync
initSubmitForm()      — validation + feedback messaging
```

Each function:
- Queries only the DOM elements it needs
- Guards itself with `if (!el) return`, so removing a section from the HTML can't throw an error elsewhere
- Has no dependency on the other three modules

All four are started together on `DOMContentLoaded`.

---

## 5. Responsive behavior

| Breakpoint | Behavior |
|---|---|
| Desktop (> 600px) | Buttons and form sit in a horizontal row |
| Mobile (≤ 600px) | Action buttons stack vertically and become full-width; the form input becomes full-width |

The layout itself is a single centered column (`max-width: 920px`) at every screen size, so no separate mobile/desktop structure is needed beyond the button and form adjustments above.

---

## 6. Accessibility notes

- All interactive buttons have either visible text or an `aria-label`.
- `aria-pressed` reflects the theme toggle's current state.
- `aria-expanded` reflects the sliding menu's current state.
- Form feedback is announced via `aria-live="polite"`, and the input is refocused automatically on a failed submission.
- Keyboard focus is visible on every interactive element (`:focus-visible` outline).
- `prefers-reduced-motion: reduce` disables all transitions and animations site-wide for users who've requested it at the OS level.

---

## 7. Browser support

Uses only standard, widely supported web platform features — CSS custom properties, CSS Grid, `localStorage`, and `matchMedia`. Works in all current versions of Chrome, Firefox, Safari, and Edge, on desktop and mobile.

---

## 8. Possible extensions

- Sync theme preference to a backend account instead of just `localStorage`
- Add a maximum/minimum bound to the counter
- Expand the submission form with additional fields and a basic email-format check
- Add unit tests for the four `init` functions using a lightweight test runner
