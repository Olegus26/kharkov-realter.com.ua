const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    const res1 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5 } }),
    });
    const j1 = await res1.json();
    console.log("start_id missing:", j1.data.map(d=>d.id));

    const res2 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5, start_id: 5 } }),
    });
    const j2 = await res2.json();
    console.log("start_id: 5 :", j2.data.map(d=>d.id));

    const res3 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5, start_id: 50 } }),
    });
    const j3 = await res3.json();
    console.log("start_id: 50 :", j3.data.map(d=>d.id));
}

test();
