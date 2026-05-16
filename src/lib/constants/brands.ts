/**
 * 럭셔리 브랜드 허브 페이지 마스터 로스터
 *
 * SEO 타겟: "샤넬 채용", "루이비통 연봉", "에르메스 PM" 등
 * 슬러그(영문 kebab-case) → 브랜드 메타 매핑
 *
 * Design ref: /brands/[slug] 라우트
 */

export interface BrandDefinition {
  /** URL slug (영문 kebab-case) */
  slug: string;
  /** 표기용 영문명 */
  nameEn: string;
  /** 표기용 한글명 */
  nameKo: string;
  /** DB `companies.company_name`에서 매칭될 수 있는 표기 변형 (한글/영문) */
  dbNames: string[];
  /** 소속 그룹 (BRAND_GROUP_INCENTIVES와 매칭) */
  group: string;
  /** 연봉 매트릭스 카테고리 (LUXURY_MARKET_VALUE 키) */
  category: "luxury" | "jewelry" | "fashion" | "cosmetics";
  /** 그룹 내 서브 세그먼트 */
  segment: string;
  /** 기본 소개 (DB description 없을 때 fallback) */
  descriptionFallback: string;
  /** 주요 SEO 키워드 (description에 노출) */
  keywords: string[];
  /** 메인 도메인 (로고 fallback URL 생성용) */
  domain?: string;
}

export const BRAND_DEFINITIONS: BrandDefinition[] = [
  {
    slug: "chanel",
    nameEn: "Chanel",
    nameKo: "샤넬",
    dbNames: ["샤넬코리아", "Chanel", "샤넬"],
    group: "Chanel",
    category: "luxury",
    segment: "패션 · 뷰티 · 워치",
    descriptionFallback:
      "1910년 파리에서 탄생한 프랑스 럭셔리 메종. 패션, 뷰티, 시계, 주얼리 전 영역에서 독립 경영을 유지하며 업계 최고 수준의 처우와 자부심으로 유명합니다.",
    keywords: ["샤넬 채용", "샤넬 연봉", "샤넬 코리아 취업", "Chanel Korea"],
    domain: "chanel.com",
  },
  {
    slug: "louis-vuitton",
    nameEn: "Louis Vuitton",
    nameKo: "루이비통",
    dbNames: ["루이비통코리아", "Louis Vuitton", "루이비통"],
    group: "LVMH",
    category: "luxury",
    segment: "패션 · 가죽 · 트렁크",
    descriptionFallback:
      "1854년 창립된 세계 1위 럭셔리 하우스. LVMH 그룹 플래그십으로 체계적 교육 시스템과 글로벌 로테이션 기회가 강점입니다.",
    keywords: ["루이비통 채용", "루이비통 연봉", "LV 코리아 취업", "LVMH 채용"],
    domain: "louisvuitton.com",
  },
  {
    slug: "hermes",
    nameEn: "Hermès",
    nameKo: "에르메스",
    dbNames: ["에르메스코리아", "Hermès", "Hermes", "에르메스"],
    group: "Hermès",
    category: "luxury",
    segment: "가죽 · 실크 · 홈",
    descriptionFallback:
      "1837년 파리에서 출발한 독립 메종. 장인정신과 희소성 중심의 조용한 럭셔리를 추구하며, 업계 최상위 처우와 긴 근속 기간으로 유명합니다.",
    keywords: ["에르메스 채용", "에르메스 연봉", "Hermes Korea", "버킨백 장인"],
    domain: "hermes.com",
  },
  {
    slug: "gucci",
    nameEn: "Gucci",
    nameKo: "구찌",
    dbNames: ["구찌코리아", "Gucci", "구찌"],
    group: "Kering",
    category: "luxury",
    segment: "패션 · 액세서리",
    descriptionFallback:
      "1921년 이탈리아 피렌체에서 시작된 Kering 그룹의 핵심 브랜드. 수평적 문화와 창의성 존중, 높은 기본급과 반기별 성과급으로 알려져 있습니다.",
    keywords: ["구찌 채용", "구찌 연봉", "구찌 코리아", "Kering 채용"],
    domain: "gucci.com",
  },
  {
    slug: "dior",
    nameEn: "Dior",
    nameKo: "디올",
    dbNames: ["크리스챤디올꾸뛰르코리아", "크리스찬디올", "Dior", "Christian Dior", "디올"],
    group: "LVMH",
    category: "luxury",
    segment: "패션 · 뷰티 · 주얼리",
    descriptionFallback:
      "1947년 파리에서 창립된 LVMH 그룹 브랜드. 쿠튀르에서 시작해 패션, 뷰티, 주얼리까지 확장했으며 트레이닝 프로그램과 글로벌 이동이 활발합니다.",
    keywords: ["디올 채용", "디올 연봉", "Dior 코리아", "크리스찬디올 취업"],
    domain: "dior.com",
  },
  {
    slug: "prada",
    nameEn: "Prada",
    nameKo: "프라다",
    dbNames: ["프라다코리아", "Prada", "프라다"],
    group: "Prada Group",
    category: "luxury",
    segment: "패션 · 가죽",
    descriptionFallback:
      "1913년 밀라노에서 시작된 이탈리아 럭셔리 하우스. 미우미우와 교환 근무 기회가 있으며, 직원 할인과 이탈리안 감각의 오피스 문화가 특징입니다.",
    keywords: ["프라다 채용", "프라다 연봉", "Prada Korea", "미우미우 채용"],
    domain: "prada.com",
  },
  {
    slug: "burberry",
    nameEn: "Burberry",
    nameKo: "버버리",
    dbNames: ["버버리코리아", "Burberry", "버버리"],
    group: "Burberry",
    category: "luxury",
    segment: "트렌치 · 패션",
    descriptionFallback:
      "1856년 영국에서 창립된 대표적 브리티시 럭셔리 브랜드. 상장사로 체계적인 인사 시스템과 글로벌 순환 근무가 가능하며, WLB가 상대적으로 좋은 편입니다.",
    keywords: ["버버리 채용", "버버리 연봉", "Burberry Korea", "트렌치코트 브랜드"],
    domain: "burberry.com",
  },
  {
    slug: "bvlgari",
    nameEn: "Bvlgari",
    nameKo: "불가리",
    dbNames: ["불가리코리아", "Bvlgari", "Bulgari", "불가리"],
    group: "LVMH",
    category: "jewelry",
    segment: "주얼리 · 워치 · 액세서리",
    descriptionFallback:
      "1884년 로마에서 탄생한 하이 주얼리 메종. LVMH 소속으로 주얼리 특화 트레이닝과 이탈리아 본사 연수 기회가 제공됩니다.",
    keywords: ["불가리 채용", "불가리 연봉", "Bvlgari Korea", "주얼리 브랜드"],
    domain: "bulgari.com",
  },
  {
    slug: "cartier",
    nameEn: "Cartier",
    nameKo: "까르띠에",
    dbNames: ["까르띠에코리아", "Cartier", "까르띠에"],
    group: "Richemont",
    category: "jewelry",
    segment: "주얼리 · 워치",
    descriptionFallback:
      "1847년 파리에서 시작된 'The Jeweller of Kings'. Richemont 그룹 소속으로 글로벌 통일 테이블의 상위권 급여와 연 1회 개인 KPI 기반 성과급이 특징입니다.",
    keywords: ["까르띠에 채용", "까르띠에 연봉", "Cartier 코리아", "Richemont 채용"],
    domain: "cartier.com",
  },
  {
    slug: "tiffany",
    nameEn: "Tiffany & Co.",
    nameKo: "티파니",
    dbNames: ["티파니코리아", "Tiffany", "Tiffany & Co", "Tiffany & Co.", "티파니"],
    group: "LVMH",
    category: "jewelry",
    segment: "주얼리 · 실버",
    descriptionFallback:
      "1837년 뉴욕에서 창립된 아메리칸 럭셔리 주얼러. LVMH 인수 이후 본격적인 투자가 이뤄지며 직무 다양성과 글로벌 기회가 확대되고 있습니다.",
    keywords: ["티파니 채용", "티파니 연봉", "Tiffany Korea", "티파니앤코"],
    domain: "tiffany.com",
  },
  {
    slug: "rolex",
    nameEn: "Rolex",
    nameKo: "롤렉스",
    dbNames: ["롤렉스코리아", "Rolex", "롤렉스"],
    group: "Rolex",
    category: "jewelry",
    segment: "워치",
    descriptionFallback:
      "1905년 창립된 스위스 워치 메이커. 비상장 독립 기업으로 안정적인 처우, 긴 근속, 높은 브랜드 자부심이 특징입니다. 신규 채용은 상대적으로 드뭅니다.",
    keywords: ["롤렉스 채용", "롤렉스 연봉", "Rolex Korea", "스위스 워치"],
    domain: "rolex.com",
  },
  {
    slug: "yves-saint-laurent",
    nameEn: "Saint Laurent",
    nameKo: "생로랑",
    dbNames: ["입생로랑코리아", "생로랑", "Saint Laurent", "YSL", "Yves Saint Laurent"],
    group: "Kering",
    category: "luxury",
    segment: "패션 · 레더굿즈",
    descriptionFallback:
      "1961년 파리에서 출발한 Kering 그룹의 핵심 패션 브랜드. 에디 슬리먼과 앤토니 바카렐로를 거치며 현대적 럭셔리의 대표로 자리잡았습니다.",
    keywords: ["생로랑 채용", "YSL 연봉", "입생로랑 코리아", "Saint Laurent Korea"],
    domain: "ysl.com",
  },
  {
    slug: "celine",
    nameEn: "Celine",
    nameKo: "셀린느",
    dbNames: ["셀린느코리아", "셀린코리아", "Celine", "Céline", "셀린느"],
    group: "LVMH",
    category: "luxury",
    segment: "패션 · 레더굿즈",
    descriptionFallback:
      "1945년 파리에서 창립된 LVMH 브랜드. 미니멀하면서 파리지엔 시크의 정수로 평가받으며, 국내에서는 MZ 세대 중심으로 빠르게 성장 중입니다.",
    keywords: ["셀린느 채용", "셀린느 연봉", "Celine Korea", "셀린 취업"],
    domain: "celine.com",
  },
  {
    slug: "fendi",
    nameEn: "Fendi",
    nameKo: "펜디",
    dbNames: ["펜디코리아", "Fendi", "펜디"],
    group: "LVMH",
    category: "luxury",
    segment: "패션 · 퍼 · 레더굿즈",
    descriptionFallback:
      "1925년 로마에서 창립된 LVMH 브랜드. 이탈리안 장인정신과 퍼/레더 전문성으로 유명하며 이탈리아 본사 연수 기회가 있습니다.",
    keywords: ["펜디 채용", "펜디 연봉", "Fendi Korea", "펜디 코리아 취업"],
    domain: "fendi.com",
  },
  {
    slug: "bottega-veneta",
    nameEn: "Bottega Veneta",
    nameKo: "보테가베네타",
    dbNames: ["보테가베네타코리아", "Bottega Veneta", "보테가베네타", "보테가"],
    group: "Kering",
    category: "luxury",
    segment: "레더굿즈 · 패션",
    descriptionFallback:
      "1966년 이탈리아 비첸차에서 창립된 Kering 브랜드. 인트레치아토 가죽 기법으로 대표되며 로고 없는 '조용한 럭셔리' 트렌드의 선두주자입니다.",
    keywords: ["보테가베네타 채용", "보테가 연봉", "Bottega Veneta Korea"],
    domain: "bottegaveneta.com",
  },
  {
    slug: "balenciaga",
    nameEn: "Balenciaga",
    nameKo: "발렌시아가",
    dbNames: ["발렌시아가코리아", "Balenciaga", "발렌시아가"],
    group: "Kering",
    category: "luxury",
    segment: "패션 · 스니커즈",
    descriptionFallback:
      "1917년 창립된 Kering 그룹 브랜드. 데므나의 파격적 크리에이티브 디렉션으로 스트릿과 하이패션 경계를 허문 현대적 럭셔리의 아이콘입니다.",
    keywords: ["발렌시아가 채용", "발렌시아가 연봉", "Balenciaga Korea"],
    domain: "balenciaga.com",
  },
  {
    slug: "loewe",
    nameEn: "Loewe",
    nameKo: "로에베",
    dbNames: ["로에베코리아", "Loewe", "로에베"],
    group: "LVMH",
    category: "luxury",
    segment: "레더굿즈 · 패션",
    descriptionFallback:
      "1846년 스페인 마드리드에서 창립된 LVMH 브랜드. 조나단 앤더슨의 크리에이티브 디렉션으로 크래프트와 컨템포러리가 결합된 브랜드로 재탄생했습니다.",
    keywords: ["로에베 채용", "로에베 연봉", "Loewe Korea", "로에베 취업"],
    domain: "loewe.com",
  },
  {
    slug: "valentino",
    nameEn: "Valentino",
    nameKo: "발렌티노",
    dbNames: ["발렌티노코리아", "Valentino", "발렌티노"],
    group: "Valentino",
    category: "luxury",
    segment: "패션 · 레더굿즈",
    descriptionFallback:
      "1960년 로마에서 창립된 이탈리안 럭셔리 메종. 시그니처 '발렌티노 레드'와 오뜨 쿠튀르의 우아함으로 유명하며 독립 운영 구조를 유지합니다.",
    keywords: ["발렌티노 채용", "발렌티노 연봉", "Valentino Korea"],
    domain: "valentino.com",
  },
  {
    slug: "van-cleef-arpels",
    nameEn: "Van Cleef & Arpels",
    nameKo: "반클리프앤아펠",
    dbNames: ["반클리프앤아펠코리아", "Van Cleef & Arpels", "반클리프"],
    group: "Richemont",
    category: "jewelry",
    segment: "하이 주얼리",
    descriptionFallback:
      "1906년 파리에서 창립된 하이 주얼리 메종. Richemont 소속으로 알함브라 컬렉션으로 대중에게도 친숙하며, 장인 교육과 파리 본사 연수가 특징입니다.",
    keywords: ["반클리프 채용", "반클리프앤아펠 연봉", "Van Cleef Korea"],
    domain: "vancleefarpels.com",
  },
  {
    slug: "moncler",
    nameEn: "Moncler",
    nameKo: "몽클레르",
    dbNames: ["몽클레르코리아", "몽클레어코리아", "Moncler", "몽클레르", "몽클레어"],
    group: "Moncler",
    category: "luxury",
    segment: "아우터 · 패션",
    descriptionFallback:
      "1952년 프랑스에서 시작해 현재는 이탈리아에 본사를 둔 프리미엄 아우터 브랜드. 겐조, 쟈넨볼루토와의 콜라보로 컨템포러리 럭셔리 포지셔닝을 구축했습니다.",
    keywords: ["몽클레르 채용", "몽클레르 연봉", "Moncler Korea", "몽클레어"],
    domain: "moncler.com",
  },
];

/** slug로 브랜드 정의 조회 */
export function getBrandDefinition(slug: string): BrandDefinition | null {
  return BRAND_DEFINITIONS.find((b) => b.slug === slug) ?? null;
}

/** 같은 그룹의 다른 브랜드들 */
export function getSiblingBrands(slug: string, limit = 4): BrandDefinition[] {
  const current = getBrandDefinition(slug);
  if (!current) return [];
  return BRAND_DEFINITIONS.filter(
    (b) => b.slug !== slug && (b.group === current.group || b.category === current.category)
  ).slice(0, limit);
}
