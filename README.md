# Poldigm Local MVP

Poldigm은 20문항으로 사용자의 사회적·정치적 가치관 스펙트럼을 확인하는 SvelteKit 로컬 MVP입니다.

## 로컬 실행

```bash
npm ci
npm run dev
```

기본 개발 서버는 `http://127.0.0.1:5173`에서 실행됩니다.

## 검증 명령

```bash
npm run verify
npm run verify:ci
npm run verify:e2e
npm run test:e2e:managed
npm run test:e2e
npm run test:e2e:chrome
```

검증 범위:

- `npm run verify`: `check`, `audit`, `test`, `build`를 순서대로 실행
- `npm run verify:ci`: `verify` 이후 Playwright 관리 브라우저 프로젝트만 실행
- `npm run verify:e2e`: Playwright 전체 브라우저 플로우 검증
- `npm run check`: SvelteKit 타입/컴포넌트 진단
- `npm run audit`: low 이상 npm audit 취약점 확인
- `npm run test`: 알고리즘, API, 공유 유틸, 결과 표시, 문항 품질, 문서 정합성 검증
- `npm run build`: 프로덕션 빌드 가능 여부 확인
- `npm run test:e2e:managed`: Playwright 관리 브라우저 데스크톱/모바일 검증
- `npm run test:e2e`: Playwright 전체 브라우저 플로우 검증
- `npm run test:e2e:chrome`: 시스템 Chrome 데스크톱/모바일 핵심 플로우 검증

`npm run test:e2e`는 Playwright 설정의 전체 프로젝트를 실행하므로 관리 브라우저와 시스템 Chrome 프로젝트를 모두 포함합니다. 새 환경에서 관리 브라우저가 없으면 `npx playwright install chromium`을 먼저 실행합니다. 시스템 Chrome만 별도로 확인하려면 `npm run test:e2e:chrome`, 관리 브라우저만 빠르게 확인하려면 `npm run test:e2e:managed`를 사용합니다.

GitHub Actions는 `.github/workflows/verify.yml`에서 `npm ci`, Playwright Chromium 설치, `npm run verify:ci`를 실행합니다.

`npm run build`는 프로덕션 빌드 산출물을 만들 수 있는지 확인하는 명령입니다. 현재 로컬 MVP에서 `npm run preview`나 production build로 결과 제출까지 완료하려면 실제 Cloudflare Turnstile server verification adapter가 필요합니다. 20문항 결과 제출 플로우 검증은 `npm run dev` 또는 Playwright가 띄우는 dev server 기준으로 수행합니다.

## 로컬 MVP 범위

- `/`, `/test`, `/result/[id]`, `/terms`, `/privacy` 화면
- `/robots.txt`, `/sitemap.xml` SEO 최소 endpoint
- `/api/next-question`, `/api/submit-result` SvelteKit 서버 API
- 서버 전용 44개 알고리즘 슬롯, 132개 후보 문항, 20문항 분기 흐름
- `questionSeed` 기반 슬롯 내 문항 variant 선택과 새로고침 복구
- `display.promptLines`, 선택지 label/body/highlights 기반 문항 렌더링
- 16개 결과 유형 매핑과 결과 카드 렌더링
- 원점수 100/0을 그대로 노출하지 않는 결과 게이지 표시 보정
- 선택 닉네임의 브라우저 세션 저장 및 결과 화면 개인화
- Supabase 없이 메모리 mock 저장소 사용
- SvelteKit dev 런타임에서만 실제 Turnstile 없이 `local-mock-token`으로 검증 통과
- SvelteKit `adapter-cloudflare` 빌드 설정 적용
- `@sveltejs/kit` 하위 `cookie` 의존성은 npm audit 대응을 위해 `0.7.2`로 override

## 로컬 MVP 제외

- Cloudflare Pages 실제 배포
- Supabase `test_results` 저장 adapter와 RLS 검증
- 실제 Cloudflare Turnstile 서버 검증
- 실제 도메인, 운영용 OG 이미지, 광고/분석 스크립트

자세한 구현 기준은 [docs/33_로컬_MVP_구현_계획서.md](docs/33_로컬_MVP_구현_계획서.md)를 기준으로 봅니다. 문항 랜덤화와 결과 표시 정책은 [docs/12_문항_랜덤화_및_결과_표시_정책.md](docs/12_문항_랜덤화_및_결과_표시_정책.md), `/api/next-question` variant 계약은 [docs/13_API_문항_variant_보강_명세.md](docs/13_API_문항_variant_보강_명세.md)에 정리되어 있습니다.
