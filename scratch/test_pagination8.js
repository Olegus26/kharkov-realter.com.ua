const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    try {
        const res1 = await fetch(`${API_BASE}/getObject`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ key: API_KEY, data: { id: "1383562" } }),
        });
        const j1 = await res1.json();
        console.log("getObject:", j1);
    } catch (e) {
        console.log("getObject failed", e.message);
    }

    try {
        const res2 = await fetch(`${API_BASE}/getObjects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ key: API_KEY, data: { code: "1383562" } }),
        });
        const j2 = await res2.json();
        console.log("getObjects by code:", j2.data ? j2.data.map(d=>d.id) : j2);
    } catch (e) {
        console.log("getObjects by code failed", e.message);
    }
}

test();
