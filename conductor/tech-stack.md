# Technology Stack: openQuote

## 1. Platform & Environment
*   **Platform:** Chromium Extension (Manifest V3)
*   **Target Browsers:** Google Chrome, Microsoft Edge, Brave

## 2. Core Frontend
*   **Language:** Vanilla JavaScript (ES6+)
*   **Structure:** HTML5 (Semantic elements)
*   **Styling:** CSS3 (Vanilla, focusing on information density and utility)

## 3. Data Persistence & Management
*   **Database:** SQLite (integrated via WebAssembly / WASM)
*   **Persistence Strategy:** Origin Private File System (OPFS) for SQLite database storage.
*   **Preferences:** `localStorage` or `chrome.storage.local` for simple user settings.

## 4. Architecture & State
*   **State Management:** DOM-based state for active calculations; SQLite for historical data and complex settings.
*   **Communication:** Message passing between side panel UI and background service worker for database operations.

## 5. Build & Development
*   **Build System:** None (standard unpacked extension structure)
*   **Package Management:** Optional (npm for managing dependencies like `sqlite-wasm` if needed)
