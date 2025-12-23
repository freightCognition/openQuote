const fs = require('fs');
const path = require('path');

describe('Infrastructure Setup', () => {
    test('lib/sqlite3.js should exist', () => {
        const filePath = path.join(__dirname, '../lib/sqlite3.js');
        expect(fs.existsSync(filePath)).toBe(true);
    });

    test('lib/sqlite3.wasm should exist', () => {
        const filePath = path.join(__dirname, '../lib/sqlite3.wasm');
        expect(fs.existsSync(filePath)).toBe(true);
    });

    test('db-worker.js should exist', () => {
        const filePath = path.join(__dirname, '../db-worker.js');
        expect(fs.existsSync(filePath)).toBe(true);
    });
});
