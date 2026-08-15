/**
 * English content — AI 초안 (대표님 검수 대기).
 *
 * 원본: src/lib/content/ko.ts
 * 회사 이름·주소·연락처·사업자번호 등 고유 데이터는 그대로 유지.
 * 나머지 카피는 영문 초안이며, 통번역 회사이므로 대표님(Sunhee Yim) 검수 후 확정합니다.
 */

import type { SiteContent } from "./types";

export const en: SiteContent = {
  company: {
    name: "Beehive Corp",
    nameEn: "Beehive Corp",
    tagline: "No one achieves anything alone.",
    serviceLine: "On-site · Field Trip · Project · Interpretation · Translation · Training",
    heroSub:
      "Interpretation & translation, international conference planning, online and on-site event coordination, documentation and audio-visual technical support, and English education & training — select the service you need and complete your quote request in minutes.",
    philosophy:
      "No one achieves anything alone. Like the synchronized movement of bees shaping a hive, Beehive Corp designs communication across different languages, time\u00a0zones, and interests toward a shared goal.",
    address: "#629, 17, Gukjegeumyung-ro 2-gil, Yeongdeungpo-gu, Seoul (07327), Republic of Korea",
    tel: "+82-10-6854-2019",
    email: "service@beehivecorp.co.kr",
    businessNumber: "430-86-03070",
    businessAreas:
      "Database and online information services, translation and interpretation services, international conference planning and management, foreign language education, travel services",
    since: 2016,
  },

  ui: {
    navAbout: "About",
    navServices: "Services",
    navNews: "News",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    menuLanguage: "Language",
    ctaQuote: "Request a Quote",
    ctaExplore: "Explore Services",
    ctaCompanyProfile: "Download Company Profile",
    ctaAndroidApp: "Download Android App",
    heroHeadline: ["Beyond language and cultural boundaries,", "we drive communication and execution."],
    sectionClients: "Key Clients",
    sectionClientsSub: "100+ cumulative clients · 800+ projects delivered",
    sectionServices: "The deeper we think, the further our clients go.",
    sectionServicesSub:
      "Just fill out the simple form, a quote request takes 1-2 minutes.",
    sectionScope: "Work Scope",
    sectionScopeEn: "Work Scope",
    sectionHow: "How We Work",
    sectionHowEn: "How We Do",
    sectionCases: "Project Highlights",
    sectionCasesEn: "Project Highlights",
    sectionCasesSub: "The scope and approach of projects we have actually delivered.",
    sectionAbout: "About the CEO",
    sectionMilestones: "Our History",
    sectionMilestonesEn: "When We Started",
    sectionNews: "Notices & News",
    sectionNewsSub:
      "New updates from Beehive Corp and stories from projects.",
    sectionSocial: "Get onboard our communication.",
    sectionTestimonials: "Client Reviews",
    sectionTestimonialsSub:
      "Stories from the partners we've worked with.",
    testimonialsFormCta: "Leave a Review",
    finalCtaTitle: "Preparing a project?",
    finalCtaSub:
      "Answer a brief questionnaire, we'll send you a quote within 1–2 business days.",
    cardCta: "Request a Quote →",
    privacyLink: "Privacy Policy",
    ceoLabel: "CEO",
    businessNumberLabel: "Business Registration No.",
    businessAreasLabel: "Business Areas",
    labelFeaturedCase: "Case Study",
    labelScope: "Scope",
    labelAlsoMobile: "Working with us regularly? The app is easier.",
    labelAlsoMobileSub: "Request a quote straight from your home screen.",
    labelNoticesSub: "Notices",
    labelUpdatesSub: "News",
    labelVisitLink: "Visit →",
  },

  highlights: [
    { value: "10 yrs", label: "in interpretation & translation", note: "2016~" },
    { value: "800+", label: "projects delivered" },
    { value: "100+", label: "cumulative clients" },
    { value: "6 yrs", label: "Secretariat of the Cosmetic Policy Division in the Ministry of Food and Drug Safety", note: "2021~present" },
  ],

  achievements: [
    "6 consecutive years as Secretariat of ICCR (International Cooperation on Cosmetics Regulation) for MFDS (2021~present)",
    "37+ dedicated webinars interpreted for MFDS & Korea Cosmetic Association",
    "5 consecutive years of simultaneous interpretation at Galleries Art Fair opening (2022~2026)",
    "Text and catalog translation for Groundseesaw exhibitions",
    "Simultaneous interpretation for Interbrand internal meetings, interviews, and events",
  ],

  representative: {
    name: "Sunhee Yim",
    nameEn: "Sunhee Yim",
    title: "CEO",
    intro:
      "Ten years of interpretation across state protocol, live broadcast simultaneous interpretation, and global brand production sets — situations where scripts run out. From secretariat operations for government agencies to global campaign shoots, we design both the language and the process.",
    career: [
      "B.A. in German Language & Literature / Economics, Sungkyunkwan University",
      "M.A. in Korean-English Interpretation, Seoul University of Foreign Studies",
      "International Conference Specialist Program, Ewha Womans University",
      "Representative of Korea Office, Registrar Corp (US FDA compliance) — 2023-2025",
    ],
  },

  milestones: [
    {
      year: "2016",
      title: "Embarking on interpretation & translation projects",
      desc: "KOTRA export consultations, MBC broadcast interpretation, official interpreter at Busan International Film Festival, in-house translator for HiDis Technology Legal Team",
    },
    {
      year: "2019",
      title: "Founded 'Beehive' as a private company",
      desc: "Apple–LG U+ · MAC · Tiffany · Chopard global campaigns, Korean Air accessibility audit interpretation",
    },
    {
      year: "2021",
      title: "International Secretariat of ICCR",
      desc: "Ministry of Food and Drug Safety · Korea Cosmetic Association — 6 consecutive years to date",
    },
    {
      year: "2023–2025",
      title: "Representative of Korea Office, Registrar Corp (US FDA compliance provider)",
      desc: "US FDA compliance consulting for Korean market, advising Korean food/pharma/cosmetics companies on US market entry",
    },
    {
      year: "2024",
      title: "Expanded into a legal entity 'Beehive Corp'",
      desc: "Interpretation for the Spanish Minister of Education delegation, Export-Import Bank of Korea ODA projects, international exhibition catalog translation",
    },
  ],

  workScope: [
    {
      title: "Government · Public Sector",
      desc: "From interpretation and translation to international conferences and secretariat operations, including bids · contracts · administrative paperwork — a project partner that stays steady even when your point of contact changes.",
    },
    {
      title: "Broadcast · Event Interpretation",
      desc: "Broadcast · film · events · commercials · interviews — flexible on-site interpretation and live translation that keeps things moving even when the script runs out.",
    },
    {
      title: "Delegation Escort · Business Travel Services",
      desc: "From planning to protocol · transportation · reporting — reliable escort services for state protocol and international business trips.",
    },
    {
      title: "Translation · Publishing",
      desc: "Exhibition texts · catalogs · film subtitles · articles · books — beginning with accurate intent and a clear timeline, refined through client feedback and expert review.",
    },
    {
      title: "Industry · Technical Interpretation",
      desc: "ISO · GMP inspection audits, technical exchanges, international R&D · business consortiums, business meetings, exclusive meetings, and procurements — professional-grade interpretation and network.",
    },
    {
      title: "Training",
      desc: "Beehive Corp helps overcome language barriers in English presentations, meetings, and moderated discussions through training and lectures, ensuring that content is communicated clearly and understood effectively.",
    },
  ],

  principles: [
    {
      title: "Track record verifies us",
      desc: "Repeated government contracts and high renewal rates back our confidence in accurate, efficient planning and execution.",
    },
    {
      title: "Administration handled",
      desc: "We handle out-of-scope procedures at the corporate level so they don't slow down or degrade the project.",
    },
    {
      title: "Completed on-site",
      desc: "State protocol, live broadcast, global brand shoots, interviews — responding to what's beyond the script is the real skill.",
    },
  ],

  process: [
    "Request a Quote",
    "Consultation · Contract · NDA",
    "Pre-briefing",
    "Delivery",
    "Reporting",
    "Settlement · Tax Invoice",
  ],

  socials: [
    {
      name: "Instagram",
      url: "https://www.instagram.com/beehivecorp2024/",
      desc: "For hiring, partnership, and collaboration updates — follow us.",
    },
    {
      name: "Naver Blog",
      url: "https://blog.naver.com/beehivecorp",
      desc: "Read on-site stories and project highlights from our clients.",
    },
    // 카카오톡 채널 제거 — 사유는 ko.ts 의 같은 위치 주석 참고.
  ],

  caseStudies: [
    {
      title: "ICCR (International Cooperation on Cosmetics Regulation) Secretariat",
      client: "Ministry of Food and Drug Safety · Korea Cosmetic Association",
      period: "2021 ~ present (6 consecutive years)",
      photo: "/photos/public-project.jpg",
      points: [
        "16th cycle Secretariat & Co-chair — full operation of the government-international body coordination",
        "Quarterly, annual, and Working Group meetings with 2-channel EN-KR simultaneous interpretation, minutes drafting and translation",
        "Regulatory clauses, technical documents, safety assessments, SCCS opinions — specialized regulatory translation",
        "37+ seminars and webinars interpreted (2022~2026)",
      ],
    },
    {
      title: "Simultaneous Interpretation on Global Campaign Shoots",
      client: "MAC · Chopard",
      period: "2020 ~ 2021",
      photo: "/photos/interpretation.jpg",
      points: [
        "First on-set Zoom live simultaneous interpretation in Korea",
        "Full-shoot live interpretation between overseas advertisers/art directors and Korean production teams",
        "MAC APAC campaign — planning meetings, pre-lighting, and main shoots across three phases",
        "Chopard 'Happy Project' shoot and post-editing meeting interpretation",
      ],
    },
    {
      title: "Groundseesaw Exhibition Text & Catalog Translation",
      client: "Groundseesaw",
      period: "2020 ~ 2025",
      photo: "/photos/translation.jpg",
      points: [
        "'Moomin 75th' exhibition video subtitles and text translation",
        "'Monet Inside' catalog translation (KR→EN)",
        "'Accidentally Wes Anderson 2' exhibition text · catalog translation (EN→KR)",
        "'Jonathan Bertin' exhibition text · catalog translation (KR↔EN)",
      ],
    },
    {
      title: "Long-term Translation: Documentary 'Oksun-Log'",
      client: "EIDF · Jeonju IFF",
      period: "2021 ~ 2023",
      photo: "/photos/oksun-log.jpg",
      photoFit: "contain",
      points: [
        "A two-year translation partnership from production through international festival submission",
        "EIDF pre-production mentoring session interpretation, trailer subtitle translation",
        "Narration scripts · pitching materials · catalog translation",
        "Best Documentary Award at EIDF (Seoul Business Agency) · 2023 Jeonju IFF selection",
      ],
    },
  ],

  /*
   * Placeholder testimonials — replace with real reviews when collected.
   */
  testimonials: [
    {
      name: "Kim",
      title: "Secretary-General",
      affiliation: "Government Agency A",
      review:
        "From session operations to minutes translation, everything flowed smoothly. Handovers used to be a burden with the frequent staff rotations — thanks to the Beehive team, the process itself became stable.",
    },
    {
      name: "Lee",
      title: "Producer",
      affiliation: "Global Brand Campaign",
      review:
        "Shoots always have off-script moments, but the interpretation never broke the rhythm — it actually created it. Coordinating tempo between the overseas art director and Korean crew was decisive.",
    },
    {
      name: "Park",
      title: "Curator",
      affiliation: "Museum & Exhibition Planning",
      review:
        "The catalog translation wasn't just accurate — the artist's tone came through intact. With pre-research and expert review integrated, we hit the opening date without issue.",
    },
    {
      name: "Jung",
      title: "Team Lead",
      affiliation: "Pharmaceutical / Bio",
      review:
        "GMP audit interpretation is where a single term can change the outcome. From pre-briefing to close-out, they carried it without hesitation. We're planning the next audit together.",
    },
    {
      name: "Choi",
      title: "CEO",
      affiliation: "Startup IR",
      review:
        "Translation of IR materials for overseas investors and presentation coaching — every phrase felt natural without losing our voice. It gave us confidence in the meeting room.",
    },
  ],

  serviceCards: [
    {
      id: "A",
      title: "Escort · Delegation",
      headline: "Private escort services - No more relying on personal network.",
      body: "From planning to protocol · transportation · reporting — reliable escort service for state protocol and international business trips.",
      scope:
        "Vietnam, Slovenia, Germany, Italy, the United States, Taiwan, Brazil, Japan, Canada, Qatar, India, and more",
    },
    {
      id: "B",
      title: "Projects",
      headline: "Even when personnel change, the project must move forward.",
      body: "For government and public agencies — interpretation, translation, international conferences, and secretariat operations, including bids · contracts · administrative paperwork. A project partner that stays steady through staff transitions.",
      scope:
        "International conference secretariat operations, international joint R&D projects, in-house legal team establishment, webinars, seminars, long-term training programs, ODA projects, architectural tenders, and more",
      cases: [
        {
          title: "ICCR (International Cooperation on Cosmetics Regulation) Secretariat",
          meta: "MFDS · Korea Cosmetic Association · 2021~present (6 yrs)",
        },
      ],
    },
    {
      id: "C",
      title: "Broadcast · Event · Technical Interpretation",
      headline: "Because the field is unscripted.",
      body: "Broadcast · film · events · commercials · interviews — flexible on-site interpretation for off-script situations. Plus specialized fields: ISO · GMP audits, technical exchanges, international consortiums, business, corporate internal meetings, and bids.",
      scope:
        "International events, on-set productions, interviews, broadcasts, commercials, seminars, lectures, corporate and public events, emceeing, audits, inspections, bilateral meetings, government meetings, business meetings, academic conferences, panel discussions, video conferences, working-group meetings, and more",
      cases: [
        {
          title: "Simultaneous Interpretation on Global Campaign Shoots",
          meta: "MAC · Chopard · 2020~2021",
        },
      ],
    },
    {
      id: "D",
      title: "Media · Publishing Translation",
      headline: "Excellence never compromises, even on the tight deadlines.",
      body: "Exhibition texts · catalogs · film subtitles · articles · books — beginning with accurate intent and a clear timeline, refined through client feedback and expert review.",
      scope:
        "Regulations, legal opinions, articles of incorporation, contracts, exhibition materials, exhibition catalogues, PowerPoint presentations, film and video subtitles, scripts, books, brochures, websites, product labels, catalogues, manuals, technical documents, academic papers, certified and notarized translations, and more",
      cases: [
        {
          title: "Groundseesaw Exhibition Text · Catalog Translation",
          meta: "Groundseesaw · 2020~2025",
        },
        {
          title: "Long-term Translation: Documentary 'Oksun-Log'",
          meta: "EIDF · Jeonju IFF · 2021~2023",
        },
      ],
    },
    {
      id: "E",
      title: "Training",
      headline: "English should empower communication, not become a barrier.",
      body: "Including English education, Beehive Corporation supports the efficient delivery and learning of various training programs.",
      scope:
        "Presentation coaching, scriptwriting, voice guides, speaker training, business email writing, conversational English, online English conversation with native speakers, and more",
    },
    {
      id: "F",
      title: "Other Projects",
      headline: "Preparing a project?",
      body: "Where the process stalls, Beehive Corp steps in and keeps it moving. Reach out — we'll reply with a quote within 1–2 business days.",
      scope:
        "Compliance Consulting, business mediation, pitching, bidding, negotiations, contracting, speaker recruitment, international conference planning, invitations, transportation, protocol services, receptions, and more",
    },
  ],
};
