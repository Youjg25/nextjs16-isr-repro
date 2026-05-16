// Design Ref: §3.1.1 — JSON-LD builders centralized for schema consistency
import { SITE_NAME, SITE_NAME_EN, SITE_URL, SUPPORT_EMAIL } from "@/lib/constants/site";

// --- Type definitions ---

interface OrganizationLdParams {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

interface JobPostingLdParams {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType: string;
  location: string;
  company: { name: string; logo?: string };
  salary?: { min: number; max?: number; unit: "HOUR" | "MONTH" | "YEAR" };
  directApply?: boolean;
}

interface CompanyOrganizationLdParams {
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  address?: string;
  industry?: string;
  founded?: string;
  size?: number;
}

interface ArticleLdParams {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  section?: string;
  keywords?: string;
  /** 현재 페이지 URL — mainEntityOfPage 지정용 (없으면 /contents 기본값) */
  url?: string;
}

interface PersonLdParams {
  name: string;
  description?: string;
  skills?: string[];
  education?: { school: string }[];
  url: string;
  sameAs?: string[];
}

interface FaqLdParams {
  questions: { question: string; answer: string }[];
}

interface HowToLdParams {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string; // ISO 8601 duration (e.g., "PT2H" = 2 hours)
  estimatedCost?: { currency: string; value: string };
  url?: string;
}

interface ItemListLdParams {
  name: string;
  description?: string;
  url: string;
  items: { name: string; url: string }[];
  numberOfItems?: number; // total count if items is partial
}

interface CollectionPageLdParams {
  name: string;
  description: string;
  url: string;
  about?: { name: string; alternateName?: string }[];
}

// --- Builder functions ---

/** Site-wide Organization (root layout) */
export function buildOrganizationLd(params?: OrganizationLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: params?.name ?? SITE_NAME,
    alternateName: ["Maison de Talents", "Maison de Talent", "메종 드 탤런트", "메종드탤런트"],
    url: params?.url ?? SITE_URL,
    logo: params?.logo ?? `${SITE_URL}/logo-v2.png`,
    description: params?.description ?? "백화점, 명품 매장, 프리미엄 리테일 서비스직 채용 전문 플랫폼",
    contactPoint: {
      "@type": "ContactPoint",
      email: SUPPORT_EMAIL,
      contactType: "customer service",
    },
    sameAs: [
      "https://instagram.com/maisondetalents_kr",
      "https://blog.naver.com/maisondetalents",
      // TODO: LinkedIn 회사 페이지는 1촌 누적 후 생성 시 활성화 (2026-05-09 보류, 1촌 부족으로 미생성)
      // "https://linkedin.com/company/maisondetalents",
      // TODO: Brunch 작가 페이지는 신청 승인(1~3일) 후 활성화 (2026-05-09 신청)
      // "https://brunch.co.kr/@maisondetalents",
      "https://www.saramin.co.kr/zf_user/company-info/view?csn=YmJoNzFJM2FpbTdaZHJnR1pYVHN0QT09",
      "https://www.jobkorea.co.kr/recruit/co_read/C/51378703",
      "https://www.jobplanet.co.kr/companies/498982/landing/%EB%A9%94%EC%A2%85%EB%93%9C%ED%83%A4%EB%9F%B0%ED%8A%B8",
    ],
  };
}

/** WebSite schema (root, enables sitelinks search box) */
export function buildWebSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/jobs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Job posting detail page */
export function buildJobPostingLd(params: JobPostingLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: params.title,
    description: params.description,
    datePosted: params.datePosted,
    ...(params.validThrough && { validThrough: params.validThrough }),
    employmentType: params.employmentType,
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: params.location,
        addressCountry: "KR",
      },
    },
    hiringOrganization: {
      "@type": "Organization",
      name: params.company.name,
      ...(params.company.logo && { logo: params.company.logo }),
    },
    ...(params.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "KRW",
        value: {
          "@type": "QuantitativeValue",
          minValue: params.salary.min,
          ...(params.salary.max && { maxValue: params.salary.max }),
          unitText: params.salary.unit,
        },
      },
    }),
    ...(params.directApply !== undefined && { directApply: params.directApply }),
  };
}

/** Company detail page Organization */
export function buildCompanyOrganizationLd(company: CompanyOrganizationLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website || `${SITE_URL}/companies`,
    ...(company.logo && { logo: company.logo }),
    ...(company.description && { description: company.description }),
    ...(company.industry && { industry: company.industry }),
    ...(company.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: company.address,
      },
    }),
    ...(company.founded && { foundingDate: company.founded }),
    ...(company.size && {
      numberOfEmployees: {
        "@type": "QuantitativeValue",
        value: company.size,
      },
    }),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME_EN,
      url: SITE_URL,
    },
  };
}

/** Article/content detail page.
 *
 * E-E-A-T 강화 (Phase 7):
 * - author = 편집팀일 때 Organization + about URL 로 Knowledge Graph 신호
 * - reviewedBy 는 항상 추가 (Gemini AI Overviews E-E-A-T 96% 인용 신호)
 * - methodology 링크로 출처/한계/갱신주기 명시 → Perplexity·ChatGPT·AI Briefing 신뢰성
 */
export function buildArticleLd(params: ArticleLdParams) {
  const isEditorialTeam = params.author === SITE_NAME;
  const authorBlock = isEditorialTeam
    ? {
        "@type": "Organization",
        name: SITE_NAME,
        url: `${SITE_URL}/about`,
      }
    : { "@type": "Person", name: params.author };

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    author: authorBlock,
    reviewedBy: {
      "@type": "Organization",
      name: `${SITE_NAME} 편집팀`,
      url: `${SITE_URL}/methodology`,
    },
    datePublished: params.datePublished,
    ...(params.dateModified && { dateModified: params.dateModified }),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-v2.png` },
    },
    mainEntityOfPage: params.url ?? `${SITE_URL}/contents`,
    // GEO: image 항상 ImageObject 로 — Gemini AI Overviews multi-modal 신호 (+156% 인용률)
    image: params.image
      ? { "@type": "ImageObject", url: params.image, caption: params.headline }
      : {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo-v2.png`,
          width: 512,
          height: 512,
          caption: SITE_NAME,
        },
    ...(params.section && { articleSection: params.section }),
    ...(params.keywords && { keywords: params.keywords }),
  };
}

/** Talent/resume profile page */
export function buildPersonLd(params: PersonLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    ...(params.description && { description: params.description }),
    ...(params.skills && params.skills.length > 0 && { knowsAbout: params.skills }),
    ...(params.education &&
      params.education.length > 0 && {
        alumniOf: params.education.map((edu) => ({
          "@type": "EducationalOrganization",
          name: edu.school,
        })),
      }),
    url: params.url,
    ...(params.sameAs && params.sameAs.length > 0 && { sameAs: params.sameAs }),
  };
}

/** FAQ page (guide/interview etc.) */
export function buildFaqLd(params: FaqLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: params.questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}

/**
 * HowTo schema for procedural content (interview prep, application steps, etc.).
 * LLMs (ChatGPT/Perplexity) cite HowTo step lists frequently for "how to X" queries.
 */
export function buildHowToLd(params: HowToLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.url && { url: params.url }),
    ...(params.totalTime && { totalTime: params.totalTime }),
    ...(params.estimatedCost && {
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: params.estimatedCost.currency,
        value: params.estimatedCost.value,
      },
    }),
    step: params.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/**
 * ItemList schema for list/index pages (jobs, brands, companies, contents).
 * Helps LLMs understand the page is a curated set of related items.
 */
export function buildItemListLd(params: ItemListLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: params.name,
    ...(params.description && { description: params.description }),
    url: params.url,
    numberOfItems: params.numberOfItems ?? params.items.length,
    itemListElement: params.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

/** CollectionPage schema for thematic hub pages (e.g., /brands hub). */
export function buildCollectionPageLd(params: CollectionPageLdParams) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.name,
    description: params.description,
    url: params.url,
    ...(params.about && {
      about: params.about.map((a) => ({
        "@type": "Organization",
        name: a.name,
        ...(a.alternateName && { alternateName: a.alternateName }),
      })),
    }),
  };
}
