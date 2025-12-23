/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('OPFS Persistence', () => {
    let workerCode;
    let mockStorage = [];

    beforeAll(() => {
        workerCode = fs.readFileSync(path.join(__dirname, '../db-worker.js'), 'utf8');
    });

    beforeEach(() => {
        mockStorage = [];
    });

    test('Worker should handle exec messages and use persistence', (done) => {
        const dom = new JSDOM(``, { runScripts: "dangerously" });
        const window = dom.window;
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;

        window.importScripts = jest.fn((url) => {
            if (url.includes('sqlite3.js')) {
                 window.sqlite3InitModule = () => Promise.resolve({
                     opfs: { sqlite3Build: 'mock' },
                     oo1: {
                         OpfsDb: jest.fn(function() {
                             return {
                                 exec: jest.fn((options) => {
                                     // Simulate insert
                                     if (options.sql.includes('INSERT')) {
                                         mockStorage.push('row');
                                     }
                                     // Return results
                                     if (options.resultRows) {
                                         // If select, return what's in storage
                                         if (options.sql.includes('SELECT')) {
                                             mockStorage.forEach(r => options.resultRows.push(r));
                                         }
                                     }
                                 })
                             };
                         })
                     }
                 });
            }
        });

        // Timeout safety
        const timeout = setTimeout(() => {
            done('Timeout waiting for exec_result');
        }, 1000);

        window.postMessage = (msg) => {
            if (msg.type === 'db_ready') {
                // 1. Insert
                window.onmessage({ data: { type: 'exec', sql: 'INSERT INTO t VALUES(1)' }});
            }
            if (msg.type === 'exec_result') {
                 clearTimeout(timeout);
                 // Check storage
                 if (mockStorage.length > 0) {
                     done();
                 } else {
                     done('Storage empty after insert');
                 }
            }
        };

        window.eval(workerCode);
    });
});
