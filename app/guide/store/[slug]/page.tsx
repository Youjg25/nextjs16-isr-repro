import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Train, Briefcase } from "lucide-react";

import GNB from "@/components/gnb/GNB";
import Footer from "@/components/layout/Footer";
import PageBanner from "@/components/layout/PageBanner";
import JsonLd from "@/components/seo/JsonLd";
import BrandLogo from "@/components/ui/BrandLogo";
import TldrCard from "@/components/seo/TldrCard";

import { SITE_NAME, SITE_URL } from "@/lib/constants/site";
import { STORE_DEFINITIONS, findStoreBySlug, type StoreDefinition } from "@/lib/constants/stores";
import { BRAND_DEFINITIONS } from "@/lib/constants/brands";
import { BRAND_INTERVIEWS } from "@/lib/constants/interview-simulator";
import { buildBreadcrumbLd } from "@/lib/seo/breadcrumb";
import { buildArticleLd, buildFaqLd, buildItemListLd } from "@/lib/seo/json-ld";
import { createPublicClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

// REPRO: revert the 5/16 hotfix to expose the bug. Toggle to "force-dynamic" to see the page render fine.
export const revalidate = 3600;

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return STORE_DEFINITIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const store = findStoreBySlug(slug);
  if (!store) return { title: "매장을 찾을 수 없음" };

  const title = `${store.nameKo} 채용 — 입점 럭셔리 브랜드 BA·SA 공고와 면접 가이드`;
  const description = store.description;
  const url = `${SITE_URL}/guide/store/${slug}`;

  return {
    title,
    description,
    keywords: store.longtailKeywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: "ko_KR",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

interface StoreJob {
  id: string;
  title: string | null;
  category: string | null;
  employment_type: string | null;
  salary_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  created_at: string | null;
}

async function fetchStoreJobs(store: StoreDefinition): Promise<StoreJob[]> {
  const supabase = createPublicClient();
  const orFilter = store.matchPatterns.flatMap((p) => [`title.ilike.%${p}%`, `description.ilike.%${p}%`]).join(",");
  const { data, error } = await supabase
    .from("job_postings")
    .select("id, title, category, employment_type, salary_type, salary_min, salary_max, location, created_at")
    .eq("status", "active")
    .or(orFilter)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) {
    logger.warn("StoreDetail", "fetchStoreJobs failed", { slug: store.slug, error: error.message });
    return [];
  }
  return (data as StoreJob[]) ?? [];
}

function getInterviewLink(brandSlug: string): string | null {
  const has = BRAND_INTERVIEWS.some((bi) => bi.brandKey === brandSlug);
  return has ? `/guide/interview/${brandSlug}` : null;
}

export default async function StoreDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const store = findStoreBySlug(slug);
  if (!store) notFound();

  const jobs = await fetchStoreJobs(store);

  const highlightBrandDefs = store.highlightBrands
    .map((s) => BRAND_DEFINITIONS.find((b) => b.slug === s))
    .filter((b): b is NonNullable<typeof b> => b != null);

  const siblings = STORE_DEFINITIONS.filter((s) => s.category === store.category && s.slug !== store.slug).slice(0, 3);

  const breadcrumbLd = buildBreadcrumbLd([
    { name: "가이드", path: "/guide" },
    { name: "매장별 채용", path: "/guide/store" },
    { name: store.nameShort, path: `/guide/store/${slug}` },
  ]);

  const faqs = [
    {
      question: `${store.nameKo}에서 일하면 어떤가요?`,
      answer: `${store.positioning} ${store.nameShort}은 ${store.region}에 위치하며 ${highlightBrandDefs
        .slice(0, 5)
        .map((b) => b?.nameKo)
        .filter(Boolean)
        .join(
          ", "
        )} 등 럭셔리 브랜드가 입점한 핵심 매장입니다. BA·SA·매니저 등 다양한 직무에서 럭셔리 리테일 경력을 쌓을 수 있습니다.`,
    },
    {
      question: `${store.nameShort} 채용은 어디서 확인하나요?`,
      answer: `메종 드 탤런트는 잡코리아·사람인 등 주요 채용 보드와 브랜드 공식 채용 페이지에서 ${store.nameShort} 관련 공고를 자동 수집합니다. 이 페이지 하단의 "현재 채용 중" 섹션에서 active 공고를 확인하세요. ${jobs.length}건의 공고가 등록되어 있습니다.`,
    },
    {
      question: `${store.nameShort} 면접 준비는 어떻게 하나요?`,
      answer: `매장별 면접은 입점 브랜드의 면접 가이드를 따릅니다. ${highlightBrandDefs
        .slice(0, 3)
        .map((b) => `${b?.nameKo} 면접 가이드`)
        .join(
          ", "
        )} 페이지에서 브랜드별 면접 질문과 합격 전략을 확인하세요. 매장 위치 (${store.region})와 ${store.publicTransport ?? "교통편"}도 필수 체크 항목입니다.`,
    },
    {
      question: `${store.nameShort} 채용 공고가 안 보이는데요?`,
      answer:
        "현재 active 상태인 공고만 표시됩니다. 채용 시즌(주로 신학기·시즌 오프 직전)이 아닐 경우 공고가 적을 수 있습니다. 알림 설정으로 신규 공고 등록 시 즉시 받아볼 수 있습니다.",
    },
  ];
  const faqLd = buildFaqLd({ questions: faqs });

  const nowIso = new Date().toISOString();
  const articleLd = buildArticleLd({
    headline: `${store.nameKo} 채용 — 입점 럭셔리 브랜드 BA·SA 공고와 면접 가이드`,
    description: store.description,
    datePublished: "2026-05-05",
    dateModified: nowIso,
    author: `${SITE_NAME} 편집팀`,
    section: "매장별 채용",
    keywords: store.longtailKeywords.join(", "),
    url: `${SITE_URL}/guide/store/${slug}`,
  });

  const itemListLd = buildItemListLd({
    name: `${store.nameKo} 입점 럭셔리 브랜드`,
    description: `${store.nameKo}에 입점한 럭셔리 브랜드 ${highlightBrandDefs.length}곳`,
    url: `${SITE_URL}/guide/store/${slug}`,
    items: highlightBrandDefs.map((b) => ({
      name: b.nameKo,
      url: `${SITE_URL}/brands/${b.slug}`,
    })),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={[breadcrumbLd, faqLd, articleLd, itemListLd]} />
      <GNB />
      <PageBanner badge={store.category} title={store.nameKo} subtitle={store.positioning} />

      <nav className="container-wide pt-4 sm:pt-6" aria-label="페이지 경로">
        <ol className="flex items-center gap-1 text-xs text-[var(--warm-500)]">
          <li>
            <Link href="/" className="hover:text-[var(--gold-500)]">
              홈
            </Link>
          </li>
          <ChevronRight className="w-3 h-3 text-[var(--warm-400)]" aria-hidden="true" />
          <li>
            <Link href="/guide" className="hover:text-[var(--gold-500)]">
              가이드
            </Link>
          </li>
          <ChevronRight className="w-3 h-3 text-[var(--warm-400)]" aria-hidden="true" />
          <li>
            <Link href="/guide/store" className="hover:text-[var(--gold-500)]">
              매장별 채용
            </Link>
          </li>
          <ChevronRight className="w-3 h-3 text-[var(--warm-400)]" aria-hidden="true" />
          <li className="text-[var(--color-charcoal)] font-medium">{store.nameShort}</li>
        </ol>
      </nav>

      <main className="container-wide py-8 sm:py-12 flex-1 space-y-8">
        {/* Hero card — 매장 메타 */}
        <section className="card-lg p-6 space-y-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--color-charcoal)]">
              {store.nameKo} 채용
            </h1>
            <p className="text-sm text-[var(--warm-500)] mt-2">
              {store.mall} · {store.branch} · {store.category}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="flex items-start gap-2 text-[var(--warm-600)]">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[var(--gold-500)]" aria-hidden="true" />
              <div>
                <span className="font-medium text-[var(--color-charcoal)]">위치</span>
                <p className="text-[var(--warm-500)] mt-0.5">{store.address}</p>
              </div>
            </div>
            {store.publicTransport && (
              <div className="flex items-start gap-2 text-[var(--warm-600)]">
                <Train className="w-4 h-4 mt-0.5 shrink-0 text-[var(--gold-500)]" aria-hidden="true" />
                <div>
                  <span className="font-medium text-[var(--color-charcoal)]">교통편</span>
                  <p className="text-[var(--warm-500)] mt-0.5">{store.publicTransport}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--warm-100)]">
            {store.longtailKeywords.slice(0, 6).map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-0.5 rounded-lg bg-[var(--gold-50)] text-[var(--gold-600)] border border-[var(--gold-200)]"
              >
                #{kw}
              </span>
            ))}
          </div>
        </section>

        {/* TL;DR — citation-friendly */}
        <TldrCard
          title={`${store.nameShort} 한눈에`}
          updatedAt={nowIso}
          bullets={[
            `${store.nameKo} — ${store.region} 소재 ${store.category}. ${store.positioning}.`,
            `입점 럭셔리 브랜드 ${highlightBrandDefs.length}곳: ${highlightBrandDefs
              .slice(0, 6)
              .map((b) => b?.nameKo)
              .filter(Boolean)
              .join(", ")}${highlightBrandDefs.length > 6 ? " 외" : ""}.`,
            jobs.length > 0
              ? `현재 active 채용 공고 ${jobs.length}건. BA·SA·매니저 등 다양한 직무.`
              : "현재 active 공고가 없을 수 있으나 시즌별 채용이 정기적으로 발생합니다.",
            `메종 드 탤런트 — 백화점·면세점·아울렛 럭셔리 리테일 채용 전문 플랫폼.`,
          ]}
        />

        {/* 입점 럭셔리 브랜드 그리드 */}
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-4">입점 럭셔리 브랜드</h2>
          <p className="text-sm text-[var(--warm-500)] mb-4">
            {store.nameShort}에 입점한 핵심 럭셔리 브랜드 {highlightBrandDefs.length}곳. 브랜드별 채용·면접·연봉 정보를
            확인하세요.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highlightBrandDefs.map((b) => {
              const interviewHref = getInterviewLink(b.slug);
              return (
                <li key={b.slug} className="card p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-white border border-[var(--warm-200)] flex items-center justify-center p-1.5">
                      <BrandLogo slug={b.slug} size={28} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-[var(--color-charcoal)] truncate">{b.nameKo}</p>
                      <p className="text-xs text-[var(--warm-500)] truncate">{b.nameEn}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <Link
                      href={`/brands/${b.slug}`}
                      className="px-2 py-0.5 rounded-lg bg-[var(--gold-50)] text-[var(--gold-600)] border border-[var(--gold-200)] hover:bg-[var(--gold-100)] transition-colors"
                    >
                      브랜드 허브
                    </Link>
                    <Link
                      href={`/guide/brand-inside/${b.slug}`}
                      className="px-2 py-0.5 rounded-lg bg-white text-[var(--warm-600)] border border-[var(--warm-200)] hover:bg-[var(--warm-50)] transition-colors"
                    >
                      인사이드
                    </Link>
                    {interviewHref && (
                      <Link
                        href={interviewHref}
                        className="px-2 py-0.5 rounded-lg bg-white text-[var(--warm-600)] border border-[var(--warm-200)] hover:bg-[var(--warm-50)] transition-colors"
                      >
                        면접 가이드
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Active 채용 공고 */}
        <section>
          <h2 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-4">
            {store.nameShort} 현재 채용 중 ({jobs.length}건)
          </h2>
          {jobs.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-[var(--warm-500)]">
                현재 active 공고가 없습니다. 채용 시즌(주로 시즌 오프 직전)에 정기적으로 등록되며, 신규 공고 알림을
                설정하면 즉시 받아볼 수 있습니다.
              </p>
              <Link
                href="/jobs"
                className="inline-block mt-4 text-sm text-[var(--gold-600)] hover:text-[var(--gold-700)] underline"
              >
                전체 채용 공고 보기 →
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link
                    href={`/jobs/${j.id}`}
                    className="card p-4 block hover:border-[var(--gold-300)] transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Briefcase className="w-4 h-4 mt-0.5 shrink-0 text-[var(--gold-500)]" aria-hidden="true" />
                      <p className="text-sm font-medium text-[var(--color-charcoal)] line-clamp-2">
                        {j.title ?? "(제목 없음)"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs text-[var(--warm-500)]">
                      {j.category && <span>{j.category}</span>}
                      {j.employment_type && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{j.employment_type}</span>
                        </>
                      )}
                      {j.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{j.location}</span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Sibling stores */}
        {siblings.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-charcoal)] mb-4">
              다른 {store.category} 채용
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={`/guide/store/${s.slug}`} className="card p-4 block hover:border-[var(--gold-300)]">
                    <p className="font-medium text-sm text-[var(--color-charcoal)]">{s.nameKo}</p>
                    <p className="text-xs text-[var(--warm-500)] mt-1">{s.region}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="card-lg p-6 text-center bg-gradient-to-br from-[var(--gold-50)] to-white">
          <p className="text-base font-medium text-[var(--color-charcoal)] mb-2">
            {store.nameShort} 채용 공고를 빠르게 받아보세요
          </p>
          <p className="text-sm text-[var(--warm-500)] mb-4">회원가입 시 매장·브랜드 단위 알림을 설정할 수 있습니다.</p>
          <Link href="/register?type=applicant" className="btn-gold inline-block px-6 py-2.5 text-sm">
            무료 회원가입
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
