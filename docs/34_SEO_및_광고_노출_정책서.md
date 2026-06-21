# 📄 34_SEO_및_광고_노출_정책서

## 1. 문서 개요

본 문서는 폴다임(Poldigm)의 검색 노출, SNS 공유 메타, 광고 노출 정책을 정의합니다. 로컬 MVP에서는 SEO/광고를 실제 구현하지 않더라도, 실제 MVP 배포 전에는 본 문서를 기준으로 메타 태그, 색인 정책, 광고 지면, 개인정보 고지를 점검해야 합니다.

로컬 MVP의 우선순위는 테스트 플로우 검증입니다. 실제 검색 색인, 광고 플랫폼 심사, 운영용 OG 이미지 생성은 배포 MVP 전환 시점의 작업으로 분리합니다.

## 2. 적용 범위

| 구분 | 로컬 MVP | 실제 MVP |
|---|---|---|
| 기본 메타 태그 | 최소 title/description만 권장 | 필수 |
| OG/Twitter Card | 기본값 또는 생략 가능 | 필수 |
| 결과별 OG 이미지 | 제외 | 선택. 공유 성과를 보고 확장 |
| `robots.txt` | 선택 | 필수 |
| `sitemap.xml` | 제외 가능 | 필수 |
| 광고 스크립트 | 사용하지 않음 | 정책 검토 후 선택 |
| 광고 placeholder UI | 선택 | 실제 광고 지면 기준으로 고정 |
| 쿠키/동의 배너 | 광고 미사용 시 불필요 | 광고/분석 도구에 따라 필수 검토 |

## 3. 페이지별 색인 정책

| 라우트 | 색인 정책 | 이유 |
|---|---|---|
| `/` | `index,follow` | 서비스 대표 진입점 |
| `/test` | `noindex,nofollow` | 개인화 진행 화면이며 검색 유입 가치가 낮음 |
| `/analysis` | `noindex,nofollow` | 임시 상태 화면 |
| `/result/[id]` | `noindex,follow` | 결과 공유는 허용하되 개인 성향 결과의 검색 색인은 기본 차단 |
| `/terms` | `index,follow` | 법적 고지 접근성 확보 |
| `/privacy` | `index,follow` | 개인정보처리방침 접근성 확보 |
| `/404` | `noindex,nofollow` | 오류 화면 |

결과 페이지는 SNS/메신저 공유용 OG 메타를 제공할 수 있지만, 검색엔진 색인은 기본 차단합니다. 결과 페이지를 색인 대상으로 전환하려면 개인정보, 민감 성향 추론, 중복 페이지, 얇은 콘텐츠 문제를 별도로 검토해야 합니다.

## 4. 기본 SEO 메타 정책

### 4.1. 공통 메타

모든 공개 페이지는 아래 메타를 가져야 합니다.

```html
<title>Poldigm - 나의 사회적 페르소나 테스트</title>
<meta name="description" content="20개의 딜레마 문항으로 나의 사회적 가치관과 페르소나 유형을 확인해보세요.">
<link rel="canonical" href="https://poldigm.com/">
<meta name="robots" content="index,follow">
```

구현 원칙:

- SvelteKit에서는 `+layout.svelte` 또는 페이지별 `+page.svelte`의 `<svelte:head>`로 관리한다.
- canonical URL은 `PUBLIC_APP_BASE_URL`을 기준으로 생성한다.
- 로컬에서는 `PUBLIC_APP_BASE_URL=http://localhost:5173`을 사용하되, 배포 전 실제 도메인으로 교체한다.
- `/test`, `/analysis`, `/result/[id]`, `/404`는 페이지별 robots 값을 반드시 덮어쓴다.

### 4.2. 페이지별 title/description

| 라우트 | title | description |
|---|---|---|
| `/` | `Poldigm - 나의 사회적 페르소나 테스트` | `20개의 딜레마 문항으로 나의 사회적 가치관과 페르소나 유형을 확인해보세요.` |
| `/test` | `테스트 진행 중 - Poldigm` | `Poldigm 테스트를 진행 중입니다.` |
| `/analysis` | `결과 분석 중 - Poldigm` | `응답을 분석해 나의 사회적 페르소나를 계산하고 있습니다.` |
| `/result/[id]` | `{title} - Poldigm 결과` | `{subtitle} Poldigm에서 나의 사회적 페르소나를 확인해보세요.` |
| `/terms` | `이용약관 - Poldigm` | `Poldigm 서비스 이용약관입니다.` |
| `/privacy` | `개인정보처리방침 - Poldigm` | `Poldigm 개인정보처리방침입니다.` |

## 5. SNS 공유 메타 정책

### 5.1. 공통 OG/Twitter Card

공개 페이지는 아래 속성을 기준으로 합니다.

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Poldigm">
<meta property="og:title" content="Poldigm - 나의 사회적 페르소나 테스트">
<meta property="og:description" content="20개의 딜레마 문항으로 나의 사회적 가치관과 페르소나 유형을 확인해보세요.">
<meta property="og:url" content="https://poldigm.com/">
<meta property="og:image" content="https://poldigm.com/assets/og/og_default.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Poldigm - 나의 사회적 페르소나 테스트">
<meta name="twitter:description" content="20개의 딜레마 문항으로 나의 사회적 가치관과 페르소나 유형을 확인해보세요.">
<meta name="twitter:image" content="https://poldigm.com/assets/og/og_default.png">
```

이미지 규격은 `22_에셋_및_캐릭터_명세서`의 공유 이미지 규격을 따릅니다.

### 5.2. 결과 페이지 공유 메타

`/result/[id]`는 기본적으로 `noindex`지만 공유 메타는 제공할 수 있습니다.

권장 메타:

- `og:title`: `나는 {title} 유형 - Poldigm`
- `og:description`: `{subtitle} 20개 딜레마로 나의 사회적 페르소나를 확인해보세요.`
- `og:url`: 현재 결과 URL
- `og:image`: 초기에는 `og_default.png`, 후속으로 결과별 OG 이미지 확장
- `twitter:card`: `summary_large_image`

로컬 MVP에서는 결과별 OG 이미지를 만들지 않습니다. 실제 MVP에서도 초기에는 기본 OG 이미지 하나로 시작하고, 공유 성과가 확인되면 결과별 OG 생성을 검토합니다.

## 6. `robots.txt`와 `sitemap.xml`

### 6.1. `robots.txt`

실제 MVP 배포 시 `static/robots.txt`를 제공합니다.

```text
User-agent: *
Allow: /

Sitemap: https://poldigm.com/sitemap.xml
```

`robots.txt`는 sitemap 위치를 알리는 최소 파일로 둡니다. `/test`, `/analysis`, `/result/[id]` 같은 비색인 페이지는 robots 차단이 아니라 페이지별 `meta name="robots"`의 `noindex`로 처리합니다. robots에서 차단하면 검색엔진이 페이지의 `noindex`를 읽지 못할 수 있으므로, 비색인 정책은 페이지 메타를 기준으로 합니다.

### 6.2. `sitemap.xml`

실제 MVP 배포 시 sitemap에는 정적 공개 페이지만 포함합니다.

포함:

- `/`
- `/terms`
- `/privacy`

제외:

- `/test`
- `/analysis`
- `/result/[id]`
- `/404`

SvelteKit에서는 `src/routes/sitemap.xml/+server.ts`로 동적 생성하거나, 초기에는 `static/sitemap.xml` 정적 파일로 제공할 수 있습니다.

## 7. 광고 노출 정책

### 7.1. 단계별 광고 전략

| 단계 | 광고 정책 |
|---|---|
| 로컬 MVP | 광고 스크립트와 실제 광고 지면을 넣지 않음 |
| 비공개 알파 | 광고 없음. UX, 결과 공감도, 공유율 검증 우선 |
| 공개 MVP 초기 | 광고 없음 또는 결과 페이지 하단 1개 슬롯만 실험 |
| 트래픽 검증 후 | 랜딩 하단, 결과 상세 하단, 푸터 영역으로 제한 확장 |

테스트 진행 중 광고는 넣지 않습니다. 문항 사이 광고, 팝업 광고, 전면 광고는 이탈률과 신뢰도를 해치므로 MVP 범위에서 제외합니다.

### 7.2. 허용 광고 지면

| 슬롯 ID | 위치 | 정책 |
|---|---|---|
| `ad_landing_after_intro` | 랜딩 주요 CTA 아래 | 첫 화면 CTA를 밀어내지 않는 경우만 허용 |
| `ad_result_after_summary` | 결과 요약과 공유 CTA 아래 | 결과 확인을 방해하지 않는 경우만 허용 |
| `ad_result_footer` | 결과 상세 하단 | 가장 우선순위 낮은 보조 슬롯 |

금지 위치:

- 테스트 질문 사이
- A/B 선택지 근처
- 분석 로딩 화면
- 결과 타이틀/캐릭터/핵심 요약보다 위
- 이용약관/개인정보처리방침 본문 중간

### 7.3. 광고 UI/성능 기준

- 광고 컨테이너는 사전 높이를 확보해 CLS를 줄인다.
- 광고 실패 시 빈 영역이 과하게 남지 않도록 fallback 스타일을 둔다.
- 광고 스크립트는 테스트 시작과 결과 계산 API를 막지 않도록 지연 로드한다.
- 광고 로드는 결과 화면 렌더링 이후로 미루는 것을 우선한다.
- 광고 때문에 이미지 저장 캡처 영역이 깨지면 광고를 캡처 영역 밖으로 이동한다.

## 8. Google AdSense 적용 가능성

Google AdSense 적용은 가능하다고 보되, Poldigm의 주제가 사회/정치 성향으로 해석될 수 있으므로 **중간 리스크**로 분류합니다.

판단:

- AdSense는 정치/사회 주제 사이트를 일괄 금지하지 않는다.
- 다만 선거, 민주적 절차, 공적 제도에 대한 허위 주장이나 오해 유발 콘텐츠는 Google Publisher Policies 위반 위험이 있다.
- 문항과 결과 카피는 특정 정당, 후보, 선거 행동을 유도하는 정치 주장처럼 보이지 않게 작성한다.
- 서비스 포지셔닝은 “정치 성향 판정”보다 “사회적 가치관/페르소나 테스트”로 유지한다.
- 승인 전에는 테스트 플로우, 정책 페이지, 고유 콘텐츠, 명확한 내비게이션, 개인정보처리방침을 먼저 갖춘다.

### 8.1. AdSense 단계별 적용안

| 단계 | AdSense 정책 |
|---|---|
| 로컬 MVP | 적용하지 않음 |
| 비공개 알파 | 적용하지 않음 |
| 공개 MVP 초기 | 신청 전 사이트 품질, 정책 페이지, 고유 콘텐츠, 공유 메타를 먼저 정리 |
| AdSense 승인 후 | 결과 페이지 하단 1개 수동 슬롯부터 시작 |
| 트래픽 검증 후 | 랜딩 하단과 결과 상세 하단으로 제한 확장 |

초기부터 AdSense를 핵심 수익모델로 두지 않습니다. 승인되면 보조 수익 채널로 보고, 완료율과 공유율을 먼저 검증합니다.

### 8.2. AdSense 사용 시 금지/주의 항목

금지:

- 테스트 문항 사이 광고 삽입
- A/B 선택지 근처 광고 배치
- 팝업, 전면 광고, 강제 이동 광고
- 결과 유형, 응답 이력, 닉네임을 광고 타겟팅 이벤트로 전송
- 개인의 정치 성향을 추론해 개인화 광고 세그먼트로 활용

주의:

- Auto ads를 켤 경우 테스트 진행 화면, 선택지 근처, 결과 캡처 영역에 광고가 들어가지 않도록 제외 영역을 검토한다.
- 민감한 정치/사회 이슈 문항은 사실 주장보다 가치관 딜레마 형태로 작성한다.
- 결과 문구는 “당신은 특정 정치 집단이다”보다 “이런 의사결정 경향이 있다”는 톤을 사용한다.
- 광고/분석 스크립트가 쿠키나 식별자를 쓰면 개인정보처리방침과 동의 UI를 함께 갱신한다.

### 8.3. AdSense 신청 전 체크

- 실제 도메인 연결
- 충분한 고유 콘텐츠와 완성된 랜딩/결과 페이지
- `/terms`, `/privacy` 페이지 제공
- 명확한 사이트명, 로고, 푸터 내비게이션 제공
- 오해를 유발하는 정치 주장, 허위 선거 정보, 혐오/차별 표현 제거
- 테스트 진행 중 광고 없음
- 결과 페이지 하단 수동 광고 슬롯만 준비
- 광고 미승인 시에도 서비스 플로우가 영향을 받지 않음

## 9. 광고 심사 및 민감 주제 리스크

Poldigm은 사회/정치 성향을 다루므로 광고 플랫폼 정책상 민감 주제, 개인화 광고, 정치적 콘텐츠 해석 리스크가 있을 수 있습니다.

실제 광고 적용 전 체크:

- 광고 플랫폼의 최신 정책을 확인한다.
- 개인의 정치 성향을 추론하거나 타겟팅 광고에 사용하지 않는다.
- 결과 유형, 응답 이력, 닉네임을 광고 타겟팅 이벤트로 전송하지 않는다.
- 초기에는 개인화 광고보다 문맥형 광고 또는 광고 미적용을 우선 검토한다.
- 광고/분석 도구가 쿠키나 식별자를 쓰면 `40_이용약관_및_개인정보처리방침`과 동의 UI를 함께 갱신한다.

광고 수익화는 MVP의 핵심 검증 항목이 아닙니다. 공개 초기에는 결과 공감도, 완료율, 공유율을 광고 수익보다 우선합니다.

## 10. 구현 체크리스트

실제 MVP 배포 전 필수:

- `/`에 `index,follow` 메타 적용
- `/test`, `/analysis`, `/404`에 `noindex,nofollow` 적용
- `/result/[id]`에 `noindex,follow` 적용
- canonical URL이 실제 도메인을 사용함
- `og_default.png` 준비
- OG/Twitter Card 메타 적용
- `robots.txt` 제공
- `sitemap.xml` 제공
- 결과 페이지 공유 미리보기 확인
- 광고 미사용 또는 광고 슬롯 정책 확정
- AdSense 신청 전 정책 페이지, 내비게이션, 고유 콘텐츠, 민감 표현 점검
- AdSense 적용 시 결과 페이지 하단 수동 슬롯부터 시작
- 광고/분석 도구 사용 시 개인정보처리방침 갱신 여부 확인

### 10.1. 배포 후 검증 절차

실제 도메인 배포 후 아래 항목을 확인합니다.

| 검증 항목 | 확인 방법 |
|---|---|
| 검색 색인 | Google Search Console에 도메인 등록 후 `/`, `/terms`, `/privacy` 색인 가능 여부 확인 |
| 비색인 페이지 | `/test`, `/analysis`, `/result/[id]`, `/404`의 `meta robots` 값 확인 |
| sitemap | `https://poldigm.com/sitemap.xml` 접근 및 Search Console 제출 |
| robots | `https://poldigm.com/robots.txt` 접근 및 sitemap 경로 확인 |
| OG 미리보기 | 카카오톡, X/Twitter, Slack/Discord 등 주요 공유 미리보기 확인 |
| 결과 공유 | `/result/[id]`는 `noindex`이지만 OG title/description/image가 표시되는지 확인 |
| AdSense | 신청 전 최신 Google 정책 확인, 승인 후 결과 페이지 하단 수동 슬롯부터 적용 |

로컬 MVP에서는 아래만 권장:

- 기본 title/description 작성
- 결과 공유 텍스트와 링크 복사 동작 확인
- 광고 스크립트 미삽입

## 11. 참고 문서

- `01_PRD_제품요구사항정의서`: 바이럴 공유 요구사항
- `03_IA_정보구조_설계서`: 라우트와 페이지별 역할
- `20_UIUX_화면설계서_Wireframe`: 결과 화면과 공유 액션
- `22_에셋_및_캐릭터_명세서`: OG/공유 이미지 규격
- `33_로컬_MVP_구현_계획서`: 로컬 MVP 제외 범위
- `40_이용약관_및_개인정보처리방침`: 광고/분석 도구 적용 시 갱신 대상
- Google AdSense Program policies: https://support.google.com/adsense/answer/48182
- Google Publisher Policies: https://support.google.com/adsense/answer/10502938
- Google Personalized ads policy: https://support.google.com/adspolicy/answer/143465

## 12. 현재 구현 반영

로컬 MVP는 광고, Search Console, sitemap, 실제 OG 이미지 배포를 구현 범위에 포함하지 않습니다.

현재 구현 상태:

| 항목 | 상태 |
|---|---|
| 기본 HTML meta description | `src/app.html`에 최소 적용 |
| favicon | `static/favicon.svg` 적용 |
| 결과 공유 | 링크 복사와 이미지 캡처 함수 구현 |
| AdSense | 미삽입 |
| Analytics | 미삽입 |
| robots/sitemap | 실제 MVP 전환 전 추가 대상 |
| 결과 페이지 색인 | 실제 MVP에서 `noindex,follow` 적용 대상 |

광고는 실제 도메인 배포와 콘텐츠/정책 검수 이후 결과 페이지 하단의 제한적 슬롯부터 실험합니다. 문항 진행 중 광고, 팝업, 전면 광고는 MVP 정책상 제외합니다.
