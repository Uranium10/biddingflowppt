import { useCallback, useEffect, useState } from 'react'
import './presentation.css'
import { PositioningSlide, WhyErpnextSlide } from './TechDecisionSlides.jsx'

const SLIDE_WIDTH = 1600
const SLIDE_HEIGHT = 900
const SLIDE_COUNT = 13

const PROCESS_STEPS = [
  {
    number: '01',
    title: '신규 품목 등록',
    issues: [{ text: '규격 미비 재확인 반복', category: 'repeat' }],
  },
  {
    number: '02',
    title: '구매 요청서 확인',
    issues: [
      { text: '대체품(재고) 수기 비교·안내', category: 'repeat' },
      { text: '납기 검토·반려 기준 모호', category: 'decision' },
    ],
  },
  {
    number: '03',
    title: '공급사 탐색·견적 요청',
    issues: [
      { text: '견적 독촉 및 서류 수발신', category: 'repeat' },
      { text: '입찰·공급사 선정의 주관성', category: 'decision' },
    ],
  },
  {
    number: '04',
    title: '견적 비교·공급사 선정',
    issues: [{ text: '견적 비교·우선순위 복잡성', category: 'decision' }],
  },
  {
    number: '05',
    title: '협력사 관리·평가',
    issues: [{ text: '정량·정성 데이터 통합 관리 부재', category: 'evaluation' }],
  },
]

const TECH_STEP_TITLES = [
  '신규 품목 등록',
  '구매 요청서 확인',
  '공급사 탐색·견적 요청',
  '견적 비교·공급사 선정',
  '협력사 관리·평가',
]

const TECH_SLIDES = [
  {
    step: 1,
    eyebrow: 'SPECIFICATION GATE',
    title: '등록 시점에 규격 누락을 막습니다.',
    summary: '불완전한 품목 정보가 구매 요청과 발주 단계까지 흘러가는 문제를 가장 앞에서 차단합니다.',
    need: {
      title: '왜 필요한가',
      body: '규격이 비어 있으면 구매 담당자가 다시 확인해야 하고, 잘못된 견적과 발주 실패로 이어질 수 있습니다.',
      impact: '재확인 반복 · 후속 오류',
    },
    flow: [
      { icon: 'document', label: 'Item 등록', detail: '비활성 상태로 생성' },
      { icon: 'webhook', label: '웹훅 감지', detail: '신규 등록 즉시 시작' },
      { icon: 'database', label: '규격 기준 조회', detail: '품목 그룹별 기준 재사용' },
      { icon: 'ai', label: 'AI 대조', detail: '설명과 필수 규격 비교' },
      { icon: 'check', label: '자동 처리', detail: '활성화 또는 보완 코멘트' },
    ],
    principle: {
      title: '규격 기준은 한 번 만들고 재사용',
      body: '그룹 기준이 없을 때만 AI가 최소 규격을 정의해 DB에 저장합니다. 이후 같은 그룹에는 저장된 기준을 재사용해 비용과 편차를 줄입니다.',
    },
    tools: ['Item Webhook', 'GPT-4o-mini · T=0', 'PostgreSQL', 'ERPNext REST API'],
    outcome: '불완전한 품목을 구매 단계 진입 전에 차단',
    roles: {
      system: 'Item 감지 · 그룹 기준 조회 · 활성 상태 변경',
      ai: '최소 규격 생성 · 설명의 누락 항목 판정',
      human: '누락된 정보만 보완해 다시 요청',
    },
  },
  {
    step: 2,
    eyebrow: 'SUBSTITUTE CHECK',
    title: '후보를 먼저 좁히고, AI는 마지막에 판단합니다.',
    summary: '재고가 있는 대체품을 놓친 채 신규 구매를 시작하는 낭비를 줄이고 담당자의 탐색 시간을 단축합니다.',
    need: {
      title: '왜 필요한가',
      body: '담당자가 품목과 재고를 일일이 뒤져 대체품을 찾으면 시간이 오래 걸리고, 보유 재고를 두고 다시 구매할 수 있습니다.',
      impact: '재고 낭비 · 수기 탐색',
    },
    flow: [
      { icon: 'webhook', label: 'Draft 감지', detail: 'MR 생성 실시간 수신' },
      { icon: 'human', label: '사람의 시작 결정', detail: '담당자 승인 또는 반려' },
      { icon: 'filter', label: '규칙 선별', detail: '같은 그룹 · 충분한 재고' },
      { icon: 'ai', label: 'AI 적합성 판단', detail: '실제 대체 가능성 분석' },
      { icon: 'branch', label: '요청자 선택', detail: '대체품 취소 또는 신규 구매' },
    ],
    principle: {
      title: '규칙 먼저, AI는 필요한 후보에만',
      body: '품목 그룹과 재고 수량으로 후보를 줄인 뒤 AI를 호출합니다. 모든 품목을 AI에 보내지 않아 토큰 사용과 오판 가능성을 함께 낮춥니다.',
    },
    tools: ['MR Webhook', 'Stock API', 'GPT-4o-mini', 'ERPNext REST API'],
    outcome: '대체 재고 활용률을 높이고 불필요한 신규 구매 방지',
    roles: {
      system: 'Draft 동기화 · 품목 그룹과 재고로 후보 선별',
      ai: '후보가 실제 대체 가능한지 의미 기반 비교',
      human: '구매 담당자가 시작 · 요청자가 대체품 여부 결정',
    },
  },
  {
    step: 3,
    eyebrow: 'SUPPLIER DISCOVERY',
    title: '판단부터 탐색, RFQ 발송까지 한 흐름으로 연결합니다.',
    summary: '입찰 필요 여부를 먼저 정하고, 여러 공급사 출처를 병렬 탐색해 실제 연락 가능한 후보로 정제합니다.',
    need: {
      title: '왜 필요한가',
      body: '신규 공급사를 찾을 때 검색, 홈페이지 확인, 연락처 수집과 RFQ 작성이 서로 다른 도구에서 반복됩니다.',
      impact: '탐색 지연 · 접점 누락',
    },
    flow: [
      { icon: 'rule', label: '입찰 여부 판정', detail: '납기 · 금액 · 거래 이력' },
      { icon: 'search', label: '후보 병렬 탐색', detail: '등록업체 · 공공데이터 · 웹' },
      { icon: 'contact', label: '연락처 보강', detail: '공식 사이트 · Jina 폴백' },
      { icon: 'human', label: '대상 확정', detail: '담당자 선택 · 이메일 보완' },
      { icon: 'mail', label: 'RFQ 발송', detail: '문서 생성 · Submit · 이메일' },
    ],
    principle: {
      title: '유료 검색은 후보 발굴에, 무료 검색은 연락처 확인에',
      body: 'Tavily는 기업 후보 추출에만 쓰고 이후 연락처는 네이버 검색과 홈페이지 수집으로 보강합니다. 여러 기업은 배치 처리해 호출 수를 줄입니다.',
    },
    tools: ['자체 DB·PO 이력', '나라장터 API', 'Tavily', 'Naver Search', 'Jina Reader'],
    outcome: '웹 검색과 RFQ 문서 작업을 하나의 공급사 탐색 파이프라인으로 통합',
    future: '신규 거래 시 사업자등록증·통장사본 등 필수 서류 수집은 확장 예정',
    roles: {
      system: '입찰 규칙 · 병렬 검색 · RFQ 생성과 발송',
      ai: '공급사 연관성 · 연락 가능성 · 후보 적합성 평가',
      human: '발송 대상을 선택하고 누락된 이메일 보완',
    },
  },
  {
    step: 4,
    eyebrow: 'QUOTATION INTELLIGENCE',
    title: '서술형 견적을 같은 기준 위에 올립니다.',
    summary: '형식이 다른 견적을 규격·수량·가격·납기로 비교하고, 담당자가 검토할 우선순위를 만듭니다.',
    need: {
      title: '왜 필요한가',
      body: '견적 조건은 문장과 서로 다른 단위로 작성돼 단순 정렬이 어렵고, 미회신 업체 독촉도 담당자가 반복해야 합니다.',
      impact: '비교 편차 · 독촉 반복',
    },
    flow: [
      { icon: 'clock', label: '마감 관리', detail: '미회신 업체 자동 독촉' },
      { icon: 'document', label: 'SQ 수집', detail: '제출 견적과 첨부 확인' },
      { icon: 'ai', label: '조건 분석', detail: '규격 · 수량 · 가격 · 납기' },
      { icon: 'ranking', label: '우선순위 생성', detail: '근거와 함께 정렬' },
      { icon: 'human', label: '최종 선정', detail: '담당자 검토와 승인' },
    ],
    principle: {
      title: 'AI는 추천하고, 최종 결정은 사람이 수행',
      body: '현재는 GPT-4o-mini가 자유 서술형 조건을 비교합니다. 향후 보안성과 재현성을 위해 품목·단위·허용오차 기반 규칙 평가를 병행합니다.',
    },
    tools: ['Supplier Quotation', 'GPT-4o-mini', 'ERPNext REST API', '자동 메일'],
    outcome: '비교 근거를 표준화하고 최종 선택 시간을 단축',
    future: '포털 외 이메일 PDF·Excel 견적서 파싱은 확장 예정',
    roles: {
      system: '견적 수집 · 회신 마감 · 미회신 독촉',
      ai: '규격·가격·납기 조건 비교와 순위 추천',
      human: '추천 근거를 검토하고 최종 공급사 선정',
    },
  },
  {
    step: 5,
    eyebrow: 'SUPPLIER PERFORMANCE',
    title: '거래 이후 평가를 다음 구매의 데이터로 만듭니다.',
    summary: '납기와 가격뿐 아니라 응대와 회신 같은 정성 정보까지 남겨 공급사 선택의 근거를 축적합니다.',
    need: {
      title: '왜 필요한가',
      body: '거래가 끝난 뒤 평가는 누락되기 쉽고, 응대 품질 같은 경험 정보가 담당자의 기억에만 남습니다.',
      impact: '평가 누락 · 경험 단절',
    },
    flow: [
      { icon: 'receipt', label: '거래 완료 감지', detail: '입고 · 납기 · 가격 수집' },
      { icon: 'score', label: '정형 지표 산정', detail: 'ERPNext 내장 평가 활용' },
      { icon: 'human', label: '정성 평가 보완', detail: '응대 · 회신 품질 기록' },
      { icon: 'database', label: '이력 축적', detail: '다음 공급사 선정에 활용' },
    ],
    principle: {
      title: '현재는 기반 확인, 연동과 기준 확장은 다음 단계',
      body: 'ERPNext Supplier Scorecard는 납기·가격 기반 평점을 지원합니다. 현재 시스템에는 완전 연동되지 않아, 평가 자동화와 정성 지표 확장이 남아 있습니다.',
    },
    tools: ['Purchase Receipt', 'Supplier Scorecard', 'PostgreSQL', '평가 UI'],
    outcome: '거래 경험을 일회성 기억이 아닌 재사용 가능한 공급사 데이터로 전환',
    future: '미구현 · Supplier Scorecard 연동 및 평가 기준 확장 예정',
    roles: {
      system: '입고·납기·가격 데이터를 모아 거래 이력화',
      ai: '현재 미적용 · 향후 정성 의견 요약을 보조',
      human: '응대·회신 품질을 평가하고 최종 점수 확인',
    },
  },
]

function SailboatIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M15,66 L85,66 L72,82 L28,82 Z" />
      <rect x="47" y="14" width="4.5" height="52" rx="2" />
      <path d="M55,18 L55,62 L88,62 Z" />
      <path d="M44,24 L18,62 L44,62 Z" />
    </svg>
  )
}

function BrandLine({ section }) {
  return (
    <header className="brandline">
      <div className="brand">
        <div className="brand-logo">
          <SailboatIcon />
        </div>
        <p className="brand-name">BiddingFlow</p>
      </div>
      <div className="section-name">{section}</div>
    </header>
  )
}

function TechIcon({ type }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  const paths = {
    document: <><path d="M14 7h14l7 7v27H14z" /><path d="M28 7v8h7M20 23h9M20 29h9M20 35h6" /></>,
    webhook: <><circle cx="13" cy="24" r="5" /><circle cx="34" cy="13" r="5" /><circle cx="35" cy="35" r="5" /><path d="M18 22l11-6M18 27l12 6" /></>,
    database: <><ellipse cx="24" cy="10" rx="14" ry="6" /><path d="M10 10v10c0 3 6 6 14 6s14-3 14-6V10M10 20v10c0 3 6 6 14 6s14-3 14-6V20M10 30v8c0 3 6 6 14 6s14-3 14-6v-8" /></>,
    ai: <><path d="M16 14h16a7 7 0 017 7v13a7 7 0 01-7 7H16a7 7 0 01-7-7V21a7 7 0 017-7z" /><path d="M24 7v7M19 26h.1M29 26h.1M18 34h12M5 25h4M39 25h4" /></>,
    check: <><circle cx="24" cy="24" r="17" /><path d="M16 24l6 6 11-13" /></>,
    human: <><circle cx="24" cy="16" r="8" /><path d="M9 42c1-10 6-15 15-15s14 5 15 15" /></>,
    filter: <><path d="M7 10h34L28 25v12l-8 4V25z" /><path d="M33 8v8M29 12h8" /></>,
    branch: <><path d="M13 8v13c0 5 4 8 9 8h13" /><path d="M29 22l7 7-7 7M13 21V8M7 14l6-6 6 6" /></>,
    rule: <><path d="M11 12h26M11 24h26M11 36h26" /><circle cx="18" cy="12" r="4" fill="currentColor" stroke="none" /><circle cx="31" cy="24" r="4" fill="currentColor" stroke="none" /><circle cx="22" cy="36" r="4" fill="currentColor" stroke="none" /></>,
    search: <><circle cx="21" cy="21" r="12" /><path d="M30 30l10 10M16 21h10M21 16v10" /></>,
    contact: <><circle cx="19" cy="17" r="7" /><path d="M7 37c1-8 5-12 12-12 5 0 8 2 10 6M33 13h9M33 20h9M34 28h7" /></>,
    mail: <><rect x="7" y="11" width="34" height="27" rx="4" /><path d="M9 14l15 12 15-12" /></>,
    clock: <><circle cx="24" cy="24" r="17" /><path d="M24 14v11l8 5" /></>,
    ranking: <><path d="M10 39V27h7v12M21 39V18h7v21M32 39V9h7v30" /><path d="M8 42h33" /></>,
    receipt: <><path d="M13 7h22v35l-5-4-6 4-6-4-5 4z" /><path d="M19 17h10M19 24h10M19 31h7" /></>,
    score: <><path d="M24 7l5 10 11 2-8 8 2 12-10-6-10 6 2-12-8-8 11-2z" /><path d="M19 24l4 4 7-8" /></>,
    frontend: <><rect x="5" y="8" width="38" height="29" rx="4" /><path d="M5 16h38M17 43h14M24 37v6" /></>,
    api: <><path d="M16 9h16M16 39h16M9 16v16M39 16v16" /><circle cx="9" cy="9" r="4" /><circle cx="39" cy="9" r="4" /><circle cx="9" cy="39" r="4" /><circle cx="39" cy="39" r="4" /></>,
    graph: <><circle cx="10" cy="24" r="5" /><circle cx="25" cy="10" r="5" /><circle cx="38" cy="24" r="5" /><circle cx="25" cy="39" r="5" /><path d="M14 20l7-7M29 13l6 7M35 28l-7 8M21 36l-7-8" /></>,
    erp: <><path d="M8 16l16-9 16 9-16 9z" /><path d="M8 16v18l16 9 16-9V16M24 25v18" /></>,
    intelligence: <><path d="M15 35c-5-3-7-8-7-13 0-9 7-15 16-15s16 6 16 15c0 5-2 10-7 13v6H15z" /><path d="M18 41h12M17 21h14M24 15v12" /></>,
    state: <><ellipse cx="24" cy="12" rx="15" ry="6" /><path d="M9 12v12c0 3 7 6 15 6s15-3 15-6V12M9 24v12c0 3 7 6 15 6s15-3 15-6V24" /></>,
  }

  return <svg className="tech-icon" viewBox="0 0 48 48" aria-hidden="true" {...common}>{paths[type] || paths.graph}</svg>
}

function TechTracker({ activeStep }) {
  return (
    <ol className="tech-tracker" aria-label="구매 자동화 5단계">
      {TECH_STEP_TITLES.map((title, index) => (
        <li className={activeStep === index + 1 ? 'is-current' : ''} key={title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{title}</strong>
        </li>
      ))}
    </ol>
  )
}

function ArchitectureSlide({ active }) {
  const systems = [
    { icon: 'frontend', tag: 'USER EXPERIENCE', title: 'React Frontend', detail: '검토 · 승인 · 폼 · 진행 상태' },
    { icon: 'api', tag: 'SERVICE GATEWAY', title: 'FastAPI Backend', detail: '인증 · REST · Webhook · SSE' },
    { icon: 'graph', tag: 'WORKFLOW ENGINE', title: 'LangGraph', detail: '분기 · 중단 · 재개 · 체크포인트' },
    { icon: 'erp', tag: 'SYSTEM OF RECORD', title: 'ERPNext', detail: 'Item · MR · RFQ · SQ · PO' },
  ]

  return (
    <section className={`slide wide-slide architecture-slide ${active ? 'active' : ''}`} aria-label="시스템 아키텍처">
      <section className="wide-content">
        <BrandLine section="SYSTEM ARCHITECTURE · 01" />
        <div className="architecture-heading">
          <div>
            <p className="tech-eyebrow">HOW IT WORKS</p>
            <h1>ERPNext는 업무 원장으로 두고,<br />자동화 계층을 위에 연결했습니다.</h1>
          </div>
          <p>사용자 입력은 API를 거쳐 워크플로우로 전달되고, AI와 외부 데이터가 판단을 보조합니다. 결과와 진행 상태는 다시 ERP와 화면에 함께 반영됩니다.</p>
        </div>

        <div className="architecture-core" aria-label="핵심 실행 경로">
          {systems.map((system, index) => (
            <article className="architecture-node" key={system.title} style={{ '--node-order': index }}>
              <div className="architecture-icon"><TechIcon type={system.icon} /></div>
              <span>{system.tag}</span>
              <strong>{system.title}</strong>
              <p>{system.detail}</p>
              {index < systems.length - 1 && <i className="architecture-arrow" aria-hidden="true">→</i>}
            </article>
          ))}
        </div>

        <div className="architecture-support">
          <article className="support-lane intelligence-lane">
            <div className="support-icon"><TechIcon type="intelligence" /></div>
            <div>
              <span>INTELLIGENCE LAYER</span>
              <strong>AI 판단과 외부 탐색</strong>
              <p>GPT-4o-mini · Tavily · Naver Search · Jina Reader · 나라장터 데이터</p>
            </div>
            <b>후보 탐색 · 적합성 판단 · 견적 비교</b>
          </article>
          <article className="support-lane state-lane">
            <div className="support-icon"><TechIcon type="state" /></div>
            <div>
              <span>STATE &amp; AUDIT</span>
              <strong>끊겨도 이어지는 실행 상태</strong>
              <p>PostgreSQL 업무 상태 · 대기 작업 · 알림 / LangGraph Checkpoint</p>
            </div>
            <b>중단 · 승인 · 재개 · 이력</b>
          </article>
        </div>

      </section>
      <footer className="wide-footer">
        <span>ERP 데이터와 AI 판단을 분리하고, FastAPI가 사용자 경험과 업무 시스템을 연결합니다.</span>
        <span className="page">08 / ARCHITECTURE</span>
      </footer>
    </section>
  )
}

function TechStepSlide({ active, config, page }) {
  return (
    <section className={`slide wide-slide tech-step-slide ${active ? 'active' : ''}`} aria-label={`${config.step}단계 ${TECH_STEP_TITLES[config.step - 1]}`}>
      <section className="wide-content">
        <BrandLine section={`TECHNICAL FLOW · ${String(config.step).padStart(2, '0')}`} />
        <TechTracker activeStep={config.step} />

        <div className="tech-step-heading">
          <p className="tech-eyebrow">STEP {String(config.step).padStart(2, '0')} · {config.eyebrow}</p>
          <h1>{config.title}</h1>
          <p>{config.summary}</p>
        </div>

        <div className="tech-main-grid">
          <article className="tech-need-card">
            <span>NEED</span>
            <h2>{config.need.title}</h2>
            <p>{config.need.body}</p>
            <strong>{config.need.impact}</strong>
            <i aria-hidden="true">{String(config.step).padStart(2, '0')}</i>
          </article>

          <article className="tech-flow-card">
            <div className="tech-card-label">
              <span>SOLUTION FLOW</span>
              <b>{config.flow.length}개 처리 지점</b>
            </div>
            <div className={`tech-flow tech-flow-${config.flow.length}`}>
              {config.flow.map((node, index) => (
                <div className="tech-flow-node" key={node.label} style={{ '--flow-order': index }}>
                  <div className="tech-flow-icon"><TechIcon type={node.icon} /></div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{node.label}</strong>
                  <p>{node.detail}</p>
                  {index < config.flow.length - 1 && <i aria-hidden="true">→</i>}
                </div>
              ))}
            </div>
            <div className="tech-inline-stack">
              <span>CONNECTED</span>
              {config.tools.map((tool) => <b key={tool}>{tool}</b>)}
            </div>
          </article>
        </div>

        <div className="tech-detail-grid">
          <article className="tech-principle">
            <span>DESIGN PRINCIPLE</span>
            <strong>{config.principle.title}</strong>
            <p>{config.principle.body}</p>
          </article>
          <article className="tech-result">
            <span>OUTCOME</span>
            <strong>{config.outcome}</strong>
            {config.future && <p><b>다음 단계</b>{config.future}</p>}
          </article>
        </div>
      </section>
      <footer className="wide-footer">
        <span>기술은 개별 기능이 아니라, 단계의 병목을 제거하는 순서로 배치했습니다.</span>
        <span className="page">{String(page).padStart(2, '0')} / STEP {String(config.step).padStart(2, '0')}</span>
      </footer>
    </section>
  )
}

function CoverSlide({ active }) {
  return (
    <section className={`slide ${active ? 'active' : ''}`} aria-label="표지">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen cover-screen">
          <div className="bezel-kicker">BIDDING FLOW / 01</div>
          <div className="cover-bezel-mark">
            <SailboatIcon />
          </div>
          <div className="cover-bezel-steps">
            <span />
            <span />
            <span />
          </div>
        </div>
      </aside>

      <section className="cover-content">
        <header className="cover-brand">
          <div className="cover-brand-logo">
            <SailboatIcon />
          </div>
          <div>
            <p className="cover-brand-name">BiddingFlow</p>
            <p className="cover-brand-caption">AI AUTONOMOUS PROCUREMENT</p>
          </div>
        </header>
        <div className="cover-divider" />
        <h1 className="cover-title">
          구매는 물 흐르듯,
          <br />
          결정은 신중하게.
        </h1>
        <p className="cover-subtitle">AI 기반 구매 업무 자동화 플랫폼</p>
        <p className="cover-description">
          구매 요청부터 공급사 탐색, 견적 비교, 발주까지 AI가 이어가고,
          <br />
          담당자는 꼭 필요한 순간에만 결정합니다.
        </p>
      </section>

      <footer className="cover-footer">
        <div>
          <div className="team-label">SKN31 · 3TEAM</div>
          <div className="team-name">박동관(팀장) · 김세희 · 이영창 · 김효민 · 김동민</div>
        </div>
        <div className="page">MID-PROJECT PRESENTATION · 2026</div>
      </footer>
    </section>
  )
}

function ProcessSlide({ active }) {
  return (
    <section className={`slide process-slide ${active ? 'active' : ''}`} aria-label="구매 프로세스와 문제">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen process-screen">
          <div className="dot-field target-dot-field" />
          <div className="bezel-kicker">PROCUREMENT FLOW / 01</div>
          <div className="process-rail">
            {PROCESS_STEPS.map((step) => (
              <div className="process-rail-step" key={step.number}>
                <span>{step.number}</span>
                <strong>{step.title}</strong>
              </div>
            ))}
          </div>
          <div className="process-rail-caption">5 CORE STEPS</div>
        </div>
      </aside>

      <section className="content process-content">
        <BrandLine section="PROBLEM DISCOVERY · 01" />
        <h1 className="title process-title">
          구매의 문제는 한 단계가 아니라,
          <br />전 과정에 흩어져 있습니다.
        </h1>
        <p className="lead process-lead">
          구매 담당자는 등록 요청부터 발주 이후 평가까지, 같은 종류의 확인과 판단을 매번 다시
          수행합니다.
        </p>

        <div className="process-grid" aria-label="구매 업무 5단계">
          {PROCESS_STEPS.map((step) => (
            <article className="process-card" key={step.number}>
              <span>{step.number}</span>
              <strong>{step.title}</strong>
              <ul>
                {step.issues.map((issue) => (
                  <li className={`process-issue process-issue-${issue.category}`} key={issue.text}>
                    {issue.text}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="issue-stack" aria-label="구매 프로세스의 세 가지 핵심 문제">
          <article className="issue-band issue-band-one issue-band-repeat">
            <span>반복</span>
            <strong>확인·비교·독촉 업무 과다</strong>
            <p>핵심 업무 집중도 저하</p>
          </article>
          <article className="issue-band issue-band-two issue-band-decision">
            <span>판단</span>
            <strong>명확한 표준 기준의 부재</strong>
            <p>담당자별 결과 불일치</p>
          </article>
          <article className="issue-band issue-band-three issue-band-evaluation">
            <span>평가</span>
            <strong>정량·정성 데이터의 단절</strong>
            <p>협력사 평가 체계 미흡</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-source">현업 구매 담당자 인터뷰 및 ERPNext 구매 프로세스 분석</div>
        <div className="page">02 / PROBLEM</div>
      </footer>
    </section>
  )
}

function MarketGapSlide({ active }) {
  return (
    <section className={`slide gap-slide ${active ? 'active' : ''}`} aria-label="구매 자동화의 시장 공백">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen dark gap-screen">
          <div className="dot-field" />
          <div className="bezel-kicker">MARKET GAP / 02</div>
          <div className="gap-metrics">
            <div className="gap-metric">
              <strong>3만+</strong>
              <span>스마트공장 구축 기업</span>
            </div>
            <div className="gap-comparison">
              <div>
                <strong>76.3%</strong>
                <span>ERP 활용</span>
              </div>
              <div>
                <strong>0.1%</strong>
                <span>AI 도입</span>
              </div>
            </div>
          </div>
          <div className="gap-bridge">
            <div className="gap-bridge-labels">
              <span>ERP DATA</span>
              <span>PURCHASE ACTION</span>
            </div>
            <div className="gap-bridge-track">
              <i />
              <b>연결 공백</b>
              <i />
            </div>
            <p>다음 행동은 담당자가 직접 연결</p>
          </div>
          <div className="gap-bezel-copy">ERP와 AI 사이<br />비어 있는 구매 업무</div>
        </div>
      </aside>

      <section className="content gap-content">
        <BrandLine section="MARKET RESEARCH · 02" />
        <h1 className="title gap-title">
          ERP는 쓰고 있지만,
          <br />구매 자동화는 비어 있습니다.
        </h1>
        <p className="lead gap-lead">
          반복 구매가 많은 기업일수록 데이터는 ERP에 쌓이지만, 확인·탐색·독촉·비교는 여전히
          담당자가 도구 사이를 오가며 수행합니다.
        </p>

        <div className="gap-list">
          <article className="gap-row">
            <div className="gap-index">01</div>
            <div>
              <strong>반복 구매가 많은 스마트공장</strong>
              <p>재고·공급사·견적·납기 데이터를 함께 확인해야 하는 기업이 국내 약 3만 곳입니다.</p>
            </div>
          </article>
          <article className="gap-row">
            <div className="gap-index">02</div>
            <div>
              <strong>높은 ERP 활용, 낮은 AI 도입</strong>
              <p>업무 데이터는 디지털화됐지만, 다음 행동을 판단하고 이어주는 자동화는 부족합니다.</p>
            </div>
          </article>
          <article className="gap-row">
            <div className="gap-index">03</div>
            <div>
              <strong>기존 ERP와 대형 솔루션 사이의 공백</strong>
              <p>ERP를 교체하지 않으면서 공급사 탐색부터 발주까지 연결할 선택지가 필요합니다.</p>
            </div>
          </article>
        </div>

        <div className="gap-conclusion">
          <span>THE OPPORTUNITY</span>
          <strong>기존 ERP 위에 구매 자동화를 더합니다.</strong>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-source">
          중소벤처기업부 스마트공장 보급 자료 · 중소벤처기업연구원 ERP·AI 활용 조사 · 팀 시장조사
          자료
        </div>
        <div className="page">03 / MARKET GAP</div>
      </footer>
    </section>
  )
}

function MarketSlide({ active }) {
  return (
    <section className={`slide ${active ? 'active' : ''}`} aria-label="글로벌 시장 성장">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen dark">
          <div className="dot-field" />
          <div className="bezel-kicker">MARKET SIGNAL / 03</div>
          <div className="bezel-metrics">
            <div className="bezel-metric">
              <div className="num">9.76%</div>
              <div className="label">
                구매 소프트웨어 시장
                <br />
                연평균 성장률
              </div>
            </div>
            <div className="bezel-metric">
              <div className="num">93.5%</div>
              <div className="label">
                AI 에이전트 기반 공급망
                <br />
                소프트웨어 지출 성장률
              </div>
            </div>
          </div>
          <svg className="mini-chart" viewBox="0 0 270 210" fill="none">
            <path d="M8 188H264" stroke="rgba(255,255,255,.22)" strokeWidth="2" />
            <path
              d="M8 170C62 165 83 148 126 145C171 142 206 113 262 88"
              stroke="rgba(255,255,255,.5)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M8 184C104 184 171 176 205 147C230 126 245 75 262 18"
              stroke="#fff"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="262" cy="18" r="6" fill="#fff" />
          </svg>
        </div>
      </aside>

      <section className="content">
        <BrandLine section="MARKET RESEARCH · 03" />
        <h1 className="title">
          구매 소프트웨어는 성장하고 있고,
          <br />
          AI가 그 성장 방식을 바꾸고 있습니다.
        </h1>
        <p className="lead">
          구매 업무의 디지털화가 진행되는 동시에, AI는 답변을 생성하는 도구에서 여러 작업을
          이어서 수행하는 방식으로 이동하고 있습니다.
        </p>

        <div className="market-list">
          <article className="market-row">
            <div className="row-label">
              글로벌
              <br />
              <strong>구매 소프트웨어 시장</strong>
            </div>
            <div className="row-metric">
              107.4억 달러 <span>→</span> 171.1억 달러
            </div>
            <div className="row-note">
              <strong>9.76%</strong>
              2026 → 2031
            </div>
          </article>
          <article className="market-row">
            <div className="row-label">
              AI 에이전트 기반
              <br />
              <strong>공급망 소프트웨어 지출</strong>
            </div>
            <div className="row-metric">
              20억 미만 <span>→</span> 530억 달러
            </div>
            <div className="row-note">
              <strong>93.5%</strong>
              2025 → 2030
            </div>
          </article>
        </div>
        <div className="statement">
          구매 자동화 시장의 성장과 ‘업무를 직접 이어가는 AI’의 부상이 동시에 일어나고 있습니다.
        </div>
      </section>

      <footer className="footer">
        <div className="footer-source">
          Mordor Intelligence, Procurement Software Market (2026) · Gartner, Agentic AI in Supply
          Chain Management Software (2026)
          <br />두 지표는 시장 범위가 다르므로 합산하지 않음
        </div>
        <div className="page">04 / MARKET</div>
      </footer>
    </section>
  )
}

function TargetSlide({ active }) {
  return (
    <section className={`slide ${active ? 'active' : ''}`} aria-label="국내 초기 목표 시장">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen">
          <div className="dot-field target-dot-field" />
          <div className="bezel-kicker">TARGET MARKET / 04</div>
          <div className="funnel">
            <div className="funnel-step one">
              <div>
                <strong>829.9만</strong>
                <span>국내 중소기업</span>
              </div>
            </div>
            <div className="funnel-step two">
              <div>
                <strong>6,474</strong>
                <span>중견기업</span>
              </div>
            </div>
            <div className="funnel-step three">
              <div>
                <strong>2,174</strong>
                <span>제조 중견기업</span>
              </div>
            </div>
            <div className="funnel-step four">
              <div>
                <strong>초기 고객</strong>
                <span>ERP + 수작업 구매</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <section className="content">
        <BrandLine section="MARKET RESEARCH · 04" />
        <h1 className="title">
          시장은 넓지만,
          <br />첫 고객은 선명합니다.
        </h1>
        <p className="lead">
          기업 수 전체를 잠재 고객으로 부풀리지 않았습니다. 디지털 기반과 구매 조직은 있지만,
          문서 사이의 업무를 여전히 사람이 잇는 기업부터 시작합니다.
        </p>

        <div className="target-list">
          <article className="target-row">
            <div className="target-index">01</div>
            <strong>제조·유통기업</strong>
            <p>원재료·부품·소모품을 반복 구매하고 신규 공급사 탐색도 발생합니다.</p>
          </article>
          <article className="target-row">
            <div className="target-index">02</div>
            <strong>ERP와 구매 담당자 보유</strong>
            <p>품목과 구매 문서는 ERP에 있지만 다음 행동은 담당자의 경험에 의존합니다.</p>
          </article>
          <article className="target-row">
            <div className="target-index">03</div>
            <strong>이메일·엑셀 병행</strong>
            <p>견적 요청, 회신 정리, 비교와 독촉을 여러 도구에서 반복합니다.</p>
          </article>
        </div>

        <div className="evidence">
          <div className="value">
            스마트공장
            <br />약 3만 개
          </div>
          <p>
            <strong>구매 자동화를 받아들일 디지털 기반의 보조 지표</strong>
            <br />스마트공장 구축 기업 전체를 BiddingFlow의 고객 수로 계산하지는 않습니다.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-source">
          중소벤처기업부, 2023년 기준 중소기업 기본통계 · 산업통상자원부, 2024년 중견기업
          기본통계 · 중소벤처기업부, 2022년 스마트공장 보급 자료
        </div>
        <div className="page">05 / TARGET</div>
      </footer>
    </section>
  )
}

function readSlideFromHash() {
  const requested = Number(window.location.hash.slice(1)) || 1
  return Math.max(0, Math.min(SLIDE_COUNT - 1, requested - 1))
}

function App() {
  const [current, setCurrent] = useState(readSlideFromHash)
  const [scale, setScale] = useState(1)

  const goTo = useCallback((index) => {
    const next = Math.max(0, Math.min(SLIDE_COUNT - 1, index))
    setCurrent(next)
    window.history.replaceState(null, '', `#${next + 1}`)
  }, [])

  useEffect(() => {
    const fit = () => {
      setScale(Math.min(window.innerWidth / SLIDE_WIDTH, window.innerHeight / SLIDE_HEIGHT))
    }
    const handleHashChange = () => setCurrent(readSlideFromHash())
    const handleKeyDown = (event) => {
      if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        setCurrent((value) => {
          const next = Math.min(SLIDE_COUNT - 1, value + 1)
          window.history.replaceState(null, '', `#${next + 1}`)
          return next
        })
      }
      if (['ArrowLeft', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        setCurrent((value) => {
          const next = Math.max(0, value - 1)
          window.history.replaceState(null, '', `#${next + 1}`)
          return next
        })
      }
      if (event.key === 'Home') {
        event.preventDefault()
        goTo(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        goTo(SLIDE_COUNT - 1)
      }
    }

    fit()
    window.addEventListener('resize', fit)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', fit)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [goTo])

  return (
    <div className="presentation-app">
      <main
        className="deck"
        style={{ transform: `scale(${scale})` }}
        aria-live="polite"
      >
        <CoverSlide active={current === 0} />
        <ProcessSlide active={current === 1} />
        <MarketGapSlide active={current === 2} />
        <MarketSlide active={current === 3} />
        <TargetSlide active={current === 4} />
        <WhyErpnextSlide active={current === 5} page="06 / WHY ERPNEXT" />
        <PositioningSlide active={current === 6} page="07 / POSITIONING" />
        <ArchitectureSlide active={current === 7} />
        {TECH_SLIDES.map((config, index) => (
          <TechStepSlide
            key={config.step}
            active={current === index + 8}
            config={config}
            page={index + 9}
          />
        ))}
      </main>

      <nav className="controls" aria-label="슬라이드 이동">
        <button type="button" aria-label="이전 슬라이드" onClick={() => goTo(current - 1)}>
          ←
        </button>
        <div className="counter">
          <span>{String(current + 1).padStart(2, '0')}</span> /{' '}
          <span>{String(SLIDE_COUNT).padStart(2, '0')}</span>
        </div>
        <button type="button" aria-label="다음 슬라이드" onClick={() => goTo(current + 1)}>
          →
        </button>
      </nav>
      <div
        className="progress"
        style={{ width: `${((current + 1) / SLIDE_COUNT) * 100}%` }}
        aria-hidden="true"
      />
    </div>
  )
}

export default App
