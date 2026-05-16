"use client";

import { useState } from "react";
import { BRAND_DEFINITIONS } from "@/lib/constants/brands";

const META_BY_SLUG = new Map(
  BRAND_DEFINITIONS.map((d) => [d.slug, { domain: d.domain, nameKo: d.nameKo, nameEn: d.nameEn }])
);

/** Self-host SVG 가 있는 브랜드 (public/logos/brands/{slug}.svg) — Wikimedia Commons 출처 */
const SELF_HOSTED_LOGO_SLUGS = new Set([
  "chanel",
  "louis-vuitton",
  "hermes",
  "gucci",
  "dior",
  "cartier",
  "prada",
  "burberry",
  "bvlgari",
  "tiffany",
  "rolex",
  "yves-saint-laurent",
  "celine",
  "fendi",
  "bottega-veneta",
  "balenciaga",
  "loewe",
  "valentino",
  "van-cleef-arpels",
  "moncler",
]);

interface BrandLogoProps {
  slug: string;
  size?: number;
  className?: string;
}

/**
 * 브랜드 로고 — 3-tier fallback chain.
 *
 * 1. Self-host SVG (`/logos/brands/{slug}.svg`) — 6 핵심 브랜드 (Wikimedia Commons SVG)
 * 2. DuckDuckGo favicon (`icons.duckduckgo.com/ip3/{domain}.ico`) — 16~48px ICO/PNG
 * 3. 한글 이니셜 + 골드 칩 (favicon 도 실패 시)
 *
 * Google s2/favicons 는 럭셔리 브랜드에 대해 generic page icon (leaf) 반환 → 사용 X.
 * Clearbit Logo API 는 2024 deprecation 으로 DNS 사망.
 */
export default function BrandLogo({ slug, size = 16, className = "" }: BrandLogoProps) {
  const meta = META_BY_SLUG.get(slug);
  const [tier, setTier] = useState<0 | 1 | 2>(SELF_HOSTED_LOGO_SLUGS.has(slug) ? 0 : meta?.domain ? 1 : 2);

  // Tier 2 — 이니셜 fallback
  if (tier === 2) {
    const initial = meta?.nameKo?.[0] ?? meta?.nameEn?.[0]?.toUpperCase() ?? "?";
    const fontSize = size <= 20 ? size * 0.6 : size <= 32 ? size * 0.55 : size * 0.5;
    return (
      <span
        className={`inline-flex items-center justify-center bg-[var(--gold-50)] text-[var(--gold-700)] font-medium rounded ${className}`}
        style={{ width: size, height: size, fontSize, lineHeight: 1 }}
        aria-hidden="true"
      >
        {initial}
      </span>
    );
  }

  // Tier 0 — self-hosted SVG / Tier 1 — DuckDuckGo favicon
  const src = tier === 0 ? `/logos/brands/${slug}.svg` : `https://icons.duckduckgo.com/ip3/${meta?.domain}.ico`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- 외부 favicon onError chain 이 next/image 에서 unstable, native img 사용
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setTier(tier === 0 ? (meta?.domain ? 1 : 2) : 2)}
      className={`object-contain rounded ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
