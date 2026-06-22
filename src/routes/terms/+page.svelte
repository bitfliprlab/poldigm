<script lang="ts">
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import { appBaseUrl } from '$lib/constants/runtime';
</script>

<svelte:head>
  <title>이용약관 - Poldigm</title>
  <meta name="description" content="Poldigm 서비스 이용약관입니다." />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href={`${appBaseUrl}/terms`} />
</svelte:head>

<section class="screen legal">
  <AppHeader compact />

  <article>
    <p class="eyebrow">Terms of Service</p>
    <h1>이용약관</h1>
    <p class="lead">
      Poldigm은 회원가입 없이 이용하는 사회적·정치적 가치관 테스트입니다. 본 약관은 로컬 MVP 기준의
      초안이며, 실제 배포 전 운영 주체와 문의처를 확정해 갱신합니다.
    </p>

    <section>
      <h2>서비스 제공</h2>
      <p>서비스는 무료로 제공되며, 운영상 또는 기술상 필요에 따라 일부 기능이 변경되거나 중단될 수 있습니다.</p>
    </section>

    <section>
      <h2>사용자의 의무</h2>
      <p>
        사용자는 매크로, 봇, 리버스 엔지니어링, 문항 풀 무단 추출처럼 서비스의 정상 운영을 방해하는 행위를
        해서는 안 됩니다.
      </p>
    </section>

    <section>
      <h2>지적재산권</h2>
      <p>
        문항, 결과 텍스트, 알고리즘 구조, UI 디자인, 캐릭터 에셋의 권리는 Poldigm에 귀속됩니다. 사용자는
        개인적인 결과 공유 목적 외에 콘텐츠를 무단 복제하거나 영리 목적으로 재배포할 수 없습니다.
      </p>
    </section>

    <section>
      <h2>면책</h2>
      <p>
        테스트 결과는 재미와 참고용 인사이트를 위한 콘텐츠입니다. 의학적, 심리학적, 법적 판단이나 전문 진단을
        대체하지 않습니다.
      </p>
    </section>

    <footer>
      <a href="/privacy">개인정보처리방침 보기</a>
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
