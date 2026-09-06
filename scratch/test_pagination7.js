const API_BASE = 'https://novostoy.com.ua/api/json';
const API_KEY = '4j6yrnNZnAtsZdNfsFCcBPSqsxBO38AP';

async function test() {
    const res = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { id: "1383562" } }),
    });
    const j = await res.json();
    console.log("ID search:", j.data ? j.data.map(d=>d.id) : j);
    
    // Test with ID search array just in case
    const res2 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { id: ["1383562"] } }),
    });
    const j2 = await res2.json();
    console.log("ID search array:", j2.data ? j2.data.map(d=>d.id) : j2);

    // Test with object_id
    const res3 = await fetch(`${API_BASE}/getObjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ key: API_KEY, data: { object_id: "1383562" } }),
    });
    const j3 = await res3.json();
    console.log("object_id search:", j3.data ? j3.data.map(d=>d.id) : j3);
}

test();
