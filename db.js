// db.js
class DBClient {
    constructor() {
        this.worker = null;
        this.pendingRequests = [];
        this.isReady = false;
        this.readyPromise = null;
    }

    init() {
        if (this.readyPromise) return this.readyPromise;

        this.readyPromise = new Promise((resolve, reject) => {
            this.worker = new Worker('db-worker.js');
            
            this.worker.onmessage = (e) => {
                const msg = e.data;
                // Log for debugging
                // console.log('Client received:', msg);

                if (msg.type === 'db_ready') {
                    this.isReady = true;
                    resolve();
                } else if (msg.type === 'exec_result') {
                    const req = this.pendingRequests.shift();
                    if (req) req.resolve(msg.resultRows);
                } else if (msg.type === 'exec_error') {
                     const req = this.pendingRequests.shift();
                     if (req) req.reject(new Error(msg.error));
                } else if (msg.type === 'db_error') {
                    console.error('DB Error', msg.error);
                }
            };
        });
        return this.readyPromise;
    }

    exec(sql) {
        return new Promise((resolve, reject) => {
            if (!this.isReady) {
                reject(new Error('DB not ready'));
                return;
            }
            this.pendingRequests.push({ resolve, reject });
            this.worker.postMessage({ type: 'exec', sql });
        });
    }
}

window.DBClient = DBClient;
