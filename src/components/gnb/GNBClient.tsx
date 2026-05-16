"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GNBClientProps {
  autoFetch?: boolean;
}

// Stub mirroring the autoFetch shape: on public pages, the real component
// fetches user/badges/company on mount via the browser supabase client.
export default function GNBClient({ autoFetch }: GNBClientProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (autoFetch) setHydrated(true);
  }, [autoFetch]);

  return (
    <header style={{ borderBottom: "1px solid #ddd", padding: "12px 16px", display: "flex", gap: 16 }}>
      <Link href="/">홈</Link>
      <Link href="/guide">가이드</Link>
      <Link href="/jobs">채용공고</Link>
      <span style={{ marginLeft: "auto", fontSize: 12, color: "#888" }}>
        {hydrated ? "hydrated" : "loading"}
      </span>
    </header>
  );
}
