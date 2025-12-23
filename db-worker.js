// db-worker.js - SQLite WASM Worker

console.log('Worker initialized');

// Load SQLite
try {
    importScripts('lib/sqlite3.js');
} catch (e) {
    console.error("Failed to import sqlite3.js", e);
}

let db;

if (typeof sqlite3InitModule !== 'undefined') {
    sqlite3InitModule({
        print: console.log,
        printErr: console.error,
    }).then((sqlite3) => {
        console.log('SQLite3 initialized');
        try {
            if (sqlite3.oo1 && sqlite3.oo1.OpfsDb) {
                db = new sqlite3.oo1.OpfsDb('openquote.db');
                console.log('OPFS Database opened');
            } else {
                 console.warn('OPFS not available');
            }
            self.postMessage({ type: 'db_ready', sqlite3: true });
        } catch (e) {
            console.error('DB Init failed', e);
            self.postMessage({ type: 'db_error', error: e.message });
        }
    });
}

self.onmessage = function(e) {
    console.log('Worker received message', e.data);
    if (e.data && e.data.type === 'ping') {
        self.postMessage({ type: 'pong' });
    }
}