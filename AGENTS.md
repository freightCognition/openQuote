# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project

openQuote is a Chromium browser extension (Manifest V3) for freight brokers to generate spot quotes. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no package manager.

## Development

**Setup:** Load unpacked in Chrome at `chrome://extensions` with Developer Mode enabled, selecting the repo root.

**Testing:** Open `tests/calculator.test.html` in a browser. Tests use a custom assertion harness that logs pass/fail to the DOM. There is no CLI test runner.

## Architecture

- `sidepanel.html` — Main UI, loaded as Chrome side panel. Table-based calculator layout with settings modal.
- `calculator.js` — Core business logic. `calculateAll()` is the single entry point for all rate math, triggered by input event listeners.
- `settings.js` — Manages user preferences (stop fee, fuel rate, load fee) via `localStorage` under key `'rateCalculatorSettings'`. Loaded before `calculator.js`.
- `background.js` — Minimal service worker that opens the side panel on extension icon click.
- `styles.css` — All styling. Dark theme with GeistMono monospace font.

**Data flow:** Input events → `calculateAll()` → writes computed values to readonly output fields. No intermediate state objects — values are read from and written to the DOM directly.

## Critical Business Logic

**Gross profit margin formula** (true margin, NOT markup-on-cost):
```
allInRate = carrierRate / (1 - GP% / 100)
```
Example: 20% GP on $2/mile carrier = $2.50/mile sell. Verify: ($2.50 - $2) / $2.50 = 20%.

**Carrier rate sync:** RPM and flat rate fields are bidirectionally linked. `lastCarrierEdit` tracks which field the user edited last to prevent infinite loops. When RPM is edited, flat rate updates (`rpm × miles`); when flat rate is edited, RPM updates (`flat / miles`).

**Edge case guards:**
- GP% >= 100 → clears all output fields and shows a warning row (mathematically invalid: division by zero or negative sell price)
- Profit total clamped >= 0
- Miles = 0 → avoids division by zero in per-mile calculations

## Conventions

- Vanilla JavaScript only — no frameworks or libraries
- `parseFloat()` + `toFixed(2)` for financial display precision
- IDs for JS selection, classes for CSS styling
- `DOMContentLoaded` for initialization
- Persistent state in `localStorage` via `settings.js`; transient state lives in DOM inputs
