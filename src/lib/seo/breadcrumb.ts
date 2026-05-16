// Design Ref: §3.1.2 — BreadcrumbList generator with route presets
import { SITE_URL, SITE_NAME } from "@/lib/constants/site";

interface BreadcrumbItem {
  readonly name: string;
  readonly path: string;
}

/** Build BreadcrumbList JSON-LD from path items */
export function buildBreadcrumbLd(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}

/** Route presets for common breadcrumb paths */
export const BREADCRUMBS = {
  jobs: [{ name: "채용공고", path: "/jobs" }],
  companies: [{ name: "기업 목록", path: "/companies" }],
  talents: [{ name: "인재풀", path: "/talents" }],
  contents: [{ name: "콘텐츠", path: "/contents" }],
  guide: [{ name: "커리어 허브", path: "/guide" }],
  guideSalary: [
    { name: "커리어 허브", path: "/guide" },
    { name: "급여 인텔리전스", path: "/guide/salary" },
  ],
  guideInterview: [
    { name: "커리어 허브", path: "/guide" },
    { name: "면접 가이드", path: "/guide/interview" },
  ],
  guideCareerPath: [
    { name: "커리어 허브", path: "/guide" },
    { name: "커리어 패스", path: "/guide/career-path" },
  ],
} as const;
