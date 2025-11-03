// src/api/hunters.tsx

// src/types/hunter.tsx
export interface Hunter {
  origen: string;
  id?: number;           // Relacional (Postgres)
  _id?: string;          // NoSQL (MongoDB)
  nombre: string;
  edad?: number;
  altura?: number;
  peso?: number;
  imageUrl: string;
}


const RELACIONAL_URL = "https://hunters-svc-relational.onrender.com/api/personajes";
const NOSQL_URL = "https://hunters-svc-nosql.onrender.com/api/hunters";

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return null; }
}

export async function getAllHunters(): Promise<Hunter[]> {
  const [r1, r2] = await Promise.all([
    fetch(RELACIONAL_URL).then(safeJson).catch(() => []),
    fetch(NOSQL_URL).then(safeJson).catch(() => []),
  ]);

  const rel = Array.isArray(r1) ? r1.map((h: any) => ({ ...h, origen: "relacional", imageurl: h.imageurl ?? null })) : [];
  const nosql = Array.isArray(r2) ? r2.map((h: any) => ({ ...h, origen: "nosql", imageurl: h.imageUrl ?? null })) : [];

  return [...rel, ...nosql];
}

export async function getById(id: string): Promise<Hunter | null> {
  // try relational if numeric
  if (/^\d+$/.test(id)) {
    try {
      const res = await fetch(`${RELACIONAL_URL}/${id}`);
      if (res.ok) {
        const data = await safeJson(res);
        return { ...(data as any), origen: "relacional", imageurl: data?.imageurl ?? null };
      }
    } catch {}
  }
  // try nosql
  try {
    const res = await fetch(`${NOSQL_URL}/${id}`);
    if (res.ok) {
      const data = await safeJson(res);
      return { ...(data as any), origen: "nosql", imageurl: (data as any)?.imageUrl ?? null };
    }
  } catch {}
  return null;
}

export async function createHunter(data: any, destino: "relacional" | "nosql") {
  const URL = destino === "relacional" ? RELACIONAL_URL : NOSQL_URL;
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
}

export async function updateHunter(id: string | number, origen: string, payload: any) {
  const URL = origen === "relacional" ? `${RELACIONAL_URL}/${id}` : `${NOSQL_URL}/${id}`;
  const res = await fetch(URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res;
}

export async function deleteHunter(id: string | number, origen: string) {
  const URL = origen === "relacional" ? `${RELACIONAL_URL}/${id}` : `${NOSQL_URL}/${id}`;
  const res = await fetch(URL, { method: "DELETE" });
  return res;
}
