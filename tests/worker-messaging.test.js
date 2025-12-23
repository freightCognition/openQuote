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

describe('Worker Messaging', () => {
    let workerCode;
    let window;

    beforeAll(() => {
        workerCode = fs.readFileSync(path.join(__dirname, '../db-worker.js'), 'utf8');
    });

    test('Worker should respond with pong when pinged', () => {
        // Setup JSDOM
        const dom = new JSDOM(``, { runScripts: "dangerously" });
        window = dom.window;
        
        // Polyfill TextEncoder in the JSDOM window as well if needed by sqlite
        window.TextEncoder = TextEncoder;
        window.TextDecoder = TextDecoder;
        
        // Mock postMessage on window (which acts as self in this scope)
        window.postMessage = jest.fn();

        // Eval the worker code
        window.eval(workerCode);

        // Verify onmessage is defined
        expect(typeof window.onmessage).toBe('function');

        // Trigger the message
        window.onmessage({ data: { type: 'ping' } });

        // Expectation: Worker should respond with { type: 'pong' }
        // This will fail because current worker does not respond.
        expect(window.postMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'pong' }));
    });
});