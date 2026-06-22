import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { allQuestions, questions } from '../../src/lib/server/data/questions.ko-KR';
import { resultMappings } from '../../src/lib/server/data/result-mappings.ko-KR';
import packageJson from '../../package.json';

const root = process.cwd();

function read(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

function markdownDocs() {
  return readdirSync(join(root, 'docs'))
    .filter((file) => file.endsWith('.md'))
    .sort();
}

function filesUnder(dir: string, extensions: string[]): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const relativePath = `${dir}/${entry.name}`;
    if (entry.isDirectory()) return filesUnder(relativePath, extensions);
    if (extensions.some((extension) => entry.name.endsWith(extension))) return [relativePath];
    return [];
  });
}

describe('documentation consistency', () => {
  it('lists every docs markdown file in the document index', () => {
    const index = read('docs/00_문서목록_Index.md');

    const missing = markdownDocs().filter((file) => !index.includes(file.replace(/\.md$/, '')));

    expect(missing).toEqual([]);
  });

  it('keeps each docs H1 number aligned with its filename number', () => {
    const mismatches = markdownDocs().flatMap((file) => {
      const source = read(`docs/${file}`);
      const firstLine = source.split(/\r?\n/)[0] ?? '';
      const fileNumber = file.match(/^(\d{2})_/)?.[1];

      if (!fileNumber) return [`${file}: missing numeric filename prefix`];
      if (!firstLine.startsWith('# ')) return [`${file}: missing H1 on first line`];
      if (!firstLine.includes(fileNumber)) return [`${file}: H1 does not include ${fileNumber}`];

      return [];
    });

    expect(mismatches).toEqual([]);
  });

  it('keeps the design, asset, architecture, and API docs in their intended roles', () => {
    const designDoc = read('docs/21_디자인_시스템_가이드.md');
    const assetDoc = read('docs/22_에셋_및_캐릭터_명세서.md');
    const architectureDoc = read('docs/30_시스템_아키텍처_설계서.md');
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');

    expect(designDoc).toContain('CSS 변수');
    expect(designDoc).toContain('타이포그래피');
    expect(designDoc).not.toContain('/api/next-question');
    expect(designDoc).not.toContain('/api/submit-result');

    expect(assetDoc).toContain('character_{type_code}.png');
    expect(assetDoc).toContain('16개');
    expect(assetDoc).toContain('공유 이미지');
    expect(assetDoc).not.toContain('POST /api/next-question');

    expect(architectureDoc).toContain('Cloudflare Pages');
    expect(architectureDoc).toContain('adapter-cloudflare');
    expect(architectureDoc).toContain('로컬 MVP 구현 예외');
    expect(architectureDoc).toContain('questions.ko-KR.ts');

    expect(apiDoc).toContain('POST /api/next-question');
    expect(apiDoc).toContain('POST /api/submit-result');
    expect(apiDoc).toContain('"resultViewModel"');
    expect(apiDoc).toContain('서버 전용 모듈에서 관리');
  });

  it('keeps docs and user-facing source files free of mojibake', () => {
    const files = [
      'README.md',
      ...markdownDocs().map((file) => `docs/${file}`),
      ...filesUnder('src', ['.svelte', '.ts', '.html'])
    ];
    const mojibakePatterns = [/�/, /[一-鿿]/, /李|諛|怨|媛|踰|寃|臾|醫|援|履/];
    const matches = files.flatMap((file) => {
      const source = read(file);
      return mojibakePatterns
        .filter((pattern) => pattern.test(source))
        .map((pattern) => `${file}: ${pattern}`);
    });

    expect(matches).toEqual([]);
  });

  it('keeps stale implementation-status phrases out of active docs and UI copy', () => {
    const stalePatterns = [
      /100개 후보/,
      /44개 서버 슬롯/,
      /placeholder 문항/,
      /49개 테스트/,
      /77개 테스트/,
      /78개 테스트/,
      /79개 테스트/,
      /80개 테스트/,
      /81개 테스트/,
      /82개 테스트/,
      /83개 테스트/,
      /84개 테스트/,
      /2026-06-21 기준/,
      /Step 1\. SvelteKit 스캐폴딩/,
      /SvelteKit 스캐폴딩과 첫 구현이 끝나면/,
      /SvelteKit 스캐폴딩 \| 완료/,
      /구현 순서, 완료 기준/,
      /Svelte scoped CSS/,
      /TypeScript\/Svelte 검증/,
      /questions\.json/,
      /TS\/JSON/,
      /JSON\/TS/,
      /questions\.ko-KR\.ts\/json/,
      /질문 풀/,
      /서버 전용 질문/,
      /질문 데이터/,
      /질문 파일/,
      /^Plaintext$/m,
      /문항을 JSON 풀에서/,
      /MVP 문항 풀은 44개/,
      /질문 선택/,
      /질문 텍스트/,
      /심층 질문 텍스트/,
      /공개 질문 표시 모델/,
      /공개 질문 응답 타입/,
      /더 이상 질문을 반환/,
      /2줄 질문/,
      /다음 질문의 뎁스/,
      /꼬리 질문/,
      /질문 본문/,
      /질문 화면/,
      /테스트 질문 사이/,
      /순수 텍스트만 프론트엔드로 전달/,
      /텍스트 데이터만 \[Client\]로 응답/,
      /localhost/,
      /localhost:5173/,
      /`localhost`에서/,
      /`localhost` 실행/,
      /로컬에서는 검증 성공으로 mock 처리/
    ];
    const files = [
      '.env.example',
      'README.md',
      'src/lib/constants/runtime.ts',
      'src/lib/server/algorithm/validation.ts',
      'src/routes/+page.svelte',
      ...markdownDocs().map((file) => `docs/${file}`)
    ];

    const matches = files.flatMap((file) => {
      const source = read(file);
      return stalePatterns
        .filter((pattern) => pattern.test(source))
        .map((pattern) => `${file}: ${pattern.source}`);
    });

    expect(matches).toEqual([]);
  });

  it('keeps the public candidate-count copy aligned across landing and docs', () => {
    const expectedCopy = `${allQuestions.length}개 후보`;
    const files = [
      'README.md',
      'src/routes/+page.svelte',
      'docs/01_PRD_제품요구사항정의서.md',
      'docs/10_문항_및_분기_로직_설계서.md',
      'docs/12_문항_랜덤화_및_결과_표시_정책.md',
      'docs/13_API_문항_variant_보강_명세.md',
      'docs/20_UIUX_화면설계서_Wireframe.md'
    ];

    for (const file of files) {
      expect(read(file), file).toContain(expectedCopy);
    }
  });

  it('keeps the algorithm slot count aligned with the server question data', () => {
    const expectedCopy = `${questions.length}개 알고리즘 슬롯`;
    const files = [
      'README.md',
      'docs/01_PRD_제품요구사항정의서.md',
      'docs/10_문항_및_분기_로직_설계서.md',
      'docs/12_문항_랜덤화_및_결과_표시_정책.md',
      'docs/13_API_문항_variant_보강_명세.md',
      'docs/30_시스템_아키텍처_설계서.md',
      'docs/33_로컬_MVP_구현_계획서.md',
      'docs/90_문서별_상세_분석표.md'
    ];

    for (const file of files) {
      expect(read(file), file).toContain(expectedCopy);
    }
  });

  it('keeps the documented local URL aligned with the dev server host', () => {
    expect(packageJson.scripts.dev).toContain('--host 127.0.0.1');

    const expectedUrl = 'http://127.0.0.1:5173';
    const files = [
      'README.md',
      '.env.example',
      'src/lib/constants/runtime.ts',
      'docs/00_문서목록_Index.md',
      'docs/01_PRD_제품요구사항정의서.md',
      'docs/33_로컬_MVP_구현_계획서.md',
      'docs/34_SEO_및_광고_노출_정책서.md'
    ];

    for (const file of files) {
      expect(read(file), file).toContain(expectedUrl);
    }
  });

  it('keeps documented environment variables aligned with runtime defaults and deployment docs', () => {
    const envExample = read('.env.example');
    const runtime = read('src/lib/constants/runtime.ts');
    const architectureDoc = read('docs/30_시스템_아키텍처_설계서.md');
    const localMvpDoc = read('docs/33_로컬_MVP_구현_계획서.md');
    const expectedVars = [
      'PUBLIC_APP_ENV',
      'PUBLIC_APP_BASE_URL',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'TURNSTILE_SECRET_KEY',
      'PUBLIC_TURNSTILE_SITE_KEY'
    ];

    for (const envName of expectedVars) {
      expect(envExample, envName).toContain(`${envName}=`);
      expect(localMvpDoc, envName).toContain(envName);
    }

    for (const envName of expectedVars.slice(2)) {
      expect(architectureDoc, envName).toContain(envName);
    }

    expect(runtime).toContain("env.PUBLIC_APP_ENV || 'local'");
    expect(runtime).toContain("env.PUBLIC_APP_BASE_URL || 'http://127.0.0.1:5173'");
    expect(envExample).not.toContain('PUBLIC_SUPABASE_SERVICE_ROLE_KEY');
    expect(envExample).not.toContain('PUBLIC_TURNSTILE_SECRET_KEY');
  });

  it('keeps local Turnstile mock restricted to local dev runtime', () => {
    const turnstileMock = read('src/lib/server/bot/mock-turnstile.ts');
    const testPage = read('src/routes/test/+page.svelte');
    const readme = read('README.md');
    const index = read('docs/00_문서목록_Index.md');
    const iaDoc = read('docs/03_IA_정보구조_설계서.md');
    const architectureDoc = read('docs/30_시스템_아키텍처_설계서.md');
    const localMvpDoc = read('docs/33_로컬_MVP_구현_계획서.md');
    const analysis = read('docs/90_문서별_상세_분석표.md');

    expect(turnstileMock).toContain("from '$app/environment'");
    expect(turnstileMock).toContain('options.isDev && options.isLocal');
    expect(testPage).toContain("from '$app/environment'");
    expect(testPage).toContain("dev && isLocalApp ? 'local-mock-token' : ''");
    expect(readme).toContain('SvelteKit dev 런타임에서만 실제 Turnstile 없이');
    expect(readme).toContain('`npm run preview`나 production build로 결과 제출까지 완료하려면');
    expect(index).toContain('SvelteKit dev 런타임에서만 실제 Turnstile 없이');
    expect(iaDoc).toContain('SvelteKit dev 런타임 local mock token');
    expect(localMvpDoc).toContain('production build에서는 `PUBLIC_APP_ENV`가 잘못 `local`로 설정되어도');
    expect(localMvpDoc).toContain('클라이언트는 SvelteKit dev 런타임에서만');
    expect(localMvpDoc).toContain('`npm run preview` 또는 production build에서 `/api/submit-result`까지 완료하려면');
    expect(localMvpDoc).toContain('production build나 `npm run preview`에서는 mock token을 보내지 않으므로');
    expect(localMvpDoc).toContain('production build에서는 `PUBLIC_APP_ENV=local`이더라도');
    expect(architectureDoc).toContain('SvelteKit dev 런타임에서만 `mock-turnstile.ts`');
    expect(analysis).toContain('production build mock 차단');
  });

  it('keeps documented local routes backed by SvelteKit route files', () => {
    const routeFiles = [
      'src/routes/+page.svelte',
      'src/routes/+error.svelte',
      'src/routes/test/+page.svelte',
      'src/routes/result/[id]/+page.svelte',
      'src/routes/result/[id]/+page.server.ts',
      'src/routes/terms/+page.svelte',
      'src/routes/privacy/+page.svelte',
      'src/routes/robots.txt/+server.ts',
      'src/routes/sitemap.xml/+server.ts',
      'src/routes/api/next-question/+server.ts',
      'src/routes/api/submit-result/+server.ts'
    ];

    for (const routeFile of routeFiles) {
      expect(existsSync(join(root, routeFile)), routeFile).toBe(true);
    }

    const index = read('docs/00_문서목록_Index.md');
    expect(index).toContain('/terms');
    expect(index).toContain('/privacy');

    const resultServer = read('src/routes/result/[id]/+page.server.ts');
    const resultPage = read('src/routes/result/[id]/+page.svelte');
    const sessionClient = read('src/lib/client/session.ts');
    const iaDoc = read('docs/03_IA_정보구조_설계서.md');
    const uiDoc = read('docs/20_UIUX_화면설계서_Wireframe.md');
    const localMvpDoc = read('docs/33_로컬_MVP_구현_계획서.md');
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');

    expect(existsSync(join(root, 'src/routes/analysis'))).toBe(false);
    expect(iaDoc).toContain('현재 로컬 MVP에서는 별도 라우트를 만들지 않고 `/test` 내부 로딩 상태로 대체합니다.');
    expect(iaDoc).toContain('현재 로컬 MVP에서는 구현 단순화를 위해 `/test` 내부의 임시 로딩 상태로 대체한다.');
    expect(uiDoc).toContain('현재 로컬 MVP에서는 `/analysis`를 별도 라우트로 만들지 않고 `/test` 화면 내부의 임시 로딩 상태로 구현합니다.');
    expect(resultServer).toContain('getLocalResult(params.id)');
    expect(resultServer).toContain('resultId: params.id');
    expect(resultPage).toContain('fallback?.resultId === data.resultId');
    expect(resultPage).toContain('저장된 결과를 찾을 수 없어요.');
    expect(sessionClient).toContain('export function isAnswerHistoryItem');
    expect(sessionClient).toContain('export function isPublicResult');
    expect(sessionClient).toContain('return Array.isArray(parsed) && parsed.every(isAnswerHistoryItem) ? parsed : []');
    expect(sessionClient).toContain('AXIS_SIDES[AXIS_ORDER[index]]');
    expect(sessionClient).toContain('buildAxisGaugeView({');
    expect(sessionClient).toContain('keys.length === SCORE_LETTERS.length');
    expect(sessionClient).toContain('value >= 0 && value <= 100');
    expect(sessionClient).toContain('gauge.leftPercent === expectedGauge.leftPercent');
    expect(sessionClient).toContain('hasValidAxisGauges(viewModel.axisGauges, scores)');
    expect(sessionClient).toContain('isTypeCode(viewModel.chemistryBest)');
    expect(sessionClient).toContain('isTypeCode(viewModel.chemistryWorst)');
    expect(sessionClient).toContain('viewModel.characterImg === `character_${viewModel.typeCode}.png`');
    expect(localMvpDoc).toContain('PublicResult` 최소 shape, 공식 8개 점수 키와 0~100 정수 점수값, `scores`에서 재계산한 `axisGauges`, `winnerPercent`, 방향 라벨, 강도 라벨, 궁합 유형 코드, `character_{typeCode}.png` 파일명 계약 일치 검증을 통과하면');
    expect(localMvpDoc).toContain('공식 점수 키 외 추가 키, 음수/100 초과/소수 점수값');
    expect(localMvpDoc).toContain('AnswerHistoryItem` 최소 shape 검증을 통과한 응답 이력만 사용');
    expect(iaDoc).toContain('응답 이력이 AnswerHistoryItem 최소 shape를 통과하면');
    expect(iaDoc).toContain('fallback의 resultId, PublicResult 최소 shape, 공식 8개 점수 키와 0~100 정수 점수값, scores와 axisGauges 계산 일치, 궁합 유형 코드, 캐릭터 파일명 계약이 맞으면');
    expect(iaDoc).toContain('공식 8개 점수 키와 0~100 정수 점수값, `scores`에서 재계산한 `axisGauges`, `winnerPercent`, 방향 라벨, 강도 라벨, `chemistryBest`/`chemistryWorst` 유형 코드, `character_{typeCode}.png` 파일명 계약이 모두 일치할 때만 사용');
    expect(apiDoc).toContain('mock-results.ts`의 `getLocalResult(id)`');
  });

  it('keeps the documented install command aligned with the npm lockfile', () => {
    expect(existsSync(join(root, 'package-lock.json'))).toBe(true);

    const files = ['README.md', 'docs/33_로컬_MVP_구현_계획서.md'];

    for (const file of files) {
      const source = read(file);
      expect(source, file).toContain('npm ci');
      expect(source, file).not.toContain('npm install');
    }
  });

  it('keeps the SvelteKit adapter aligned with the Cloudflare architecture', () => {
    const config = read('svelte.config.js');

    expect(packageJson.devDependencies).toHaveProperty('@sveltejs/adapter-cloudflare');
    expect(packageJson.devDependencies).not.toHaveProperty('@sveltejs/adapter-auto');
    expect(config).toContain("from '@sveltejs/adapter-cloudflare'");
    expect(config).not.toContain('@sveltejs/adapter-auto');
  });

  it('keeps the audited SvelteKit cookie override scoped to SvelteKit', () => {
    expect(packageJson.overrides).toEqual({
      '@sveltejs/kit': {
        cookie: '0.7.2'
      }
    });
  });

  it('keeps the GitHub Actions verification workflow aligned with npm scripts', () => {
    const workflow = read('.github/workflows/verify.yml');

    expect(packageJson.scripts).toHaveProperty('verify:ci');
    expect(packageJson.scripts['verify:e2e']).toBe('npm run test:e2e');
    expect(packageJson.scripts['verify:ci']).toBe('npm run verify && npm run test:e2e:managed');
    expect(packageJson.scripts).toHaveProperty('test:e2e:managed');
    expect(workflow).toContain('node-version: 22');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('npx playwright install --with-deps chromium');
    expect(workflow).toContain('npm run verify:ci');
  });

  it('keeps documented verification result counts aligned with current gates', () => {
    const qaReport = read('docs/35_문항_QA_및_16유형_검증_리포트.md');
    const analysis = read('docs/90_문서별_상세_분석표.md');
    const logicDoc = read('docs/10_문항_및_분기_로직_설계서.md');

    expect(qaReport).toContain('| `npm run test` | 99개 테스트 통과 |');
    expect(qaReport).toContain('| `npm run test:e2e:managed` | 20개 관리 브라우저 E2E 통과 |');
    expect(qaReport).toContain('| `npm run test:e2e` | 40개 E2E 통과 |');
    expect(qaReport).toContain('| `npm run test:e2e:chrome` | 20개 Chrome E2E 통과 |');
    expect(qaReport).toContain('`tests/shared/result-display.test.ts`');
    expect(qaReport).toContain('결과 게이지 퍼센트 보정, 방향 라벨, 강도 라벨, 모지바케 방지 확인');
    expect(analysis).toContain('| 단위/API/클라이언트 테스트 | `npm run test` 99개 |');
    expect(analysis).toContain('| 관리 브라우저 E2E | `npm run test:e2e:managed` |');
    expect(analysis).toContain('| 전체 E2E | `npm run test:e2e` |');
    expect(analysis).toContain('| 시스템 Chrome E2E | `npm run test:e2e:chrome` |');

    for (const command of [
      'npm run verify',
      'npm run verify:ci',
      'npm run audit',
      'npm run build',
      'npm run test:e2e:managed',
      'npm run test:e2e',
      'npm run test:e2e:chrome'
    ]) {
      expect(logicDoc).toContain(command);
    }
  });

  it('keeps documented npm run commands backed by package scripts', () => {
    const documentedFiles = ['README.md', ...markdownDocs().map((file) => `docs/${file}`)];
    const missingScripts = documentedFiles.flatMap((file) => {
      const source = read(file);
      const commands = [...source.matchAll(/npm run ([a-zA-Z0-9:_-]+)/g)].map((match) => match[1]);

      return commands
        .filter((command) => !(command in packageJson.scripts))
        .map((command) => `${file}: npm run ${command}`);
    });

    expect(missingScripts).toEqual([]);
  });

  it('keeps local generated artifacts ignored by git', () => {
    const gitignore = read('.gitignore');
    const gitattributes = read('.gitattributes');
    const ignoredPaths = [
      '.env',
      '.env.*',
      '.obsidian/',
      '.svelte-kit/',
      '.wrangler/',
      '.vercel/',
      '.netlify/',
      'build/',
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'tmp/'
    ];

    for (const ignoredPath of ignoredPaths) {
      expect(gitignore, ignoredPath).toContain(ignoredPath);
    }

    expect(gitattributes).toContain('* text=auto eol=lf');
    expect(gitattributes).toContain('*.png binary');
  });

  it('keeps the result mapping document aligned with server result mappings', () => {
    const resultDoc = read('docs/11_결과지_텍스트_맵핑_문서.md');
    const assetDoc = read('docs/22_에셋_및_캐릭터_명세서.md');

    for (const mapping of resultMappings) {
      const expectedRow = [
        `| \`${mapping.type_code}\` |`,
        mapping.title,
        mapping.subtitle,
        `\`${mapping.chemistry_best}\``,
        `\`${mapping.chemistry_worst}\``
      ];

      for (const expectedCopy of expectedRow) {
        expect(resultDoc, `${mapping.type_code}: ${expectedCopy}`).toContain(expectedCopy);
      }

      expect(assetDoc, `${mapping.type_code} asset slot`).toContain(`| \`${mapping.type_code}\``);
      expect(assetDoc, `${mapping.type_code} asset filename`).toContain(`\`${mapping.character_img}\``);
    }
  });

  it('keeps API question examples aligned with the current copy tone', () => {
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');
    const logicDoc = read('docs/10_문항_및_분기_로직_설계서.md');

    expect(apiDoc).not.toContain('찬성한다.');
    expect(apiDoc).not.toContain('반대한다.');
    expect(apiDoc).not.toContain('공동 안전을 이유로 개인 정보 일부를 임시로 모아야 하는 상황입니다.');
    expect(apiDoc).toContain('위험이 분명하다면, 한시적인 정보 수집은 받아들일 수 있다.');
    expect(logicDoc).toContain('피해야 할 prompt');
    expect(logicDoc).toContain('표시용 `display` 예시');
    expect(logicDoc).toContain('`display.promptLines`');
    expect(logicDoc).toContain('`display.choices.A.label`');
    expect(logicDoc).toContain('리라이팅 시에는 `id`, `axis`, `phase`, `branchCondition`, `scoreEffect`, `intensityEffect`를 바꾸지 않고 `prompt`, `choices`, `display`만 수정합니다.');
  });

  it('keeps the result display percent contract documented as a view model field', () => {
    const prdDoc = read('docs/01_PRD_제품요구사항정의서.md');
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');
    const randomizationDoc = read('docs/12_문항_랜덤화_및_결과_표시_정책.md');
    const uiDoc = read('docs/20_UIUX_화면설계서_Wireframe.md');
    const resultCapture = read('src/lib/components/result/ResultCapture.svelte');
    const axisGauge = read('src/lib/components/result/AxisGauge.svelte');

    expect(prdDoc).toContain('표시용 경향 퍼센트(%) 게이지');
    expect(prdDoc).toContain('원점수 `scores`를 그대로 노출하지 않고 `resultViewModel.axisGauges`의 완화된 표시값을 사용');
    expect(prdDoc).not.toContain('득점 퍼센트(%) 게이지');
    expect(apiDoc).toContain('"axisGauges"');
    expect(apiDoc).toContain('scores`는 결과 코드 산출과 저장을 위한 원점수입니다.');
    expect(randomizationDoc).toContain('resultViewModel.axisGauges');
    expect(randomizationDoc).toContain('UI는 이 값을 렌더링하며');
    expect(randomizationDoc).toContain('각 축의 양쪽 표시용 퍼센트');
    expect(uiDoc).toContain('왼쪽/오른쪽 퍼센트를 함께 렌더링');
    expect(resultCapture).toContain('result.resultViewModel.axisGauges');
    expect(resultCapture).toContain('<AxisGauge left={gauge.left} right={gauge.right} view={gauge} />');
    expect(resultCapture).not.toContain('scores={result.scores}');
    expect(axisGauge).toContain('rightDisplayPercent = 100 - leftDisplayPercent');
  });

  it('keeps API optional metadata contracts aligned with server parsing', () => {
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');
    const logicDoc = read('docs/10_문항_및_분기_로직_설계서.md');
    const nextQuestionTest = read('tests/api/next-question.test.ts');
    const requestParser = read('src/lib/server/api/request.ts');
    const nextQuestionServer = read('src/routes/api/next-question/+server.ts');
    const submitResultServer = read('src/routes/api/submit-result/+server.ts');

    expect(requestParser).toContain('request body는 올바른 JSON이어야 합니다.');
    expect(requestParser).toContain('request body는 JSON object여야 합니다.');
    expect(nextQuestionServer).toContain('readJsonObject(request)');
    expect(submitResultServer).toContain('readJsonObject(request)');
    expect(apiDoc).toContain('잘못된 JSON');
    expect(apiDoc).toContain('JSON object가 아닌 body');

    expect(nextQuestionServer).toContain('body.questionSeed.slice(0, 80)');
    expect(apiDoc).toContain('앞 80자까지만 사용');
    expect(apiDoc).toContain('`scoreEffect`, `branchCondition`, `intensityEffect`, `metadata`, 배점 값');
    expect(logicDoc).toContain('`scoreEffect`, `branchCondition`, `intensityEffect`, `metadata`가 `/api/next-question` 공개 응답 어디에도 노출되지 않는지 재귀 검증');
    expect(nextQuestionTest).toContain('function expectNoInternalQuestionFields');
    expect(nextQuestionTest).toContain('expectNoInternalQuestionFields(nested)');

    for (const deviceType of ['Mobile', 'Desktop', 'Tablet']) {
      expect(submitResultServer).toContain(`value === '${deviceType}'`);
      expect(apiDoc).toContain(deviceType);
    }

    expect(apiDoc).toContain('그 외 값은 결과 산출을 막지 않고 저장 메타데이터에서 제외');
    expect(submitResultServer).toContain("typeof body.utmSource === 'string'");
    expect(apiDoc).toContain('문자열일 때만 저장 메타데이터에 포함');
  });

  it('keeps question variant docs aligned with metadata balancing', () => {
    const logicDoc = read('docs/10_문항_및_분기_로직_설계서.md');
    const randomizationDoc = read('docs/12_문항_랜덤화_및_결과_표시_정책.md');
    const variantDoc = read('docs/13_API_문항_variant_보강_명세.md');
    const questionAlgorithm = read('src/lib/server/algorithm/questions.ts');
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');

    expect(logicDoc).toContain('세션 내 `copyFamily` 사용량을 먼저 보정');
    expect(logicDoc).toContain('최근 3문항의 `scenarioTag`, `toneTag` 반복을 피한 뒤');
    expect(randomizationDoc).toContain('최근 3문항에서 반복된 `scenarioTag`, `toneTag` 후보를 뒤로');
    expect(variantDoc).toContain('최근 3문항에서 반복된 `scenarioTag`, `toneTag` 후보를 뒤로');
    expect(apiDoc).toContain('`scenarioTag`는 슬롯 ID가 아니라');
    expect(apiDoc).toContain('"scenarioTag": "privacy"');
    expect(apiDoc).not.toContain('"scenarioTag": "c_i-phase1-1"');
    expect(questionAlgorithm).toContain('scenarioTags.set(metadata.scenarioTag');
    expect(questionAlgorithm).toContain('recentScenarioCount');
    expect(questionAlgorithm).toContain('a.recentScenarioCount - b.recentScenarioCount');
    expect(questionAlgorithm).toContain('a.scenarioCount - b.scenarioCount');
  });

  it('keeps the question expansion and randomized exposure guidance explicit', () => {
    const randomizationDoc = read('docs/12_문항_랜덤화_및_결과_표시_정책.md');

    expect(randomizationDoc).toContain('Phase 1의 8개 슬롯은 전체 축의 초기 기울기를 잡는 기준점');
    expect(randomizationDoc).toContain('Phase 2 후보를 축별로 고르게 보강');
    expect(randomizationDoc).toContain('같은 `axis`가 3회 이상 연속 노출되지 않아야 합니다.');
    expect(randomizationDoc).toContain('동일한 `questionSeed`와 동일한 `history`에서는 항상 같은 다음 문항');
    expect(randomizationDoc).toContain('사용자가 체감하는 다양성은 같은 슬롯 안의 variant 선택');
    expect(randomizationDoc).toContain('20문항 노출 수를 늘리기보다 기존 44개 알고리즘 슬롯 안의 variant를 축별로 고르게 추가');
    expect(randomizationDoc).toContain('더 많은 문항을 묻기”가 아니라 “같은 20문항 흐름 안에서 덜 반복적으로 느껴지는 문항 경험');
    expect(read('docs/13_API_문항_variant_보강_명세.md')).toContain('공개 문항 표시 모델');
    expect(read('docs/13_API_문항_variant_보강_명세.md')).toContain('## 4. 공개 문항 응답 타입');
    expect(read('docs/31_API_데이터_스키마_명세서.md')).toContain('더 이상 문항을 반환하지 않고 완료 응답');
    expect(read('docs/31_API_데이터_스키마_명세서.md')).toContain('사용자에게 보여줄 2줄 문항');
  });

  it('keeps the softened result percent guidance explicit', () => {
    const randomizationDoc = read('docs/12_문항_랜덤화_및_결과_표시_정책.md');

    expect(randomizationDoc).toContain('C 88 : I 12');
    expect(randomizationDoc).toContain('숫자만 단독으로 강조하지 않고, 각 축의 양쪽 표시용 퍼센트와 방향 라벨, 강도 라벨');
    expect(randomizationDoc).toContain('“100% 어떤 사람”처럼 단정하는 것이 아니라');
    expect(randomizationDoc).toContain('정확도나 정답률이 아닙니다');
    expect(randomizationDoc).toContain('내부 계산에 쓰이는 원점수 `C 100 : I 0`을 그대로 노출하지 않기 위한 완화 정책');
  });

  it('keeps privacy docs aligned on nickname, IP, and country-code handling', () => {
    const apiDoc = read('docs/31_API_데이터_스키마_명세서.md');
    const dbDoc = read('docs/32_DB스키마_및_RLS정책서.md');
    const legalDoc = read('docs/40_이용약관_및_개인정보처리방침.md');

    expect(apiDoc).toContain('닉네임은 `/api/submit-result`로 전송하지 않으며');
    expect(dbDoc).toContain('|`country_code`|`char(2)`|Nullable|');
    expect(dbDoc).not.toContain('country_code char(2) CHECK');
    expect(legalDoc).toContain('| IP 주소 원문 저장 | 없음 |');
    expect(legalDoc).toContain('국가 코드 저장 | 로컬 MVP 없음. 실제 MVP에서는 Cloudflare 메타데이터에서 파생한 국가 코드만 통계용 저장');
    expect(legalDoc).not.toContain('| IP/국가 코드 저장 | 없음 |');
  });

  it('keeps the official positioning and axis labels consistent', () => {
    const files = [
      'README.md',
      'src/app.html',
      'src/routes/+page.svelte',
      'src/lib/client/share.ts',
      'src/lib/shared/constants.ts',
      'src/lib/shared/result-display.ts',
      'src/lib/server/data/questions.ko-KR.ts',
      'src/lib/server/data/result-mappings.ko-KR.ts',
      ...markdownDocs().map((file) => `docs/${file}`)
    ];
    const staleBranding = [
      '소셜 페르소나',
      '사회적 페르소나',
      '페르소나 유형',
      '사회적 가치관/페르소나',
      '정치/사회 성향',
      '사회/정치 성향',
      '사회·정치 성향 진단',
      '현실 매칭',
      '사회/문화적 보수주의자',
      'PC(정치적 올바름) 지지자',
      '스윙보터',
      '강경파',
      '온건파',
      '하드코어 문항',
      '극단적 한계 상황',
      '극단적 딜레마',
      'S(강경)',
      'M(온건)',
      'M (능력)',
      '`M` 능력',
      '능력(M)',
      'M 능력 쪽',
      '능력주의',
      '능력과',
      '자유주의자',
      '평등주의)',
      '독립주의자',
      '미래주의',
      '원칙주의 전략가',
      '온건한 공동체 조율자'
    ];
    const matches = files.flatMap((file) => {
      const source = read(file);
      return staleBranding
        .filter((stale) => source.includes(stale))
        .map((stale) => `${file}: ${stale}`);
    });

    expect(matches).toEqual([]);
    expect(read('src/lib/shared/constants.ts')).toContain("M: '성과'");
    expect(read('src/lib/shared/result-display.ts')).toContain('`${winner} ${LETTER_LABELS[winner]} 쪽`');
    expect(read('docs/02_핵심_지표_및_세계관_정의서.md')).toContain('공식 축 이름은 `전통(T)`과 `진보(P)`를 사용합니다.');
  });

  it('keeps the question-design example tables out of the old survey tone', () => {
    const designDoc = read('docs/10_문항_및_분기_로직_설계서.md');
    const exampleSection = designDoc.split('## 3. 문항 및 분기 트리 상세 설계')[1]?.split('## 4. 최종 결과 산출')[0] ?? '';
    const staleExamples = [
      '찬성.',
      '반대.',
      '중시하셨군요',
      '완전 평등제',
      '예방적 격리',
      '시대 변화와 맞지 않는 관습이라도 법과 제도가 계속 보호해야 합니까'
    ];

    for (const staleExample of staleExamples) {
      expect(exampleSection, staleExample).not.toContain(staleExample);
    }
  });

  it('keeps the test progress wireframe aligned with the display question model', () => {
    const uiDoc = read('docs/20_UIUX_화면설계서_Wireframe.md');
    const testPage = read('src/routes/test/+page.svelte');
    const highlightedText = read('src/lib/components/test/HighlightedText.svelte');
    const choiceCard = read('src/lib/components/test/ChoiceCard.svelte');

    expect(uiDoc).toContain('`display.promptLines`를 기준으로 2줄 구조');
    expect(uiDoc).toContain('`display.promptHighlights`에 포함된 핵심어는 `<strong>`');
    expect(uiDoc).toContain('`A/B 원형 뱃지 + 짧은 선택지 라벨 + 한 문장 설명`');
    expect(uiDoc).toContain('`display.choices.*.label`');
    expect(uiDoc).toContain('다음 문항을 불러오지 못했다는 짧은 안내');
    expect(uiDoc).toContain('현재 로컬 MVP에서도 `noindex,follow` 메타를 적용합니다');
    expect(testPage).toContain('다음 문항을 불러오지 못했어요.');
    expect(testPage).toContain('첫 문항을 준비하고 있습니다...');
    expect(testPage).not.toContain('다음 질문을 불러오지 못했어요.');
    expect(testPage).not.toContain('첫 질문을 준비하고 있습니다...');
    expect(testPage).toContain('<HighlightedText text={line} highlights={question.display.promptHighlights} />');
    expect(choiceCard).toContain('<HighlightedText text={display?.body ?? text} highlights={display?.highlights ?? []} />');
    expect(highlightedText).toContain('{segment.text}');
    expect(highlightedText).toContain('<strong>{segment.text}</strong>');
    expect(highlightedText).not.toContain('{@html');
    expect(testPage).not.toContain('{@html');
    expect(choiceCard).not.toContain('{@html');
    expect(uiDoc).not.toContain('도심 곳곳에 안면 인식 CCTV를 설치해야 하는가');
  });

  it('keeps relative markdown links pointing to existing local files', () => {
    const files = ['README.md', ...markdownDocs().map((file) => `docs/${file}`)];
    const brokenLinks = files.flatMap((file) => {
      const source = read(file);
      const links = [...source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);

      return links
        .filter((link) => !/^(https?:|mailto:|#)/.test(link))
        .map((link) => link.split('#')[0])
        .filter(Boolean)
        .filter((link) => !existsSync(join(root, dirname(file), link)))
        .map((link) => `${file}: ${link}`);
    });

    expect(brokenLinks).toEqual([]);
  });
});
