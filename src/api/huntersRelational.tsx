// src/api/huntersRelational.tsx
const BASE = "https://hunters-svc-relational.onrender.com/api/personajes";

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

export async function updateHunter(id: number, data: any) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

export async function deleteHunter(id: number) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return res;
}
