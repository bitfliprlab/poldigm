<script lang="ts">
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import { absoluteUrl, breadcrumbJsonLd, defaultOgImageUrl, siteImageAlt, siteName } from '$lib/shared/seo';

  const title = '개인정보처리방침 - Poldigm';
  const description = 'Poldigm 개인정보처리방침입니다.';
  const breadcrumbs = breadcrumbJsonLd([
    { name: '홈', path: '/' },
    { name: '개인정보처리방침', path: '/privacy' }
  ]);
  const breadcrumbsJsonLdTag =
    '<script type="application/ld+json">' + JSON.stringify(breadcrumbs) + '</scr' + 'ipt>';
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href={absoluteUrl('/privacy')} />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={absoluteUrl('/privacy')} />
  <meta property="og:image" content={defaultOgImageUrl} />
  <meta property="og:image:alt" content={siteImageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={defaultOgImageUrl} />
  {@html breadcrumbsJsonLdTag}
</svelte:head>

<section class="screen legal">
  <AppHeader compact />

  <article>
    <p class="eyebrow">Privacy Policy</p>
    <h1>개인정보처리방침</h1>
    <p class="lead">
      Poldigm 로컬 MVP는 회원가입을 요구하지 않고, 닉네임을 서버에 저장하지 않습니다. 아래 내용은 현재
      로컬 구현 기준의 고지이며 실제 배포 전 운영 환경에 맞춰 갱신합니다.
    </p>

    <section>
      <h2>수집하는 정보</h2>
      <p>
        결과 산출을 위해 응답 이력, 결과 코드, 축별 점수, 테스트 소요 시간, 기기 유형, 유입 경로 같은
        비식별 이용 기록을 처리할 수 있습니다.
      </p>
    </section>

    <section>
      <h2>닉네임</h2>
      <p>
        닉네임은 선택 입력이며 결과 화면과 공유 이미지 개인화를 위해 브라우저 세션에서만 사용합니다. 현재 로컬
        MVP에서는 닉네임을 서버 DB에 저장하지 않습니다.
      </p>
    </section>

    <section>
      <h2>IP와 위치 정보</h2>
      <p>
        실제 MVP에서는 국가 코드 수준의 접속 지역을 통계 목적으로 기록할 수 있습니다. IP 원문, 도시, 상세
        위치는 DB에 저장하지 않는 것을 원칙으로 합니다.
      </p>
    </section>

    <section>
      <h2>브라우저 저장소</h2>
      <p>
        테스트 진행 복구를 위해 sessionStorage를 사용합니다. 이 데이터는 브라우저 탭을 닫거나 테스트를 다시
        시작하면 사라질 수 있습니다.
      </p>
    </section>

    <section>
      <h2>광고와 분석 도구</h2>
      <p>
        Poldigm은 공개 배포 환경에서 Google Analytics 4를 사용해 페이지 방문, 유입 경로, 브라우저 환경 같은
        서비스 이용 통계를 확인할 수 있습니다. 로컬 개발 환경과 측정 ID가 없는 환경에서는 분석 스크립트를
        로드하지 않습니다. 이 과정에서 Google이 쿠키 또는 온라인 식별자를 사용할 수 있으며, 수집된 정보는 서비스
        품질 개선과 오류 파악 목적으로만 활용합니다.
      </p>
      <p>
        닉네임, 결과 ID, 테스트 응답 내용, 결과 유형, 개인별 정치 성향 추론값은 Google Analytics 이벤트
        파라미터로 전송하지 않습니다. Google Analytics의 정보 처리와 거부 방법은
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">
          Google 파트너 사이트 정책
        </a>
        및
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
          Google Analytics 차단 브라우저 부가 기능
        </a>
        에서 확인할 수 있습니다.
      </p>
    </section>

    <footer>
      <a href="/terms">이용약관 보기</a>
    </footer>
  </article>
</section>

<style>
  .legal {
    min-height: 100dvh;
  }

  article {
    display: grid;
    gap: 22px;
    padding-bottom: 36px;
  }

  .eyebrow,
  .lead,
  p {
    margin: 0;
  }

  .eyebrow {
    color: var(--color-accent);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
  }

  h1,
  h2 {
    margin: 0;
    letter-spacing: 0;
  }

  h1 {
    font-size: var(--font-size-display);
    line-height: var(--line-height-tight);
  }

  h2 {
    font-size: 17px;
    line-height: var(--line-height-tight);
  }

  .lead,
  p {
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
    line-height: var(--line-height-relaxed);
  }

  section {
    display: grid;
    gap: 8px;
  }

  footer {
    padding-top: 8px;
  }

  a {
    color: var(--color-accent);
    font-size: var(--font-size-body);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
  }
</style>
