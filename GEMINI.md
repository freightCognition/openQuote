# openQuote

## Project Overview

openQuote is an open-source Chromium extension designed for freight brokers to quickly generate spot quotes. It provides a side panel interface where users can input load details (miles, carrier rate, profit margin, etc.) and instantly see calculated totals, linehaul rates, and invoice amounts.

## Technology Stack

*   **Platform:** Chromium Extension (Manifest V3)
*   **Languages:** HTML, CSS, JavaScript (Vanilla)
*   **State Management:** `localStorage` for settings; DOM state for calculator inputs.
*   **Build System:** None (Load unpacked).

## Key Files

*   **`manifest.json`**: The extension manifest. Defines the side panel (`sidepanel.html`), background service worker (`background.js`), permissions (`sidePanel`), and icons.
*   **`sidepanel.html`**: The main user interface. Contains the HTML structure for the calculator inputs, results tables, and the settings modal.
*   **`calculator.js`**: Contains the core business logic.
    *   Selects DOM elements.
    *   `calculateAll()`: Performs all rate calculations (Carrier Rate, Gross Profit, All-In Rate, Fuel Surcharge, Linehaul, Accessorials, Invoice Total).
    *   `addEventListeners()`: Attaches input listeners to recalculate on change.
    *   `resetForm()`: Resets inputs to defaults.
*   **`settings.js`**: Manages user preferences.
    *   Defines default settings (Stop Fee, Profit Margin, etc.).
    *   `saveSettings()` / `loadSettings()`: Persists settings to `localStorage`.
    *   Handles the Settings Modal UI logic.
*   **`styles.css`**: Contains all styling for the extension.

## Building and Running

Since this project uses vanilla technologies without a build step:

1.  **Development:**
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable **Developer mode** (top right toggle).
    *   Click **Load unpacked**.
    *   Select the root directory of this project (`openQuote`).

2.  **Usage:**
    *   Click the extension icon or open the browser side panel to access the calculator.

## Development Conventions

*   **JavaScript:**
    *   Use vanilla JavaScript.
    *   Direct DOM manipulation (`document.getElementById`, `value`).
    *   Event-driven updates (listeners on `input` events trigger calculations).
    *   Use `parseFloat` and `toFixed(2)` for financial calculations to ensure precision for display.
    *   Initialize scripts using `document.addEventListener('DOMContentLoaded', ...)` to ensure the DOM is ready.
*   **HTML/CSS:**
    *   Keep structure semantic.
    *   Use CSS classes for styling; IDs for JavaScript selection.
*   **State:**
    *   Persistent user preferences (like default fees) should be stored in `localStorage` via `settings.js`.
    *   Transient calculation data lives in the DOM input values.
