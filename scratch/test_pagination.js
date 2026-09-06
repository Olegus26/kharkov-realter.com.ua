const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function post(method, data) {
    const res = await fetch(`${API_BASE}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data }),
    });
    return res.json();
}

async function test() {
    console.log("Testing pagination...");
    const r1 = await post('getObjects', { start_id: 0, limit: 5 });
    const ids1 = r1.data.map(d => d.id);
    console.log('Page 1 IDs:', ids1);

    const lastIdNum = Number(ids1[ids1.length - 1]);
    const r2 = await post('getObjects', { start_id: lastIdNum, limit: 5 });
    const ids2 = r2.data.map(d => d.id);
    console.log(`Page 2 with start_id (Number) ${lastIdNum} IDs:`, ids2);
    
    const r3 = await post('getObjects', { start_id: String(lastIdNum), limit: 5 });
    const ids3 = r3.data.map(d => d.id);
    console.log(`Page 2 with start_id (String) '${lastIdNum}' IDs:`, ids3);
    
    // Also test with "start" instead of start_id
    const r4 = await post('getObjects', { start: 5, limit: 5 });
    console.log(`Page 2 with start: 5 IDs:`, r4.data ? r4.data.map(d => d.id) : []);

    const r5 = await post('getObjects', { start_id: 5, limit: 5 });
    console.log(`Page 2 with start_id: 5 IDs:`, r5.data ? r5.data.map(d => d.id) : []);
}

test();
