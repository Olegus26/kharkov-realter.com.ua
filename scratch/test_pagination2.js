const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    const res = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, limit: 5, start_id: 5, data: { limit: 5 } }),
    });
    const j = await res.json();
    console.log(j.data.map(d=>d.id));
}

test();
