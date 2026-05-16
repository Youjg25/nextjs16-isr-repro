/**
 * Store hub data — 백화점 / 면세점 / 프리미엄아울렛 매장 단위 SEO 허브.
 *
 * 목적:
 * - GSC 에 발생 중인 longtail 검색어 (예: "현대프리미엄아울렛 김포 셀린느", "갤러리아 명품관 채용") 흡수.
 * - 매장 단위 채용 정보 / 입점 럭셔리 브랜드 / 면접 인사이트를 단일 페이지에 묶어 사용자 의도 매칭.
 *
 * 데이터 derive 전략:
 * - 매장 메타데이터 (위치, 분류, 입점 브랜드 highlight) 는 정적 정의.
 * - 실제 active 채용 공고는 detail 페이지에서 supabase 동적 query (matchPatterns ilike).
 * - 입점 브랜드 highlight 는 BRAND_DEFINITIONS slug 와 매핑 — 기존 brand-inside / interview / salary 페이지로 internal link.
 */

export interface StoreDefinition {
  /** URL slug — kebab-case */
  slug: string;
  /** 정식 표시명 (검색 키워드 포함) */
  nameKo: string;
  /** 짧은 표시용 (breadcrumb 등) */
  nameShort: string;
  /** 모회사 / 체인 (예: "갤러리아백화점") */
  mall: string;
  /** 분점 (예: "명품관 (압구정)") */
  branch: string;
  /** 분류 */
  category: "백화점" | "면세점" | "프리미엄아울렛";
  /** 시·군·구 단위 행정구역 */
  region: string;
  /** 정확한 주소 */
  address: string;
  /** SEO meta description (~140자) */
  description: string;
  /** highlight 입점 브랜드 — BRAND_DEFINITIONS slug 와 매칭. 화면 grid + internal link 용 */
  highlightBrands: string[];
  /**
   * jobs.description / jobs.title ilike 매칭 패턴 — detail 페이지에서 active 공고 derive.
   * "갤러리아", "현대프리미엄아울렛 김포" 처럼 OR 매칭으로 흩어진 표기 흡수.
   */
  matchPatterns: string[];
  /** SEO 명시 키워드 — meta keywords + 본문 내 strategic placement */
  longtailKeywords: string[];
  /** 대중교통 안내 한 줄 (선택) */
  publicTransport?: string;
  /** 매장 특성 한 줄 — hero subtitle 용 */
  positioning: string;
}

/**
 * MVP 3개 매장. 각 매장은 GSC 검색 발생 또는 jobs description 매칭 ≥ 5건 검증된 핫스팟.
 */
export const STORE_DEFINITIONS: StoreDefinition[] = [
  {
    slug: "galleria-apgujeong",
    nameKo: "갤러리아백화점 명품관 (압구정)",
    nameShort: "갤러리아 명품관",
    mall: "갤러리아백화점",
    branch: "명품관 (압구정)",
    category: "백화점",
    region: "서울 강남구",
    address: "서울특별시 강남구 압구정로 343",
    description:
      "갤러리아백화점 명품관 입점 럭셔리 브랜드 채용 정보. 샤넬, 에르메스, 루이비통, 디올 등 명품관 BA·SA 채용 공고와 면접 인사이트를 한 곳에서 확인하세요.",
    highlightBrands: [
      "chanel",
      "hermes",
      "louis-vuitton",
      "dior",
      "gucci",
      "prada",
      "cartier",
      "van-cleef-arpels",
      "rolex",
      "celine",
    ],
    matchPatterns: ["갤러리아", "압구정"],
    longtailKeywords: [
      "갤러리아 명품관 채용",
      "갤러리아 명품관 BA 채용",
      "갤러리아 압구정 채용",
      "갤러리아 명품관 SA",
      "갤러리아 명품관 면접",
      "갤러리아 명품관 연봉",
      "압구정 명품 매장 채용",
    ],
    publicTransport: "지하철 3호선·수인분당선 압구정로데오역 1번 출구 도보 5분",
    positioning: "국내 럭셔리 백화점의 상징, 명품관 전 브랜드 입점",
  },
  {
    slug: "shinsegae-gangnam",
    nameKo: "신세계백화점 강남점",
    nameShort: "신세계 강남",
    mall: "신세계백화점",
    branch: "강남점",
    category: "백화점",
    region: "서울 서초구",
    address: "서울특별시 서초구 신반포로 176",
    description:
      "신세계백화점 강남점 입점 럭셔리·뷰티 브랜드 채용 정보. 매출 1위 백화점의 BA·SA·뷰티 어드바이저 채용 공고와 면접 가이드를 정리했습니다.",
    highlightBrands: [
      "chanel",
      "hermes",
      "louis-vuitton",
      "dior",
      "gucci",
      "prada",
      "cartier",
      "rolex",
      "burberry",
      "celine",
    ],
    matchPatterns: ["신세계백화점 강남", "신세계 강남"],
    longtailKeywords: [
      "신세계백화점 강남 채용",
      "신세계 강남 BA 채용",
      "신세계 강남점 SA",
      "신세계 강남 명품 채용",
      "신세계백화점 채용",
      "신세계 강남 면접",
      "센트럴시티 명품 채용",
    ],
    publicTransport: "지하철 3·7·9호선 고속터미널역 직결",
    positioning: "국내 단일 백화점 매출 1위, 명품·뷰티·라이프스타일 통합",
  },
  {
    slug: "hyundai-premium-outlet-gimpo",
    nameKo: "현대프리미엄아울렛 김포점",
    nameShort: "현대 김포 아울렛",
    mall: "현대프리미엄아울렛",
    branch: "김포점",
    category: "프리미엄아울렛",
    region: "경기 김포시",
    address: "경기도 김포시 고촌읍 아라육로152번길 100",
    description:
      "현대프리미엄아울렛 김포점 입점 럭셔리·컨템포러리 브랜드 채용 정보. 셀린느, 구찌, 프라다 등 매장 SA·매니저 채용 공고와 합격 가이드를 정리했습니다.",
    highlightBrands: ["celine", "gucci", "prada", "burberry"],
    matchPatterns: ["현대프리미엄아울렛 김포", "김포 아울렛", "현대 김포"],
    longtailKeywords: [
      "현대프리미엄아울렛 김포 셀린느",
      "현대프리미엄아울렛 김포 채용",
      "김포 아울렛 명품 채용",
      "현대 김포점 채용",
      "김포 명품 매장 채용",
      "현대프리미엄아울렛 김포 SA",
    ],
    publicTransport: "김포공항역에서 셔틀버스 또는 자차 (김포한강로 김포 IC 인근)",
    positioning: "수도권 서부 최대 규모 럭셔리 아울렛, 셀린느·구찌 등 핵심 브랜드 입점",
  },
  {
    slug: "lotte-myeongdong",
    nameKo: "롯데백화점 본점 (에비뉴엘)",
    nameShort: "롯데 본점",
    mall: "롯데백화점",
    branch: "본점·에비뉴엘 (소공동)",
    category: "백화점",
    region: "서울 중구",
    address: "서울특별시 중구 남대문로 81",
    description:
      "롯데백화점 본점·에비뉴엘 입점 럭셔리 브랜드 채용 정보. 명동 거점 한국 1세대 명품 백화점의 BA·SA·뷰티 어드바이저 채용 공고와 면접 인사이트를 한 곳에서 확인하세요.",
    highlightBrands: [
      "chanel",
      "louis-vuitton",
      "dior",
      "gucci",
      "prada",
      "cartier",
      "van-cleef-arpels",
      "rolex",
      "bvlgari",
      "bottega-veneta",
    ],
    matchPatterns: ["롯데백화점 본점", "롯데 본점", "에비뉴엘", "소공동"],
    longtailKeywords: [
      "롯데백화점 본점 채용",
      "롯데 본점 BA 채용",
      "에비뉴엘 채용",
      "에비뉴엘 SA",
      "롯데 본점 명품 채용",
      "롯데백화점 본점 면접",
      "소공동 명품 매장 채용",
      "명동 명품 백화점 채용",
    ],
    publicTransport: "지하철 2호선 을지로입구역 7·8번 출구 직결, 4호선 명동역 도보 5분",
    positioning: "한국 1세대 명품 백화점, 별관 에비뉴엘 = 명품관 본관 라인업 (에르메스 미입점, 잠실점 한정)",
  },
  {
    slug: "shinsegae-myeongdong",
    nameKo: "신세계백화점 본점 (명동)",
    nameShort: "신세계 본점",
    mall: "신세계백화점",
    branch: "본점 (명동)",
    category: "백화점",
    region: "서울 중구",
    address: "서울특별시 중구 소공로 63",
    description:
      "신세계백화점 본점 입점 럭셔리 브랜드 채용 정보. 1930년대 미츠코시 건물의 헤리티지 백화점 BA·SA·뷰티 어드바이저 채용 공고와 면접 가이드를 정리했습니다.",
    highlightBrands: [
      "chanel",
      "louis-vuitton",
      "hermes",
      "dior",
      "celine",
      "bottega-veneta",
      "fendi",
      "valentino",
      "yves-saint-laurent",
      "moncler",
    ],
    matchPatterns: ["신세계백화점 본점", "신세계 본점", "신세계 명동"],
    longtailKeywords: [
      "신세계백화점 본점 채용",
      "신세계 본점 BA 채용",
      "신세계 명동 SA",
      "신세계 본점 명품 채용",
      "신세계 본점 면접",
      "명동 백화점 채용",
      "신세계 본관 럭셔리 채용",
    ],
    publicTransport: "지하철 4호선 회현역 7번 출구 도보 1분, 2호선 을지로입구역 도보 7분",
    positioning: "신세계 1번지, 명동 헤리티지 백화점 — 에·루·샤 풀 라인업 + 더 헤리티지 럭셔리 맨션",
  },
  {
    slug: "the-hyundai-seoul",
    nameKo: "더현대 서울 (여의도)",
    nameShort: "더현대 서울",
    mall: "현대백화점",
    branch: "더현대 서울 (여의도)",
    category: "백화점",
    region: "서울 영등포구",
    address: "서울특별시 영등포구 여의대로 108",
    description:
      "더현대 서울 입점 럭셔리·컨템포러리 브랜드 채용 정보. 2021년 개점 MZ 럭셔리 핫스팟의 BA·SA 채용 공고와 면접 가이드를 한 곳에서 확인하세요.",
    highlightBrands: [
      "louis-vuitton",
      "dior",
      "bottega-veneta",
      "celine",
      "loewe",
      "valentino",
      "burberry",
      "tiffany",
      "bvlgari",
      "van-cleef-arpels",
    ],
    matchPatterns: ["더현대 서울", "더현대서울", "여의도 더현대"],
    longtailKeywords: [
      "더현대 서울 채용",
      "더현대 서울 BA 채용",
      "더현대 SA 채용",
      "더현대 럭셔리 채용",
      "여의도 더현대 면접",
      "더현대 명품 매장 채용",
      "여의도 백화점 채용",
      "MZ 명품 백화점 채용",
    ],
    publicTransport: "지하철 5·9호선 여의도역 3번 출구 도보 5분",
    positioning: "MZ 럭셔리 + 미디어아트, 2021년 개점 신생 핫스팟 (루이비통 2025 입점, 샤넬·에르메스 미입점)",
  },
  {
    slug: "hyundai-trade-center",
    nameKo: "현대백화점 무역센터점 (삼성동)",
    nameShort: "현대 무역센터",
    mall: "현대백화점",
    branch: "무역센터점 (삼성동)",
    category: "백화점",
    region: "서울 강남구",
    address: "서울특별시 강남구 테헤란로 517",
    description:
      "현대백화점 무역센터점 입점 럭셔리 브랜드 채용 정보. 강남 거점·COEX 직결 백화점의 BA·SA·뷰티 어드바이저 채용 공고와 면접 가이드를 정리했습니다.",
    highlightBrands: [
      "louis-vuitton",
      "hermes",
      "dior",
      "gucci",
      "prada",
      "cartier",
      "van-cleef-arpels",
      "rolex",
      "bottega-veneta",
      "fendi",
    ],
    matchPatterns: ["현대백화점 무역센터", "무역센터점", "현대 무역센터", "삼성동 현대"],
    longtailKeywords: [
      "현대백화점 무역센터 채용",
      "현대 무역센터점 BA 채용",
      "현대 무역센터 SA",
      "현대 무역센터 명품 채용",
      "삼성동 백화점 채용",
      "COEX 명품 채용",
      "강남 럭셔리 백화점 채용",
    ],
    publicTransport: "지하철 2호선 삼성역 6번 출구 도보 3분, 9호선 봉은사역 7번 출구",
    positioning: "강남 럭셔리 거점, COEX·트레이드타워 직결 동선 (샤넬 의류·가방 미입점, 뷰티만)",
  },
  {
    slug: "shinsegae-centum-city",
    nameKo: "신세계 센텀시티 (부산)",
    nameShort: "신세계 센텀",
    mall: "신세계백화점",
    branch: "센텀시티 (부산)",
    category: "백화점",
    region: "부산 해운대구",
    address: "부산광역시 해운대구 센텀남대로 35",
    description:
      "신세계 센텀시티 입점 럭셔리 브랜드 채용 정보. 세계 최대 백화점(기네스 등재) 부산·동남권 럭셔리 1번지의 BA·SA·뷰티 어드바이저 채용 공고와 면접 인사이트를 정리했습니다.",
    highlightBrands: [
      "chanel",
      "hermes",
      "dior",
      "cartier",
      "van-cleef-arpels",
      "rolex",
      "bvlgari",
      "tiffany",
      "celine",
      "bottega-veneta",
    ],
    matchPatterns: ["신세계 센텀", "센텀시티", "신세계백화점 센텀", "부산 신세계"],
    longtailKeywords: [
      "신세계 센텀시티 채용",
      "센텀시티 BA 채용",
      "신세계 센텀 SA",
      "신세계 센텀시티 명품 채용",
      "부산 명품 백화점 채용",
      "센텀시티 면접",
      "해운대 럭셔리 매장 채용",
      "부산 백화점 채용",
    ],
    publicTransport: "지하철 2호선 센텀시티역 직결, 동해선 신해운대역 도보 10분",
    positioning:
      "세계 최대 백화점 (기네스 등재), 부산·동남권 럭셔리 1번지 (루이비통 2020·구찌·프라다 2022 철수, 시계·주얼리 강세)",
  },
];

/** Slug → store lookup */
export function findStoreBySlug(slug: string): StoreDefinition | undefined {
  return STORE_DEFINITIONS.find((s) => s.slug === slug);
}
