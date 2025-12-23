# Track Spec: Core Infrastructure (SQLite & Keybindings)

## Overview
This track focuses on building the foundational data and interaction layers for openQuote. By integrating SQLite (via WASM) and a robust keyboard navigation system, we will enable historical data persistence and a high-efficiency workflow for freight brokers.

## Goals
- **SQLite WASM Integration:** Replace transient DOM state with a persistent SQLite database stored in the Origin Private File System (OPFS).
- **Background Persistence:** Use a Web Worker to handle database operations off the main UI thread.
- **Keyboard-Centric UI:** Implement a global keybinding system for all core application actions.

## Technical Requirements
### 1. SQLite Data Layer
- **Library:** `sqlite-wasm`
- **Persistence:** Origin Private File System (OPFS).
- **Architecture:** Web Worker (`db-worker.js`) managing the DB, communicating via `postMessage` with the UI (`sidepanel.js`).
- **Schema:**
    - `quotes`: id, timestamp, origin, destination, miles, carrier_rate, margin, etc.
    - `settings`: key, value (e.g., default_fsc_pct, default_stop_fee).

### 2. Keyboard Navigation
- **Framework:** Custom event listener on `window`.
- **Shortcuts:**
    - `Alt + C`: Calculate All
    - `Alt + R`: Reset Form
    - `Alt + S`: Save Quote
    - `Alt + ,`: Open Settings
- **UI:** Visual highlights for inputs when focused via keyboard.

## Acceptance Criteria
- Quotes are persisted and survive extension reloads/browser restarts.
- Database operations do not block the UI thread.
- All core buttons can be triggered via keyboard shortcuts.
- Code coverage for new data layer logic is >80%.
