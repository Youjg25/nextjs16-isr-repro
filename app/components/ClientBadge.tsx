"use client";

import { useState, useEffect } from "react";

interface ClientBadgeProps {
  storeSlug: string;
  storeName: string;
}

// Minimal client component used inside an ISR-prerendered server component page.
// Mirrors the GNB / BrandLogo pattern from the production repo where the bug surfaced.
export default function ClientBadge({ storeSlug, storeName }: ClientBadgeProps) {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    setNow(new Date().toISOString());
  }, []);

  return (
    <div
      style={{
        padding: "4px 8px",
        border: "1px solid #aaa",
        borderRadius: 4,
        fontSize: 12,
        display: "inline-block",
      }}
      data-slug={storeSlug}
    >
      {storeName} · client-hydrated{now ? ` at ${now.slice(11, 19)}` : ""}
    </div>
  );
}
