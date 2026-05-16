// Stub of production constants/interview-simulator.ts (1141 LOC).
// The broken page only reads BRAND_INTERVIEWS via:
//   BRAND_INTERVIEWS.some((bi) => bi.brandKey === brandSlug)

interface BrandInterview {
  brandKey: string;
  title: string;
}

export const BRAND_INTERVIEWS: BrandInterview[] = [
  { brandKey: "chanel", title: "샤넬 면접 가이드" },
  { brandKey: "louis-vuitton", title: "루이비통 면접 가이드" },
  { brandKey: "hermes", title: "에르메스 면접 가이드" },
  { brandKey: "gucci", title: "구찌 면접 가이드" },
  { brandKey: "dior", title: "디올 면접 가이드" },
  { brandKey: "cartier", title: "까르띠에 면접 가이드" },
  { brandKey: "prada", title: "프라다 면접 가이드" },
  { brandKey: "burberry", title: "버버리 면접 가이드" },
];
