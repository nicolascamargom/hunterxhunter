// src/hooks/useHunters.tsx
import { useEffect, useState, useCallback } from "react";
import * as rel from "../api/huntersRelational";
import * as nosql from "../api/huntersNosql";

export default function useHunters() {
  const [hunters, setHunters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [a, b] = await Promise.all([rel.getAll().catch(() => []), nosql.getAll().catch(() => [])]);
    const relMapped = Array.isArray(a) ? a.map((h: any) => ({ ...h, origen: "relacional", imageurl: h.imageurl ?? h.imageUrl ?? null })) : [];
    const noMapped = Array.isArray(b) ? b.map((h: any) => ({ ...h, origen: "nosql", imageurl: h.imageUrl ?? h.imageurl ?? null })) : [];
    setHunters([...relMapped, ...noMapped]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { hunters, loading, reload: load };
}
