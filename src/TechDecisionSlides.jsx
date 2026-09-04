import './techDecision.css'

/* FINAL-PPT 삽입용 · 「ERPNext 선택 이유」 / 「경쟁 우위」 2장
 *
 * App.jsx 의 SailboatIcon · BrandLine 이 아직 export 되지 않아 이 파일 안에 같은 모양으로 두었습니다.
 * Codex 쪽에서 두 함수를 export 하면 아래 로컬 정의를 지우고 import 로 바꾸면 됩니다.
 */

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

/* ══════════ A. 더존 · 영림 대신 ERPNext를 선택한 이유 ══════════ */
export function WhyErpnextSlide({ active, page = '05 / WHY ERPNEXT' }) {
  return (
    <section className={`slide ${active ? 'active' : ''}`} aria-label="ERPNext를 선택한 이유">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen">
          <div className="dot-field target-dot-field" />
          <div className="bezel-kicker">WHY ERPNEXT / 01</div>

          <div className="bezel-panel">
            <section>
              <p className="panel-label gate-label">국산 ERP</p>
              <div className="gate-box closed">
                <div className="gate-box-title">API · 데이터 구조 비공개</div>
                <div className="gate-veil" />
                <div className="gate-chips">
                  <span>더존</span>
                  <span>영림</span>
                  <span>이카운트</span>
                </div>
              </div>
            </section>

            <div className="gate-arrow">↓</div>

            <section>
              <p className="panel-label gate-label">ERPNEXT</p>
              <div className="gate-box open">
                <div className="gate-box-title">구조 전면 공개</div>
                <ol className="doc-chain">
                  <li>ITEM<span>품목</span></li>
                  <li>MR<span>구매 요청서</span></li>
                  <li>RFQ<span>견적 요청서</span></li>
                  <li>PO<span>발주서</span></li>
                </ol>
              </div>
              <div className="gate-mark">
                <strong>3만+</strong>
                <span>글로벌 사용 기업</span>
              </div>
            </section>
          </div>
        </div>
      </aside>

      <section className="content ins">
        <BrandLine section="TECH DECISION · 01" />

        <h1 className="title">
          국산 ERP도 검토했지만,
          <br />
          MVP 검증에는 ERPNext가 맞았습니다.
        </h1>
        <p className="lead">
          AI가 붙으려면 데이터 구조를 열어볼 수 있어야 합니다. 세 가지 이유로 오픈소스 ERPNext를
          검증 환경으로 선택했습니다.
        </p>

        <div className="reason-list">
          <article className="reason-row">
            <div className="reason-index">01</div>
            <div className="reason-head">폐쇄형 구조</div>
            <p>
              API와 데이터 구조가 비공개에 가까워, 외부 AI 에이전트가 데이터를 직접 읽고 자동화
              로직을 붙이기 어렵습니다.
            </p>
          </article>
          <article className="reason-row">
            <div className="reason-index">02</div>
            <div className="reason-head">
              프로젝트성
              <br />
              커스터마이징
            </div>
            <p>
              신규 기능마다 벤더를 통한 개발이 필요해 비용과 검증 기간이 길어집니다. 빠르게
              돌려봐야 하는 MVP 단계와 맞지 않습니다.
            </p>
          </article>
          <article className="reason-row pick">
            <div className="reason-index">03</div>
            <div className="reason-head">
              열려 있는
              <br />
              표준 문서 구조
            </div>
            <p>
              데이터 구조가 완전히 공개되어 있고 ITEM · MR · RFQ · PO 표준 구매문서 체계를 갖춰,
              AI 자동화 구현이 가장 명확하고 빠릅니다.
            </p>
          </article>
        </div>

        <div className="statement">
          MVP 검증은 오픈소스 ERPNext로 먼저 증명하고, 이후 더존 · 영림 등 국내 ERP용 어댑터로
          확장합니다.
        </div>
      </section>

      <footer className="footer">
        <div className="footer-source">
          팀 내부 조사 · 국내 ERP 벤더 API 정책 및 커스터마이징 사례 기준 · ERPNext 공식 자료
          <br />
          ERPNext는 검증 환경이며, 최종 목표는 고객사가 이미 쓰는 ERP 위에서 동작하는 것입니다.
        </div>
        <div className="page">{page}</div>
      </footer>
    </section>
  )
}

/* ══════════ B. 경쟁 우위 분석 및 차별화 포인트 ══════════ */
const COMPARISONS = [
  {
    old: '고비용 · 장기 구축',
    oldNote: '라이선스 비용이 높고 구축에 수개월이 걸려 중소·중견기업이 도입하기 어렵습니다.',
    now: '압도적 가성비, 빠른 구축',
    nowNote: '오픈소스 기반으로 라이선스 부담 없이 빠른 초기 개발과 MVP 구현이 가능합니다.',
  },
  {
    old: '연동 부재로 반복되는 수작업',
    oldNote: '담당자가 있어도 시스템이 이어지지 않아 매번 전화하고 엑셀로 견적을 다시 정리합니다.',
    now: 'ERP DB 직접 연동 · 에이전트 자동화',
    nowNote: '구매 데이터를 ERP에서 바로 불러와 견적 비교부터 승인까지 이어서 처리합니다.',
  },
  {
    old: '복잡한 커스텀 문서 구조',
    oldNote: '기업마다 문서 체계가 달라 적용이 복잡하고 도입에 많은 시간이 듭니다.',
    now: '표준 구매문서 기반',
    nowNote: '전 세계적으로 널리 쓰이는 ITEM · MR · RFQ · PO 구조라 적용과 확장이 빠릅니다.',
  },
  {
    old: '전체 플랫폼 교체 · 신규 구축',
    oldNote: '기존 ERP와 프로세스를 대체하는 방식이라 전환 비용과 도입 리스크가 큽니다.',
    now: '기존 ERP 위에 얹는 경량 AI 레이어',
    nowNote: '데이터와 워크플로를 그대로 둔 채 도입할 수 있어 전환 장벽이 낮습니다.',
  },
]

export function PositioningSlide({ active, page = '06 / POSITIONING' }) {
  return (
    <section className={`slide ${active ? 'active' : ''}`} aria-label="경쟁 우위 분석 및 차별화 포인트">
      <aside className="bezel" aria-hidden="true">
        <div className="bezel-screen dark">
          <div className="dot-field" />
          <div className="bezel-kicker">POSITIONING / 02</div>

          <div className="bezel-panel">
            <section className="layer-sec">
              <p className="panel-label layer-label">교체형 · 기존 대형 ERP</p>
              <div className="layer-stack">
                <div className="layer-block replace">
                  <strong>새 플랫폼</strong>
                  <span>전면 재구축 · 수개월</span>
                </div>
                <div className="layer-block dropped">
                  <strong>기존 ERP</strong>
                  <span>대체 · 폐기</span>
                </div>
              </div>
              <p className="layer-cap">전환 비용과 도입 리스크가 큽니다.</p>
            </section>

            <div className="layer-rule">VS</div>

            <section className="layer-sec pick">
              <p className="panel-label layer-label">얹는 방식 · BIDDINGFLOW</p>
              <div className="layer-stack">
                <div className="layer-block on">
                  <strong>BiddingFlow</strong>
                  <span>경량 AI 레이어 · 판단만 수행</span>
                </div>
                <div className="layer-join">+</div>
                <div className="layer-block keep">
                  <strong>기존 ERP</strong>
                  <span>데이터 · 워크플로 그대로 유지</span>
                </div>
              </div>
              <p className="layer-cap pick">교체 없이 위에 한 겹만 얹습니다.</p>
            </section>
          </div>
        </div>
      </aside>

      <section className="content ins">
        <BrandLine section="TECH DECISION · 02" />

        <h1 className="title">
          기존 대형 ERP는 교체를 요구하고,
          <br />
          비딩플로우는 그 위에 얹습니다.
        </h1>

        <div className="versus-head">
          <div className="old">기존 대형 ERP · SAP · Oracle · Coupa</div>
          <div className="mid">VS</div>
          <div className="new">BIDDING FLOW</div>
        </div>

        <div className="versus-list">
          {COMPARISONS.map((row) => (
            <article className="versus-row" key={row.now}>
              <div className="versus-cell old">
                <strong>{row.old}</strong>
                <p>{row.oldNote}</p>
              </div>
              <div className="versus-mid">›</div>
              <div className="versus-cell new">
                <strong>{row.now}</strong>
                <p>{row.nowNote}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="statement">
          기존 업무 방식을 바꾸지 않고도 도입할 수 있다는 것이 저희의 핵심 경쟁력입니다.
        </div>
      </section>

      <footer className="footer">
        <div className="footer-source">
          본 비교는 ‘구매 프로세스 자동화’라는 같은 문제를 푸는 대안으로서의 비교이며,
          <br />
          도입 형태(전체 플랫폼 교체 vs 기존 ERP 위 애드온형 AI 레이어)에는 차이가 있습니다.
        </div>
        <div className="page">{page}</div>
      </footer>
    </section>
  )
}
