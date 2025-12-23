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

describe('SQLite Initialization', () => {
    let workerCode;

    beforeAll(() => {
        workerCode = fs.readFileSync(path.join(__dirname, '../db-worker.js'), 'utf8');
    });

    test('Worker should initialize SQLite and report ready', (done) => {
        const dom = new JSDOM(``, { runScripts: "dangerously" });
        const window = dom.window;
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;

        // Mock postMessage
        window.postMessage = jest.fn();

        // Mock importScripts
        window.importScripts = jest.fn((url) => {
            if (url.includes('sqlite3.js')) {
                 // Define mock sqlite3InitModule
                 window.sqlite3InitModule = () => Promise.resolve({
                     opfs: {
                         sqlite3Build: 'mock-build'
                     },
                     oo1: {
                         OpfsDb: jest.fn(() => ({
                             exec: jest.fn()
                         }))
                     }
                 });
            }
        });
        
        // Spy on postMessage to wait for 'db_ready'
        window.postMessage = (data) => {
             if (data.type === 'db_ready') {
                 try {
                    expect(data.sqlite3).toBeDefined(); // or just presence of type
                    done();
                 } catch (e) {
                     done(e);
                 }
             }
        };

        // Eval worker
        window.eval(workerCode);
        
        // The worker should call importScripts immediately
        expect(window.importScripts).toHaveBeenCalledWith(expect.stringContaining('sqlite3.js'));
    });
});
