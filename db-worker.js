// db-worker.js - SQLite WASM Worker

console.log('Worker initialized');

self.onmessage = function(e) {
    console.log('Worker received message', e.data);
}
