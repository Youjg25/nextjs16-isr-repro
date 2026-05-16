import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientBadge from "../../../components/ClientBadge";

// =====================================================================
// REPRO: Next.js 16 + turbopack + ISR + generateStaticParams produces
// silent incomplete RSC payload on build-time SSG prerender.
//
// Toggle to see the difference:
//   export const dynamic = "force-dynamic"; // ✅ healthy
//   export const revalidate = 3600;         // ❌ broken (this branch)
// =====================================================================

export const revalidate = 3600;

const SITE_NAME = "ISR Repro";
const SITE_URL = "https://example.com";

interface StoreDefinition {
  slug: string;
  nameKo: string;
  nameShort: string;
  category: string;
  region: string;
  publicTransport: string;
  positioning: string;
  description: string;
  longtailKeywords: string[];
  matchPatterns: string[];
  highlightBrands: string[];
}

const CATEGORIES = ["백화점", "백화점", "면세점", "복합쇼핑몰", "백화점", "백화점", "백화점", "면세점", "복합쇼핑몰", "백화점"];
const REGIONS = ["서울", "부산", "인천", "서울", "대구", "광주", "대전", "제주", "서울", "수원"];
const LINES = ["지하철 2호선", "지하철 1호선", "공항철도", "지하철 9호선", "지하철 2호선", "지하철 1호선", "지하철 1호선", "공항버스", "신분당선", "수인분당선"];

const STORE_DEFINITIONS: StoreDefinition[] = Array.from({ length: 14 }, (_, i) => {
  const idx = i + 1;
  const letter = String.fromCharCode(64 + idx);
  return {
    slug: `store-${letter.toLowerCase()}-${idx}`,
    nameKo: `스토어 ${letter}-${idx}`,
    nameShort: `스토어 ${letter}-${idx}`,
    category: CATEGORIES[i % CATEGORIES.length],
    region: REGIONS[i % REGIONS.length],
    publicTransport: LINES[i % LINES.length],
    positioning: `${REGIONS[i % REGIONS.length]} ${CATEGORIES[i % CATEGORIES.length]} 핵심 럭셔리 매장`,
    description: `스토어 ${letter}-${idx} 입점 럭셔리 브랜드 BA·SA·매니저 채용과 면접 가이드. ${REGIONS[i % REGIONS.length]} 지역 ${CATEGORIES[i % CATEGORIES.length]} 거점으로 다수 글로벌 브랜드가 입점한 매장입니다.`,
    longtailKeywords: [
      `스토어 ${letter}-${idx} 채용`,
      `스토어 ${letter}-${idx} BA`,
      `스토어 ${letter}-${idx} SA`,
      `${REGIONS[i % REGIONS.length]} 럭셔리 매장 채용`,
      `${CATEGORIES[i % CATEGORIES.length]} ${REGIONS[i % REGIONS.length]} 채용`,
    ],
    matchPatterns: [`스토어 ${letter}-${idx}`, REGIONS[i % REGIONS.length]],
    highlightBrands: Array.from({ length: 8 }, (_, j) => `brand-${((i + j) % 23) + 1}`),
  };
});

const BRAND_DEFINITIONS = Array.from({ length: 23 }, (_, i) => ({
  slug: `brand-${i + 1}`,
  nameKo: `브랜드 ${i + 1}`,
}));

interface MockJob {
  id: string;
  title: string;
  category: string;
  employment_type: string;
  salary_min: number;
  salary_max: number;
  location: string;
  created_at: string;
}

// Static mock — Supabase fetch was ruled out in experiment 2A.
const JOB_CATEGORIES = ["BA", "SA", "매니저", "트레이너", "VMD", "주얼리 SA", "워치 SA", "코스메틱 BA", "PB", "교환원", "캐셔", "수선사"];
const EMPLOYMENT_TYPES = ["정규직", "계약직", "인턴", "파트타임"];

async function fetchStoreJobs(store: StoreDefinition): Promise<MockJob[]> {
  return Array.from({ length: 12 }, (_, i) => ({
    id: `${store.slug}-${i + 1}`,
    title: `${store.nameShort} ${JOB_CATEGORIES[i % JOB_CATEGORIES.length]} 채용`,
    category: JOB_CATEGORIES[i % JOB_CATEGORIES.length],
    employment_type: EMPLOYMENT_TYPES[i % EMPLOYMENT_TYPES.length],
    salary_min: 25000000 + i * 1000000,
    salary_max: 35000000 + i * 1500000,
    location: store.region,
    created_at: `2026-05-${String((i % 15) + 1).padStart(2, "0")}`,
  }));
}

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return STORE_DEFINITIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const store = STORE_DEFINITIONS.find((s) => s.slug === slug);
  if (!store) return { title: "매장을 찾을 수 없음" };

  const title = `${store.nameKo} 채용 — 입점 럭셔리 브랜드 BA·SA 공고와 면접 가이드`;
  const url = `${SITE_URL}/guide/store/${slug}`;

  return {
    title,
    description: store.description,
    keywords: store.longtailKeywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: store.description,
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
    },
    twitter: { card: "summary_large_image", title, description: store.description },
  };
}

export default async function StoreDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const store = STORE_DEFINITIONS.find((s) => s.slug === slug);
  if (!store) notFound();

  const jobs = await fetchStoreJobs(store);

  const highlightBrandDefs = store.highlightBrands
    .map((s) => BRAND_DEFINITIONS.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => b != null);

  const siblings = STORE_DEFINITIONS.filter((s) => s.category === store.category && s.slug !== store.slug).slice(0, 3);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "가이드", item: `${SITE_URL}/guide` },
      { "@type": "ListItem", position: 2, name: "매장별 채용", item: `${SITE_URL}/guide/store` },
      { "@type": "ListItem", position: 3, name: store.nameShort, item: `${SITE_URL}/guide/store/${slug}` },
    ],
  };

  const faqs = [
    {
      question: `${store.nameKo}에서 일하면 어떤가요?`,
      answer: `${store.positioning} ${store.nameShort}은 ${store.region}에 위치하며 ${highlightBrandDefs
        .slice(0, 5)
        .map((b) => b?.nameKo)
        .filter(Boolean)
        .join(", ")} 등 럭셔리 브랜드가 입점한 핵심 매장입니다.`,
    },
    {
      question: `${store.nameShort} 채용은 어디서 확인하나요?`,
      answer: `${store.nameShort} 관련 공고를 자동 수집합니다. 이 페이지 하단의 "현재 채용 중" 섹션에서 active 공고를 확인하세요. ${jobs.length}건의 공고가 등록되어 있습니다.`,
    },
    {
      question: `${store.nameShort} 면접 준비는 어떻게 하나요?`,
      answer: `매장별 면접은 입점 브랜드의 면접 가이드를 따릅니다. ${highlightBrandDefs
        .slice(0, 3)
        .map((b) => `${b?.nameKo} 면접 가이드`)
        .join(", ")}를 확인하세요.`,
    },
    {
      question: `${store.nameShort} 채용 공고가 안 보이는데요?`,
      answer: "현재 active 상태인 공고만 표시됩니다. 채용 시즌이 아닐 경우 공고가 적을 수 있습니다.",
    },
  ];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const nowIso = new Date().toISOString();
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${store.nameKo} 채용 — 입점 럭셔리 브랜드 BA·SA 공고와 면접 가이드`,
    description: store.description,
    datePublished: "2026-05-05",
    dateModified: nowIso,
    author: { "@type": "Organization", name: `${SITE_NAME} 편집팀` },
    articleSection: "매장별 채용",
    keywords: store.longtailKeywords.join(", "),
    url: `${SITE_URL}/guide/store/${slug}`,
  };

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${store.nameKo} 입점 럭셔리 브랜드`,
    description: `${store.nameKo}에 입점한 럭셔리 브랜드 ${highlightBrandDefs.length}곳`,
    url: `${SITE_URL}/guide/store/${slug}`,
    itemListElement: highlightBrandDefs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.nameKo,
      url: `${SITE_URL}/brands/${b.slug}`,
    })),
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, faqLd, articleLd, itemListLd]) }}
      />
      <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
        <Link href="/">홈</Link> · <Link href="/guide">가이드</Link>
      </header>

      <section style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: "#888" }}>{store.category}</div>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>{store.nameKo}</h1>
        <p style={{ color: "#555" }}>{store.positioning}</p>
        <div style={{ marginTop: 12 }}>
          <ClientBadge storeSlug={store.slug} storeName={store.nameShort} />
        </div>
      </section>

      <nav style={{ padding: "0 24px" }} aria-label="페이지 경로">
        <ol style={{ display: "flex", gap: 4, fontSize: 12, color: "#777" }}>
          <li>
            <Link href="/">홈</Link>
          </li>
          <li>›</li>
          <li>
            <Link href="/guide">가이드</Link>
          </li>
          <li>›</li>
          <li>
            <Link href="/guide/store">매장별 채용</Link>
          </li>
          <li>›</li>
          <li aria-current="page">{store.nameShort}</li>
        </ol>
      </nav>

      <main style={{ padding: 24, display: "grid", gap: 24 }}>
        <section style={{ border: "1px solid #eee", padding: 16, borderRadius: 8 }}>
          <h2>TLDR</h2>
          <ul>
            <li>지역: {store.region}</li>
            <li>교통: {store.publicTransport}</li>
            <li>카테고리: {store.category}</li>
            <li>입점 브랜드 {highlightBrandDefs.length}곳</li>
            <li>현재 채용 {jobs.length}건</li>
          </ul>
        </section>

        <section>
          <h2>입점 럭셔리 브랜드</h2>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {highlightBrandDefs.map((b) => (
              <li key={b.slug} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                <Link href={`/brands/${b.slug}`}>
                  <div>{b.nameKo}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>현재 채용 중 ({jobs.length}건)</h2>
          <ul style={{ display: "grid", gap: 12 }}>
            {jobs.map((j) => (
              <li key={j.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                <div style={{ fontWeight: 600 }}>{j.title}</div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {j.category} · {j.employment_type} · {j.location}
                </div>
                <div style={{ fontSize: 13 }}>
                  {(j.salary_min / 10000).toLocaleString()}만원 ~ {(j.salary_max / 10000).toLocaleString()}만원
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>자주 묻는 질문</h2>
          <dl style={{ display: "grid", gap: 16 }}>
            {faqs.map((f, i) => (
              <div key={i}>
                <dt style={{ fontWeight: 600 }}>{f.question}</dt>
                <dd style={{ color: "#555", marginTop: 4 }}>{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>비슷한 매장</h2>
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {siblings.map((s) => (
              <li key={s.slug} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
                <Link href={`/guide/store/${s.slug}`}>
                  <div style={{ fontWeight: 600 }}>{s.nameKo}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>{s.region}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          style={{
            border: "1px solid #eee",
            padding: 24,
            borderRadius: 8,
            textAlign: "center",
            background: "linear-gradient(180deg, #fff7e6, #fff)",
          }}
        >
          <h2>지금 지원하기</h2>
          <p>{store.nameKo}의 채용 공고에 지금 바로 지원해보세요.</p>
          <Link href="/jobs" style={{ display: "inline-block", padding: "8px 16px", border: "1px solid #aaa", borderRadius: 6 }}>
            전체 공고 보기
          </Link>
        </section>
      </main>

      <footer style={{ padding: 16, borderTop: "1px solid #ddd", textAlign: "center", color: "#888" }}>
        © {SITE_NAME}
      </footer>
    </div>
  );
}
