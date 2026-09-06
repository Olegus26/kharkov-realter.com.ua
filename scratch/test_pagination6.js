const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    const res1 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5, price_from: 10000, price_to: 20000 } }),
    });
    const j1 = await res1.json();
    console.log("Price 10k-20k:", j1.data ? j1.data.map(d=>d.price) : j1);

    const res2 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { limit: 5, price_from: 50000, price_to: 60000 } }),
    });
    const j2 = await res2.json();
    console.log("Price 50k-60k:", j2.data ? j2.data.map(d=>d.price) : j2);
}

test();
