/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');

describe('DB Client Bridge', () => {
    
    test('DBClient should manage worker communication', async () => {
        // Mock Worker
        global.Worker = class MockWorker {
            constructor(script) {
                this.script = script;
                setTimeout(() => {
                    if (this.onmessage) this.onmessage({ data: { type: 'db_ready' } });
                }, 10);
            }
            postMessage(msg) {
                setTimeout(() => {
                    if (msg.type === 'exec') {
                        if (this.onmessage) this.onmessage({ data: { type: 'exec_result', resultRows: ['mock'] } });
                    }
                }, 10);
            }
        };

        const dbJs = fs.readFileSync(path.join(__dirname, '../db.js'), 'utf8');
        window.eval(dbJs);

        const client = new window.DBClient();
        await client.init();

        const result = await client.exec('SELECT * FROM t');
        expect(result).toEqual(['mock']);
    });
});
