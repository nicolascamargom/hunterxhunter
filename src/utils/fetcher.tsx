// src/utils/fetcher.tsx
import * as rel from "../api/huntersRelational";
import * as nosql from "../api/huntersNosql";

export async function getAll() {
  const [r, n] = await Promise.all([rel.getAll().catch(() => []), nosql.getAll().catch(() => [])]);
  const relMapped = Array.isArray(r) ? r.map((h: any) => ({ ...h, origen: "relacional", imageurl: h.imageurl ?? h.imageUrl ?? null })) : [];
  const noMapped = Array.isArray(n) ? n.map((h: any) => ({ ...h, origen: "nosql", imageurl: h.imageUrl ?? h.imageurl ?? null })) : [];
  return [...relMapped, ...noMapped];
}
