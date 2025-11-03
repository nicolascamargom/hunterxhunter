// src/types/hunter.tsx
export type Origin = "relacional" | "nosql";

export type Hunter = {
  id?: number;
  _id?: string;
  nombre: string;
  edad?: number | null;
  altura?: number | null;
  peso?: number | null;
  imageurl?: string | null; // postgres
  imageUrl?: string | null; // mongo
  origen?: Origin; // ← Aquí agregamos esto para que no dé error
};


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