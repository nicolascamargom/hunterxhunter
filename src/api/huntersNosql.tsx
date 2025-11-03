// src/api/huntersNosql.tsx
const BASE = "https://hunters-svc-nosql.onrender.com/api/hunters";

export async function getAll() {
  const res = await fetch(BASE);
  return res.ok ? res.json() : [];
}

export async function createHunter(data: any) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateHunter(id: string, data: any) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteHunter(id: string) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return res;
}
