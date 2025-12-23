# Track Plan: Core Infrastructure (SQLite & Keybindings)

## Phase 1: SQLite Infrastructure
- [ ] Task: Setup SQLite WASM dependency and Web Worker skeleton
- [ ] Task: Write Tests: Verify Web Worker initialization and message passing
- [ ] Task: Implement SQLite initialization in Worker with OPFS
- [ ] Task: Write Tests: Verify OPFS persistence across sessions
- [ ] Task: Implement message bridge between UI and DB Worker
- [ ] Task: Conductor - User Manual Verification 'SQLite Infrastructure' (Protocol in workflow.md)

## Phase 2: Data Layer & Schema
- [ ] Task: Define Database Schema (Quotes and Settings tables)
- [ ] Task: Write Tests: CRUD operations for Quotes table
- [ ] Task: Implement Quotes DAO (Data Access Object)
- [ ] Task: Write Tests: CRUD operations for Settings table
- [ ] Task: Implement Settings DAO
- [ ] Task: Conductor - User Manual Verification 'Data Layer & Schema' (Protocol in workflow.md)

## Phase 3: Keyboard Navigation Framework
- [ ] Task: Implement global keybinding event listener
- [ ] Task: Write Tests: Verify shortcut triggers for Calculate and Reset
- [ ] Task: Implement shortcuts for core actions (Alt+C, Alt+R, Alt+S)
- [ ] Task: Write Tests: Verify focus management and visual indicators
- [ ] Task: Implement visual focus indicators and accessibility enhancements
- [ ] Task: Conductor - User Manual Verification 'Keyboard Navigation' (Protocol in workflow.md)
