const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    const r1 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { parent_id: "2", sell_type: "2", limit: 5 } }),
    });
    const j1 = await r1.json();
    console.log("Page 1:", j1.data.map(d=>d.id));
    const lastId = j1.data[j1.data.length - 1].id;

    const r2 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { parent_id: "2", sell_type: "2", limit: 5, start_id: lastId } }),
    });
    const j2 = await r2.json();
    console.log("Page 2 (start_id=" + lastId + "):", j2.data.map(d=>d.id));
}

test();
