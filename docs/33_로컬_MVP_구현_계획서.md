# 📄 33_로컬_MVP_구현_계획서

## 1. 문서 개요

본 문서는 폴다임(Poldigm)을 **외부 인프라 없이 로컬 개발 환경에서 실행 가능한 MVP**로 구현하기 위한 범위, 방식, 파일 구조, 현재 구현 구성, 완료 기준을 정의합니다.

이 문서는 실제 상용 배포용 아키텍처 문서인 `30_시스템_아키텍처_설계서`, API 계약 문서인 `31_API_데이터_스키마_명세서`, DB 문서인 `32_DB스키마_및_RLS정책서`보다 **로컬 개발 실행성**을 우선합니다. 즉, 로컬 MVP는 Supabase, Cloudflare Pages, Turnstile, 실제 도메인 연결 없이도 `http://127.0.0.1:5173`에서 테스트 전체 플로우가 동작해야 합니다.

## 2. 로컬 MVP 목표

로컬 MVP의 목표는 아래 4가지를 빠르게 검증하는 것입니다.

1. 사용자가 랜딩 페이지에서 테스트를 시작할 수 있다.
2. 서버 전용 문항 풀과 분기 알고리즘으로 20문항 테스트가 진행된다.
3. 서버가 응답 이력을 재계산하여 결과 코드와 결과 화면 데이터를 반환한다.
4. 결과 화면에서 유형, 점수, 설명, 궁합, 공유용 이미지 영역을 확인할 수 있다.

로컬 MVP는 운영 인프라, 실사용자 통계 저장, 봇 방어, 도메인 배포를 검증하는 단계가 아닙니다.

## 3. 구현 범위

### 3.1. 포함 범위

| 구분 | 로컬 MVP 구현 내용 |
|---|---|
| 프론트엔드 | SvelteKit 기반 랜딩, 테스트 진행, 분석/로딩, 결과 화면 |
| 서버 API | SvelteKit `+server.ts` 기반 `/api/next-question`, `/api/submit-result` |
| 문항 데이터 | 서버 전용 `src/lib/server/data/questions.ko-KR.ts` |
| 결과 매핑 | 서버 전용 `src/lib/server/data/result-mappings.ko-KR.ts` |
| 알고리즘 | `10_문항_및_분기_로직_설계서` 기준 문항 선택, 점수 계산, S/M 판별 |
| 상태 유지 | 브라우저 `sessionStorage` 기반 응답 이력 보존 |
| 결과 저장 | Supabase 대신 로컬 mock 저장 모듈 사용 |
| Turnstile | SvelteKit dev 런타임에서만 실제 검증 없이 local mock token으로 통과 처리 |
| 에셋 | 16개 캐릭터 파일명 슬롯 유지, 실제 이미지가 없으면 타입 코드 기반 placeholder 사용 |
| 스타일 | `21_디자인_시스템_가이드`의 CSS 변수와 컴포넌트 scoped CSS 적용 |
| 법무 고지 | `/terms`, `/privacy` 최소 정적 페이지 제공 |
| SEO 최소 고지 | `/robots.txt`, `/sitemap.xml`, 페이지별 robots meta |

### 3.2. 제외 범위

| 제외 항목 | 로컬 MVP 정책 |
|---|---|
| Supabase 실제 연결 | 하지 않음. 저장 로직은 mock adapter로 대체 |
| Cloudflare Pages 배포 | 고려하지 않음. `http://127.0.0.1:5173` 실행만 목표 |
| Cloudflare Turnstile 실제 검증 | 하지 않음. SvelteKit dev 런타임에서만 local mock 검증 사용 |
| 실제 도메인 연결 | 하지 않음 |
| RLS 적용 | 하지 않음. SQL은 `32_DB스키마_및_RLS정책서`에만 유지 |
| 실사용자 분석/통계 | 하지 않음 |
| 관리자 페이지 | 구현하지 않음 |
| 다국어 | `ko-KR`만 구현 |
| 실제 SNS 공유 API 완성 | 이미지 저장/링크 복사 수준까지 우선 구현 |
| 운영용 OG 이미지 생성 | 로컬 MVP에서는 제외 |

## 4. 로컬 실행 방식

### 4.1. 권장 기술 스택

| 영역 | 선택 |
|---|---|
| App Framework | SvelteKit |
| Language | TypeScript |
| Styling | CSS 변수 + Svelte 컴포넌트 scoped CSS |
| Adapter | `@sveltejs/adapter-cloudflare`. 로컬 실행은 Vite dev server, 빌드는 Cloudflare Pages/Workers 대상 산출물 생성 |
| Package Manager | `npm`으로 고정. 로컬 MVP 범위에서는 `pnpm`, `yarn`을 사용하지 않음 |
| Test | Vitest 권장 |
| Browser QA | Playwright 기반 E2E 검증. 시스템 Chrome 검증은 `npm run test:e2e:chrome`으로 수행 |

### 4.2. 실행 명령 예시

현재 구현 기준 명령은 `package.json`에 확정되어 있습니다.

```bash
npm ci
npm run dev
npm run verify
npm run verify:ci
npm run verify:e2e
npm run test:e2e:managed
npm run test:e2e
npm run test:e2e:chrome
```

로컬 기본 접속 주소:

```text
http://127.0.0.1:5173
```

포트가 이미 사용 중이면 Vite/SvelteKit이 안내하는 대체 포트를 사용합니다.

`npm run build`는 production 빌드 가능 여부 확인용입니다. `npm run preview` 또는 production build에서 `/api/submit-result`까지 완료하려면 실제 Cloudflare Turnstile server verification adapter가 필요합니다. local mock Turnstile은 SvelteKit dev 런타임에서만 허용되므로, 전체 20문항 제출 플로우 검증은 `npm run dev` 또는 Playwright dev server 기준으로 수행합니다.

## 5. 환경 변수 정책

로컬 MVP는 외부 서비스를 사용하지 않으므로 필수 secret이 없어야 합니다.

`.env.example`에는 후속 실제 MVP 전환을 고려한 이름만 남기되, 로컬 실행에 필요하지 않음을 명시합니다.

```env
# Local MVP에서는 외부 서비스 연결을 사용하지 않습니다.
PUBLIC_APP_ENV=local
PUBLIC_APP_BASE_URL=http://127.0.0.1:5173
PUBLIC_GA_MEASUREMENT_ID=

# 실제 MVP 전환 시 사용 예정. Local MVP에서는 비워둡니다.
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
TURNSTILE_SECRET_KEY=
PUBLIC_TURNSTILE_SITE_KEY=
```

서버 코드는 `PUBLIC_APP_ENV === 'local'`과 SvelteKit dev 런타임을 함께 만족할 때만 local mock 검증을 사용합니다. production build에서는 `PUBLIC_APP_ENV`가 잘못 `local`로 설정되어도 `local-mock-token`이 통과하지 않아야 합니다.

클라이언트도 SvelteKit dev 런타임에서만 `local-mock-token`을 전송합니다. production build나 `npm run preview`에서는 mock token을 보내지 않으므로, 실제 Turnstile adapter가 연결되지 않은 상태의 결과 제출 실패는 의도된 동작입니다.

## 6. 권장 파일 구조

아래 구조는 로컬 MVP 구현 기준입니다.

```text
src/
  app.css
  routes/
    +layout.svelte
    +error.svelte
    +page.svelte
    test/
      +page.svelte
    result/
      [id]/
        +page.server.ts
        +page.svelte
    api/
      next-question/
        +server.ts
      submit-result/
        +server.ts
  lib/
    components/
      layout/
        AppHeader.svelte
      test/
        ChoiceCard.svelte
        ProgressBar.svelte
      result/
        ResultCapture.svelte
        AxisGauge.svelte
        BottomActions.svelte
        CharacterImage.svelte
    client/
      session.ts
      share.ts
    server/
      algorithm/
        questions.ts
        scoring.ts
        validation.ts
        results.ts
      data/
        questions.ko-KR.ts
        result-mappings.ko-KR.ts
      storage/
        mock-results.ts
      bot/
        mock-turnstile.ts
    constants/
      runtime.ts
static/
  assets/
    characters/
      character_CTMO.png
      ...
tests/
  algorithm/
  api/
  client/
  e2e/
```

이미지가 준비되지 않은 경우 `static/assets/characters/`에 실제 PNG를 만들지 않고, 프론트엔드에서 이미지 로딩 실패 시 타입 코드 placeholder를 보여줘도 됩니다. 단, 파일명 계약은 `22_에셋_및_캐릭터_명세서`를 따릅니다.

현재 로컬 MVP 구현은 실제 PNG가 없는 상태에서도 결과 카드가 비어 보이지 않도록 `CharacterImage.svelte`에서 타입 코드 기반 인라인 SVG 캐릭터를 렌더링합니다. 실제 MVP에서 `static/assets/characters/character_{type_code}.png`가 준비되면 동일 UI 계약으로 교체합니다.

### 6.1. 문항 카피 정책

로컬 MVP의 우선순위는 문항 카피와 **분기/점수/결과 산출 플로우 검증**을 함께 만족하는 것입니다.

초기 구현에서는 placeholder 문구를 허용했지만, 현재 로컬 MVP는 44개 알고리즘 슬롯과 132개 후보 문항을 정상 한국어 카피로 채웠습니다. 향후 문구를 교체하더라도 각 문항은 아래 구조를 반드시 만족해야 합니다.

- 모든 문항 ID가 고유해야 한다.
- Phase 1 공통 문항은 `commonOrder`, Phase 2 분기 문항은 `axis`, `branchCondition`, `branchOrder`를 가져야 한다.
- 각 선택지는 `scoreEffect` 또는 `intensityEffect`를 문서 계약에 맞게 가져야 한다.
- 사용자가 A/B를 선택할 수 있는 자연어 문장이어야 한다.
- UX/콘텐츠 검수 단계에서 문구를 수정하더라도 ID와 배점 계약은 유지한다.

구현 완료 판단은 “44개 알고리즘 슬롯의 구조 검증”, “132개 후보 문항의 사용자 노출 카피 완성”, “20문항 플로우 정상 동작”을 함께 기준으로 합니다.

QA 완료 기준은 아래처럼 분리합니다.

- 알고리즘 QA: 44개 슬롯 구조, 132개 후보 문항, 분기 도달성, 점수 계산, S/M 판별이 정상 동작하면 통과
- 콘텐츠 QA: 현재 문항 카피의 표현 수위, 문항 편향, 오탈자, 선택지 균형을 별도로 검수해야 통과

## 7. 로컬 Mock 정책

### 7.1. 저장 로직 mock

로컬 MVP의 `/api/submit-result`는 Supabase에 저장하지 않습니다. 대신 `mock-results.ts`에서 결과 ID를 생성하고 메모리 또는 개발용 JSON 유사 객체에 저장한 것처럼 응답합니다.

권장 동작:

- `crypto.randomUUID()`로 `resultId` 생성
- 서버 메모리 `Map<string, LocalResultRecord>`에 저장
- `saveLocalResult(record)`, `getLocalResult(id)`, `clearLocalResults()` 형태의 작은 adapter 함수로 감싸기
- 개발 서버 재시작 시 저장 데이터가 사라져도 허용
- `/api/submit-result` 응답 직후 클라이언트는 `resultId`와 `resultViewModel`을 `sessionStorage`에 저장
- 결과 페이지는 서버 mock 저장소 조회 결과 또는 `sessionStorage` fallback 데이터로 렌더링

예시 타입:

```ts
type LocalResultRecord = {
  id: string;
  createdAt: string;
  locale: 'ko-KR';
  resultCode: string;
  scores: Record<'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L', number>;
  playTimeSec?: number;
  deviceType?: 'Mobile' | 'Desktop' | 'Tablet';
  utmSource?: string;
};
```

실제 MVP 전환 시 이 adapter만 Supabase insert adapter로 교체합니다. 알고리즘, API 응답 형태, 결과 화면은 바꾸지 않는 것이 원칙입니다.

### 7.2. 결과 페이지 복구 정책

로컬 mock 저장소는 개발 서버 재시작 시 사라질 수 있으므로, 로컬 MVP에서 결과 URL의 장기 보존을 보장하지 않습니다.

권장 동작:

- `/result/[id]/+page.server.ts`에서 서버 mock 저장소의 `id`를 먼저 조회한다.
- 서버 mock 저장소에 결과가 없으면 `+page.svelte`에서 `sessionStorage`의 마지막 결과 데이터를 조회한다.
- `sessionStorage` 데이터의 `resultId`가 URL의 `id`와 같고 `PublicResult` 최소 shape, 공식 8개 점수 키와 0~100 정수 점수값, `scores`에서 재계산한 `axisGauges`, `winnerPercent`, 방향 라벨, 강도 라벨, 궁합 유형 코드, `character_{typeCode}.png` 파일명 계약 일치 검증을 통과하면 해당 데이터로 결과 화면을 렌더링한다.
- 진행 중 새로고침 복구도 `AnswerHistoryItem` 최소 shape 검증을 통과한 응답 이력만 사용한다.
- 깨진 JSON, 누락 필드, 잘못된 선택지, 공식 점수 키 외 추가 키, 음수/100 초과/소수 점수값, 축 점수 또는 게이지 필드가 부족하거나 `scores`와 게이지의 축 짝/순서/퍼센트/라벨, 궁합 코드, 캐릭터 파일명이 맞지 않는 `sessionStorage` 데이터는 복구하지 않는다.
- 서버와 `sessionStorage` 양쪽 모두 데이터가 없으면 결과 화면 대신 “테스트 다시 시작” CTA를 표시한다.
- 직접 URL 공유 후 다른 브라우저에서 결과가 복구되는 기능은 로컬 MVP 범위가 아니다.

실제 MVP에서 결과 URL 공유나 재방문 복구가 필요하면 Supabase 저장 결과를 기준으로 구현합니다.

### 7.3. Turnstile mock

로컬 MVP에서는 Turnstile 위젯을 렌더링하지 않아도 됩니다.

권장 정책:

- 클라이언트는 SvelteKit dev 런타임에서만 `turnstileToken: 'local-mock-token'`을 전송
- 서버는 local dev 런타임에서만 해당 값을 검증 성공으로 처리
- `playTimeSec < 20`이면 기존 API 계약대로 `429 abuse_suspected` 처리
- 테스트 자동화에서는 명시적으로 `playTimeSec >= 20`인 fixture를 사용

실제 MVP 전환 시 `mock-turnstile.ts`를 Cloudflare Turnstile 검증 adapter로 교체합니다.

## 8. API 구현 범위

로컬 MVP에서도 API 계약은 `31_API_데이터_스키마_명세서`를 따릅니다.

### 8.1. `POST /api/next-question`

필수 구현:

- `history=[]`일 때 1번 문항 반환
- `history.length` 0~20 검증
- 중복 문항 ID 검증
- 도달 불가능한 문항 순서 검증
- Phase 1 고정 순서 반환
- Phase 2 분기 조건 계산 후 `branchOrder` 기준 반환
- 클라이언트에는 `scoreEffect`, `branchCondition`, `intensityEffect`를 반환하지 않음

### 8.2. `POST /api/submit-result`

필수 구현:

- `history.length === 20` 검증
- Turnstile local mock 검증
- `playTimeSec < 20` abuse 검증
- 서버에서 점수 재계산
- 동점 처리 규칙 적용
- `S/M` 강도 태그 계산
- `resultViewModel` 조립
- mock 저장 후 `resultId` 반환

### 8.3. `GET /result/[id]` 서버 로드

로컬 MVP에서는 별도 공개 API를 늘리지 않고 SvelteKit의 `+page.server.ts`를 사용합니다.

필수 구현:

- URL의 `id`로 `mock-results.ts`의 `getLocalResult(id)` 조회
- 조회 성공 시 결과 화면에 필요한 공개 데이터만 `load` 결과로 반환
- 조회 실패 시 `result: null`을 반환하고, 클라이언트가 `sessionStorage` fallback을 시도
- 서버 load 결과에도 내부 점수 배점, 분기 조건, 전체 문항 풀은 포함하지 않음

실제 MVP에서 결과 URL 공유/재방문을 정식 지원하면 이 서버 load의 저장소 adapter를 Supabase 조회 adapter로 교체합니다.

## 9. 현재 구현 구성

### 9.1. SvelteKit 앱 기반

- `package.json`, `src/`, `static/` 기준 SvelteKit 프로젝트 구조
- TypeScript와 SvelteKit `+page.svelte`, `+server.ts`, `+page.server.ts` 라우트 사용
- 전역 CSS 변수와 컴포넌트 scoped CSS 기반 스타일 적용
- `@sveltejs/adapter-cloudflare`로 Cloudflare Pages/Workers 대상 빌드 산출물 생성

### 9.2. 서버 데이터

- `questions.ko-KR.ts`에 44개 알고리즘 슬롯과 132개 후보 문항 구성
- `result-mappings.ko-KR.ts`에 16개 결과 매핑 구성
- 문항 풀 검증 함수 작성

### 9.3. 알고리즘

- `scoring.ts`: 점수 계산, 축별 승자, S/M 판별
- `questions.ts`: 다음 문항 계산
- `validation.ts`: history 정합성 검증
- `questionSeed` 기반 문항 variant 선택과 새로고침 복구

### 9.4. API와 로컬 adapter

- `/api/next-question`
- `/api/submit-result`
- mock 저장 adapter
- mock Turnstile adapter

### 9.5. 프론트엔드 화면

- 랜딩 화면
- 테스트 진행 화면
- 분석/로딩 화면. 로컬 MVP에서는 `/analysis` 별도 라우트 대신 `/test` 내부 로딩 상태로 처리 가능
- 결과 화면
- 하단 공유/다시하기 액션
- 잘못된 라우트와 예외 상태를 처리하는 전역 오류 화면
- `/terms`, `/privacy` 최소 정적 고지 페이지
- `/robots.txt`, `/sitemap.xml`, 비색인 페이지 robots meta

이미지 저장 구현 기준:

- `html2canvas` 또는 동등한 캡처 라이브러리는 브라우저에서만 실행한다.
- SvelteKit SSR 중에는 캡처 라이브러리를 import하지 않는다.
- 구현 시 `onMount` 이후 dynamic import 또는 버튼 클릭 시점 import를 사용한다.
- 캡처 실패 시 링크 복사 CTA는 계속 동작해야 한다.

### 9.6. 로컬 QA

- 새로고침 후 `sessionStorage` 복구
- 20문항 완료 플로우
- C/I, T/P, M/E, O/L 각 분기 도달 케이스
- `BALANCED` 분기 케이스
- `S` 결과와 `M` 결과 케이스
- 모바일 폭 확인

필수 테스트 케이스:

- `nextQuestion([])`는 첫 번째 Phase 1 문항을 반환한다.
- 중복 문항 ID가 포함된 `history`는 `400 validation_error`가 된다.
- 도달 불가능한 순서의 문항 ID가 포함된 `history`는 `400 validation_error`가 된다.
- `/api/submit-result`는 `history.length`가 19개 또는 21개일 때 `400 validation_error`가 된다.
- Phase 1에서 한 축이 동점이면 해당 축의 Phase 2는 `BALANCED` 분기를 사용한다.
- S/M 판별 기준에 따라 `CTMO-S`와 `CTMO-M` 같은 강도 태그가 모두 생성된다.
- local dev 런타임에서 `turnstileToken: 'local-mock-token'`은 통과한다.
- production build에서는 `PUBLIC_APP_ENV=local`이더라도 `local-mock-token`이 통과하지 않는다.
- `playTimeSec < 20`이면 `429 abuse_suspected`가 된다.
- `/api/next-question` 응답에는 `scoreEffect`, `branchCondition`, `intensityEffect`가 노출되지 않는다.
- `/result/[id]/+page.server.ts`는 mock 저장소 결과가 있으면 공개 결과 데이터만 반환한다.
- `/result/[id]`는 서버 mock 저장소가 비어 있어도 같은 세션의 `sessionStorage` 데이터로 복구된다.
- 서버 mock 저장소와 `sessionStorage` 모두 결과가 없으면 “테스트 다시 시작” CTA를 표시한다.
- 캡처 라이브러리는 SSR에서 import되지 않는다.

### 9.7. 문서 동기화 기준

현재 구현 상태를 바꿀 때는 본 문서와 실제 코드를 함께 대조합니다.

확인 항목:

- `package.json`의 스크립트가 `npm run dev`, `npm run verify`, `npm run verify:ci`, `npm run verify:e2e`, `npm run test:e2e:managed`, `npm run test:e2e`, `npm run test:e2e:chrome`과 일치하는가
- 브라우저 검증 스크립트와 실제 검증 범위가 README, 본 문서, `tests/docs/documentation-consistency.test.ts`에 함께 반영되어 있는가
- 실제 폴더 구조가 6장의 권장 파일 구조와 크게 어긋나지 않는가
- 테스트 러너 또는 Playwright 프로젝트 구성이 바뀌면 본 문서의 Test 항목과 GitHub Actions 설명을 함께 갱신했는가
- `/analysis`를 별도 라우트로 만들었는지, `/test` 내부 로딩 상태로 처리했는지 IA/UI 문서와 일치하는가
- mock adapter 함수명과 실제 구현명이 다르면 7장과 8장을 갱신했는가
- 구현 중 추가된 환경변수가 `.env.example`과 문서에 반영되었는가

## 10. 로컬 MVP 완료 기준

아래 항목이 모두 충족되면 로컬 MVP 완료로 봅니다.

- `npm run dev`로 로컬 서버가 실행된다.
- `npm run verify`가 통과한다.
- `npm run verify:ci`가 통과한다.
- `npm run audit`가 low 이상 취약점 없이 통과한다.
- `npm run test`가 통과한다.
- `npm run check`가 통과한다.
- `npm run build`가 통과한다.
- `npm run test:e2e`가 데스크톱/모바일 랜딩, `/terms`/`/privacy`, 공개 페이지 canonical, `/robots.txt`/`/sitemap.xml`, 전역 오류 화면, 비색인 meta, 진행 중 새로고침 복구, 20문항 완료, 결과 새로고침 복구, sessionStorage fallback, 결과 없음 CTA를 검증한다.
- `npm run test:e2e:chrome`이 시스템 Chrome의 데스크톱/모바일 뷰포트에서 동일 흐름을 검증한다.
- 랜딩에서 테스트를 시작할 수 있다.
- 20문항이 문서에 정의된 순서와 분기 규칙대로 진행된다.
- 새로고침 시 진행 중인 테스트가 복구된다.
- `/api/next-question` 응답에 내부 알고리즘 필드가 노출되지 않는다.
- `/api/submit-result`가 서버 재계산 결과를 반환한다.
- Supabase 없이 mock result ID가 생성된다.
- `/result/[id]/+page.server.ts`에서 mock result ID 조회가 가능하다.
- 결과 페이지가 같은 세션의 `sessionStorage` fallback으로 복구된다.
- 결과 데이터가 없을 때 다시 시작 CTA가 표시된다.
- SvelteKit dev 런타임에서는 Turnstile 없이 local mock token으로 결과 제출이 가능하다.
- 결과 화면에 유형명, 설명, 4축 점수, 궁합, 캐릭터 placeholder가 표시된다.
- `/terms`, `/privacy` 최소 정적 페이지가 렌더링된다.
- `/`, `/terms`, `/privacy`에 canonical URL이 적용된다.
- `/robots.txt`, `/sitemap.xml`이 공개 정적 라우트만 노출한다.
- `/test`, `/result/[id]`, 전역 오류 화면에 비색인 robots meta가 적용된다.
- 실제 캐릭터 PNG가 없어도 타입 코드 기반 인라인 SVG 일러스트가 결과 카드에 표시된다.
- 이미지 저장 또는 캡처 대상 영역이 깨지지 않는다.
- 로컬 MVP 실행에 도메인, Cloudflare 배포, Supabase 프로젝트가 필요하지 않다.

## 11. 실제 MVP 전환 시 교체 지점

로컬 MVP에서 실제 MVP로 넘어갈 때는 아래 부분만 교체하는 것을 목표로 합니다.

| 로컬 MVP | 실제 MVP |
|---|---|
| `mock-results.ts` | Supabase insert adapter |
| `mock-turnstile.ts` | Cloudflare Turnstile server verification |
| 타입 코드 placeholder 캐릭터 | 실제 `character_{type_code}.png` |
| 로컬 dev server | Cloudflare Pages/Functions 배포 |
| `PUBLIC_APP_BASE_URL=http://127.0.0.1:5173` | 실제 도메인 |
| 최소 약관/개인정보 페이지 | 운영 주체, 문의처, 실제 수집 항목 반영 |
| 로컬 robots/sitemap | 실제 도메인 기준 Search Console 제출 |

반대로 아래는 실제 MVP 전환 시에도 바꾸지 않습니다.

- 문항 데이터 스키마
- API request/response 계약
- 점수 계산 알고리즘
- 결과 매핑 구조
- 프론트엔드 주요 화면 흐름

## 12. 참고 문서

- `01_PRD_제품요구사항정의서`: 제품 목표와 MVP 기능 요구사항
- `10_문항_및_분기_로직_설계서`: 문항 풀, 분기, 점수, S/M 알고리즘
- `11_결과지_텍스트_맵핑_문서`: 16개 결과 유형 카피
- `20_UIUX_화면설계서_Wireframe`: 화면 구성
- `21_디자인_시스템_가이드`: CSS 변수와 컴포넌트 스타일 기준
- `22_에셋_및_캐릭터_명세서`: 캐릭터 파일명과 placeholder 정책
- `31_API_데이터_스키마_명세서`: API 계약
- `32_DB스키마_및_RLS정책서`: 실제 MVP 전환 시 Supabase 스키마

## 13. 현재 구현 완료 기록

2026-06-22 기준 본 문서의 로컬 MVP 범위는 구현 및 검증 완료 상태입니다.

| 항목 | 결과 |
|---|---|
| SvelteKit 앱 기반 | 구현 완료 |
| 44개 알고리즘 슬롯, 132개 후보 문항 | `questions.ko-KR.ts` 구현 |
| 16개 결과 매핑 | `result-mappings.ko-KR.ts` 구현 |
| 16유형 S/M 도달성 | `type-coverage.test.ts` 통과 |
| 문항/결과 카피 품질 | `question-quality.test.ts` 통과 |
| mock 저장 | `mock-results.ts` 구현 |
| mock Turnstile | `mock-turnstile.ts` 구현 |
| Cloudflare adapter | `@sveltejs/adapter-cloudflare` 적용 및 `npm run build` 통과 |
| 의존성 audit | `@sveltejs/kit` 하위 `cookie`를 `0.7.2`로 override하고 `npm run audit` 통과 |
| sessionStorage 복구 | 구현 및 E2E 통과 |
| Chrome 브라우저 검증 | `npm run test:e2e:chrome` 통과 |

최신 검증 명령:

```bash
npm run verify
npm run verify:ci
npm run test:e2e
npm run test:e2e:chrome
```
