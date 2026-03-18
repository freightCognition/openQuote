# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

openQuote is a Chromium extension (Manifest V3) for freight brokers to generate spot quotes via a browser side panel. Vanilla HTML/CSS/JS with no build system, no frameworks, no dependencies.

## Development

**Load the extension:**
1. Navigate to `chrome://extensions`, enable Developer mode
2. Click "Load unpacked" and select this project directory
3. Click the extension icon to open the side panel calculator

**No build step.** Edit files directly and reload the extension to test. Chrome auto-reloads on service worker changes; manually reload for HTML/CSS/JS changes.

**Tests:** Open `tests/calculator.test.html` in a browser to run the inline test suite (no framework needed).

## Architecture

The extension is a side panel (`sidepanel.html`) with two JS modules loaded in order:

1. **`settings.js`** (loaded first) — Defines the global `settings` object and manages persistence via `localStorage` (key: `rateCalculatorSettings`). Handles the settings modal UI. Exposes `settings` on `window` for cross-file access.

2. **`calculator.js`** (loaded second) — Core calculation engine. `calculateAll()` is the single function that recomputes all derived values whenever any input changes. All input fields have `input` event listeners that trigger `calculateAll()`.

3. **`background.js`** — Minimal service worker; sets `openPanelOnActionClick: true` on install.

### Calculation Flow (calculator.js)

All calculations chain from user inputs through `calculateAll()`:

```
Carrier Rate = carrierFlatRate / miles
Margin Multiplier = 1 / (1 - profitPercentage / 100)   [clamped: GP% must be < 100]
All-In Rate = carrierRate * marginMultiplier
All-In Total = miles * allInRate
Gross Profit $ = allInTotal - carrierFlatRate
Fuel Total = miles * fuelRate
Linehaul Rate = allInRate - fuelRate  (clamped to 0)
Linehaul Total = miles * linehaulRate
Accessorial Total = loadFee + otherFee + (stops * stopFee)
Invoice Total = (linehaulTotal + fuelTotal) + accessorialTotal
Per Mile Total = invoiceTotal / miles
```

### Key Patterns

- **DOM references** are cached at module top-level via `getElementById`
- **Financial formatting**: all outputs use `.toFixed(2)`, inputs parsed with `parseFloat(x) || 0`
- **Settings access from calculator**: `window.settings ? settings.stopFee : 50.00`
- **Reset** clears inputs to zero except fuel rate (preserved from settings)
- **ID naming**: kebab-case (e.g., `carrier-flat-rate`, `invoice-total`)
- Only `sidePanel` permission is required

## License

AGPL-3.0-only — modifications must be shared under the same license.
