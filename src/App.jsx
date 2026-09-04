import { useCallback, useEffect, useState } from 'react'
import {
  BadgeCheck,
  Bot,
  Boxes,
  Braces,
  ChartNoAxesColumnIncreasing,
  CircleCheck,
  Clock3,
  ContactRound,
  Database,
  FileText,
  GitBranch,
  HardDrive,
  Lightbulb,
  ListFilter,
  Mail,
  Monitor,
  RadioTower,
  ReceiptText,
  Search,
  SlidersHorizontal,
  UserRound,
  Workflow,
} from 'lucide-react'
import './presentation.css'
import { PositioningSlide, WhyErpnextSlide } from './TechDecisionSlides.jsx'

const SLIDE_WIDTH = 1600
const SLIDE_HEIGHT = 900
const SLIDE_COUNT = 15

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
    eyebrow: '품목 정보 확인',
    title: '품목을 등록할 때, 빠진 규격부터 확인합니다.',
    summary: '불완전한 정보가 견적과 발주까지 넘어가기 전에 막습니다.',
    need: {
      title: '왜 필요한가',
      body: '규격이 빠지면 담당자가 다시 물어봐야 하고, 잘못된 견적과 발주로 이어질 수 있습니다.',
      impact: '재확인 반복 · 발주 오류',
    },
    flow: [
      { icon: 'document', label: '등록 요청', detail: '새 품목을 임시 저장' },
      { icon: 'webhook', label: '요청 감지', detail: '등록 즉시 자동 확인' },
      { icon: 'database', label: '기준 확인', detail: '같은 품목군의 필수 규격 조회' },
      { icon: 'ai', label: '누락 비교', detail: 'AI가 설명과 기준을 대조' },
      { icon: 'check', label: '결과 반영', detail: '등록하거나 보완을 요청' },
    ],
    principle: {
      title: '한 번 만든 규격 기준을 계속 활용',
      body: '품목군별 기준이 없을 때만 AI가 만들고, 다음 요청부터는 저장된 기준을 다시 사용합니다.',
    },
    tools: ['ERP 품목 정보', '실시간 요청 감지', 'AI 규격 비교', '규격 기준 DB'],
    outcome: '누락된 규격을 구매 시작 전에 확인',
  },
  {
    step: 2,
    eyebrow: '대체품 확인',
    title: '새로 사기 전에, 쓸 수 있는 재고부터 찾습니다.',
    summary: '규칙으로 후보를 좁힌 뒤, AI가 실제 대체 가능성을 확인합니다.',
    need: {
      title: '왜 필요한가',
      body: '담당자가 재고를 일일이 확인하면 시간이 오래 걸리고, 이미 있는 물건을 다시 살 수 있습니다.',
      impact: '중복 구매 · 재고 낭비',
    },
    flow: [
      { icon: 'webhook', label: '요청 접수', detail: '새 구매 요청을 바로 확인' },
      { icon: 'human', label: '담당자 검토', detail: '구매 시작 또는 반려' },
      { icon: 'filter', label: '재고 후보 추림', detail: '같은 품목군과 수량 확인' },
      { icon: 'ai', label: '대체 가능성 확인', detail: 'AI가 용도와 규격을 비교' },
      { icon: 'branch', label: '요청자가 선택', detail: '재고 사용 또는 새로 구매' },
    ],
    principle: {
      title: '명확한 조건은 규칙으로, 해석은 AI로',
      body: '재고량은 규칙으로 빠르게 거르고, 용도와 규격처럼 해석이 필요한 부분만 AI가 비교합니다.',
    },
    tools: ['ERP 구매 요청', 'ERP 재고', 'AI 대체품 판단'],
    outcome: '불필요한 구매를 줄이고 보유 재고를 먼저 활용',
  },
  {
    step: 3,
    eyebrow: '공급사 탐색과 견적 요청',
    title: '여러 견적이 필요할 때만, 새 공급사를 찾습니다.',
    summary: '구매 이력과 납품 기한을 먼저 확인하고, 필요할 때만 새 업체에 견적을 요청합니다.',
    need: {
      title: '왜 필요한가',
      body: '검색부터 연락처 확인과 견적 요청까지 도구가 나뉘면, 후보를 놓치고 같은 일을 반복하게 됩니다.',
      impact: '반복 검색 · 공급사 누락',
    },
    flow: [
      { icon: 'rule', label: '여러 견적 필요?', detail: '납품 기한·금액·과거 거래 확인' },
      { icon: 'search', label: '공급사 탐색', detail: '사내 이력·공공 데이터·웹' },
      { icon: 'contact', label: '연락처 확인', detail: '공식 홈페이지와 이메일 확인' },
      { icon: 'human', label: '보낼 업체 선택', detail: '담당자가 후보를 최종 확인' },
      { icon: 'mail', label: '견적 요청 발송', detail: 'ERP 문서와 이메일 자동 생성' },
    ],
    principle: {
      title: '찾는 일은 동시에, 결정은 한 번만',
      body: '여러 곳에서 후보를 동시에 찾고 AI가 관련 업체를 정리하면, 담당자는 정리된 결과만 확인합니다.',
    },
    tools: ['사내 거래 이력', '공공 조달 데이터', '웹 검색', 'ERP 견적 요청'],
    outcome: '공급사 탐색부터 견적 요청까지 한 화면에서 완료',
    future: '향후 신규 업체의 필수 서류 수집까지 확장',
  },
  {
    step: 4,
    eyebrow: '견적 비교와 업체 선정',
    title: '제각각인 견적을 한눈에 비교합니다.',
    summary: '가격뿐 아니라 규격, 수량, 납기까지 같은 표에서 비교합니다.',
    need: {
      title: '왜 필요한가',
      body: '견적서마다 표현과 단위가 달라, 가격만 정렬해서는 올바른 선택이 어렵습니다.',
      impact: '비교 시간 · 판단 편차',
    },
    flow: [
      { icon: 'document', label: '견적 회신 수집', detail: '업체가 보낸 조건을 모음' },
      { icon: 'clock', label: '미회신 업체 알림', detail: '마감 전 자동으로 독촉' },
      { icon: 'ai', label: '조건 맞춰 보기', detail: '규격·가격·납기를 같은 기준으로' },
      { icon: 'ranking', label: '추천 순위 생성', detail: 'AI가 이유와 함께 정렬' },
      { icon: 'human', label: '최종 업체 선택', detail: '담당자가 근거를 보고 결정' },
    ],
    principle: {
      title: 'AI는 비교 근거를 만들고, 사람은 선택',
      body: 'AI가 조건 차이와 추천 이유를 보여주며, 최종 계약 판단은 담당자가 수행합니다.',
    },
    tools: ['ERP 견적서', 'AI 견적 비교', '자동 독촉 메일'],
    outcome: '빠르면서도 근거가 남는 업체 선정',
    future: '향후 이메일 PDF·Excel 견적도 자동 처리',
  },
  {
    step: 5,
    eyebrow: '협력사 관리와 평가',
    title: '거래 결과를 다음 공급사 선택에 씁니다.',
    summary: '납기와 가격, 응대 품질을 기록해 믿을 수 있는 업체를 먼저 찾습니다.',
    need: {
      title: '왜 필요한가',
      body: '거래가 끝나면 평가는 빠지기 쉽고, 업체에 대한 경험이 담당자의 기억에만 남습니다.',
      impact: '평가 누락 · 경험 소실',
    },
    flow: [
      { icon: 'receipt', label: '물품 도착 확인', detail: '실제 납품 결과를 확인' },
      { icon: 'score', label: '납기·가격 기록', detail: '수치로 평가할 항목 저장' },
      { icon: 'human', label: '응대 품질 평가', detail: '담당자가 경험 정보를 보완' },
      { icon: 'database', label: '다음 구매에 활용', detail: '업체 추천의 근거로 재사용' },
    ],
    principle: {
      title: '거래가 끝나야 구매 데이터가 완성',
      body: '실제 납품 기록과 담당자의 평가를 함께 남겨, 다음 공급사 추천의 근거로 사용합니다.',
    },
    tools: ['ERP 입고 기록', '공급사 평가표', '거래 이력 DB'],
    outcome: '한 번의 거래를 다음 구매에 쓰는 공급사 데이터로 전환',
    future: '현재 평가 자동 연동은 다음 개발 단계',
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
  const icons = {
    document: FileText,
    webhook: RadioTower,
    database: Database,
    ai: Bot,
    check: CircleCheck,
    human: UserRound,
    filter: ListFilter,
    branch: GitBranch,
    rule: SlidersHorizontal,
    search: Search,
    contact: ContactRound,
    mail: Mail,
    clock: Clock3,
    ranking: ChartNoAxesColumnIncreasing,
    receipt: ReceiptText,
    score: BadgeCheck,
    frontend: Monitor,
    api: Braces,
    graph: Workflow,
    erp: Boxes,
    intelligence: Lightbulb,
    state: HardDrive,
  }
  const Icon = icons[type] || Workflow

  return <Icon className="tech-icon" strokeWidth={1.8} aria-hidden="true" />
}

function TableOfContentsSlide({ active }) {
  const sections = [
    {
      number: '01',
      title: '문제 파악 & 시장 조사',
      description: '구매 업무의 반복과 판단 편차를 살펴보고, 기존 시스템이 채우지 못한 시장의 공백을 확인합니다.',
      topics: ['현업의 반복', '시장 공백', '도입 대상'],
    },
    {
      number: '02',
      title: '아키텍처 & 사용 기술',
      description: 'ERP 위에 자동화 계층을 연결하고, 다섯 단계의 구매 업무가 실제로 어떻게 처리되는지 설명합니다.',
      topics: ['시스템 구조', '5단계 자동화', '사람의 결정'],
    },
  ]

  return (
    <section className={`slide wide-slide toc-slide ${active ? 'active' : ''}`} aria-label="목차">
      <section className="wide-content toc-content">
        <BrandLine section="CONTENTS · 00" />
        <div className="toc-layout">
          <div className="toc-intro">
            <p className="toc-kicker">PRESENTATION MAP</p>
            <h1>오늘은 두 가지를<br />말씀드립니다.</h1>
            <p>
              현업에서 발견한 문제부터,<br />이를 자동화한 구조와 기술까지<br />한 흐름으로 보여드립니다.
            </p>
          </div>
          <ol className="toc-list">
            {sections.map((section, index) => (
              <li key={section.number} style={{ '--toc-order': index }}>
                <span className="toc-number">{section.number}</span>
                <div className="toc-copy">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                  <div className="toc-topics">
                    {section.topics.map((topic) => <span key={topic}>{topic}</span>)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <footer className="wide-footer">
        <span>문제에서 출발해, 실제로 작동하는 해결 구조까지 이어갑니다.</span>
        <span className="page">02 / CONTENTS</span>
      </footer>
    </section>
  )
}

function SectionDividerSlide({ active, number, title, description, topics, page }) {
  return (
    <section className={`slide section-divider-slide ${active ? 'active' : ''}`} aria-label={`${number} ${title}`}>
      <header className="section-divider-header">
        <div className="section-divider-brand">
          <div className="section-divider-logo"><SailboatIcon /></div>
          <strong>BiddingFlow</strong>
        </div>
        <span>SECTION {number}</span>
      </header>

      <div className="section-divider-body">
        <div className="section-divider-number" aria-hidden="true">{number}</div>
        <div className="section-divider-copy">
          <p>CHAPTER {number}</p>
          <h1>{title}</h1>
          <div className="section-divider-rule" />
          <h2>{description}</h2>
          <div className="section-divider-topics">
            {topics.map((topic, index) => (
              <span key={topic}><b>{String(index + 1).padStart(2, '0')}</b>{topic}</span>
            ))}
          </div>
        </div>
      </div>

      <footer className="section-divider-footer">
        <span>구매는 물 흐르듯, 결정은 신중하게.</span>
        <span>{String(page).padStart(2, '0')} / SECTION {number}</span>
      </footer>
    </section>
  )
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
        <span className="page">10 / ARCHITECTURE</span>
      </footer>
    </section>
  )
}

function TechStepSlide({ active, config, page }) {
  return (
    <section className={`slide wide-slide tech-step-slide ${active ? 'active' : ''}`} aria-label={`${config.step}단계 ${TECH_STEP_TITLES[config.step - 1]}`}>
      <section className="wide-content">
        <BrandLine section={`구매 자동화 · ${String(config.step).padStart(2, '0')}`} />
        <TechTracker activeStep={config.step} />

        <div className="tech-step-heading">
          <p className="tech-eyebrow">{config.step}단계 · {TECH_STEP_TITLES[config.step - 1]}</p>
          <h1>{config.title}</h1>
          <p>{config.summary}</p>
        </div>

        <div className="tech-main-grid">
          <article className="tech-need-card">
            <span>현재 문제</span>
            <h2>{config.need.title}</h2>
            <p>{config.need.body}</p>
            <strong>{config.need.impact}</strong>
            <i aria-hidden="true">{String(config.step).padStart(2, '0')}</i>
          </article>

          <article className="tech-flow-card">
            <div className="tech-card-label">
              <span>처리 흐름</span>
              <b>{config.flow.length}단계</b>
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
              <span>연결 기술</span>
              {config.tools.map((tool) => <b key={tool}>{tool}</b>)}
            </div>
          </article>
        </div>

        <div className="tech-detail-grid">
          <article className="tech-principle">
            <span>설계 원칙</span>
            <strong>{config.principle.title}</strong>
            <p>{config.principle.body}</p>
          </article>
          <article className="tech-result">
            <span>기대 효과</span>
            <strong>{config.outcome}</strong>
            {config.future && <p><b>향후</b>{config.future}</p>}
          </article>
        </div>
      </section>
      <footer className="wide-footer">
        <span>반복 업무는 자동화하고, 책임 있는 결정은 사람에게 남겼습니다.</span>
        <span className="page">{String(page).padStart(2, '0')} / {config.step}단계</span>
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
        <div className="page">04 / PROBLEM</div>
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
        <div className="page">05 / MARKET GAP</div>
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
        <div className="page">06 / MARKET</div>
      </footer>
    </section>
  )
}

// 현재 덱에서 제외된 슬라이드입니다. 되살리려면 아래 컴포넌트를 렌더 목록에 다시 넣으세요.
// eslint-disable-next-line no-unused-vars
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
        <TableOfContentsSlide active={current === 1} />
        <SectionDividerSlide
          active={current === 2}
          number="01"
          title="문제 파악 & 시장 조사"
          description="구매 담당자가 반복하는 일과, 기존 시스템이 채우지 못한 공백을 확인합니다."
          topics={['현업의 반복', '시장 공백', '도입 대상']}
          page={3}
        />
        <ProcessSlide active={current === 3} />
        <MarketGapSlide active={current === 4} />
        <MarketSlide active={current === 5} />
        <WhyErpnextSlide active={current === 6} page="07 / WHY ERPNEXT" />
        <PositioningSlide active={current === 7} page="08 / POSITIONING" />
        <SectionDividerSlide
          active={current === 8}
          number="02"
          title="아키텍처 & 사용 기술"
          description="ERP 위에 자동화 계층을 연결하고, 다섯 단계의 처리 흐름을 살펴봅니다."
          topics={['시스템 구조', '5단계 자동화', '사람의 결정']}
          page={9}
        />
        <ArchitectureSlide active={current === 9} />
        {TECH_SLIDES.map((config, index) => (
          <TechStepSlide
            key={config.step}
            active={current === index + 10}
            config={config}
            page={index + 11}
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
