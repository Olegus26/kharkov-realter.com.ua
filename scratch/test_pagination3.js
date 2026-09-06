const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    const r1 = await fetch(`${API_BASE}/getObjects?page=2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5 } }),
    });
    const j1 = await r1.json();
    console.log("Query ?page=2:", j1.data.map(d=>d.id));

    const r2 = await fetch(`${API_BASE}/getObjects?start=5`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5 } }),
    });
    const j2 = await r2.json();
    console.log("Query ?start=5:", j2.data.map(d=>d.id));
}

test();
