// db-worker.js - SQLite WASM Worker

console.log('Worker initialized');

self.onmessage = function(e) {
    console.log('Worker received message', e.data);
    if (e.data && e.data.type === 'ping') {
        self.postMessage({ type: 'pong' });
    }
}
