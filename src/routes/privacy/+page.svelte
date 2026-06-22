<script lang="ts">
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import { appBaseUrl } from '$lib/constants/runtime';
</script>

<svelte:head>
  <title>개인정보처리방침 - Poldigm</title>
  <meta name="description" content="Poldigm 개인정보처리방침입니다." />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href={`${appBaseUrl}/privacy`} />
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
        로컬 MVP는 광고 스크립트와 분석 도구를 사용하지 않습니다. 실제 MVP에서 도입하는 경우 처리 목적,
        제공업체, 거부 방법을 별도로 고지합니다.
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
