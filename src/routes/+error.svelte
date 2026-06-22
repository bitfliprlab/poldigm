<script lang="ts">
  import { page } from '$app/state';
  import AppHeader from '$lib/components/layout/AppHeader.svelte';

  const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? '페이지를 찾을 수 없어요' : '오류가 발생했어요'} - Poldigm</title>
  <meta
    name="description"
    content={isNotFound
      ? '요청한 Poldigm 페이지를 찾을 수 없습니다. 홈에서 테스트를 다시 시작할 수 있습니다.'
      : 'Poldigm 화면을 불러오는 중 문제가 발생했습니다. 홈에서 다시 시작할 수 있습니다.'}
  />
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<section class="screen error-screen">
  <AppHeader compact />

  <div class="error-copy">
    <span>{page.status}</span>
    <h1>{isNotFound ? '페이지를 찾을 수 없어요.' : '잠시 문제가 생겼어요.'}</h1>
    <p>
      {isNotFound
        ? '주소가 바뀌었거나 아직 공개되지 않은 화면일 수 있어요.'
        : '일시적인 오류일 수 있으니 홈에서 다시 시작해보세요.'}
    </p>
    <a href="/">홈으로 이동</a>
  </div>
</section>

<style>
  .error-screen {
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .error-copy {
    display: grid;
    place-items: center;
    align-content: center;
    gap: 14px;
    min-height: 72dvh;
    text-align: center;
  }

  .error-copy span {
    color: var(--color-accent);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-black);
  }

  .error-copy h1,
  .error-copy p {
    margin: 0;
  }

  .error-copy h1 {
    max-width: 280px;
    font-size: 26px;
    line-height: var(--line-height-tight);
    overflow-wrap: anywhere;
  }

  .error-copy p {
    max-width: 300px;
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
    line-height: var(--line-height-relaxed);
  }

  .error-copy a {
    display: grid;
    place-items: center;
    min-width: 180px;
    min-height: 48px;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: var(--color-text);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
    box-shadow: var(--shadow-primary-glow);
  }
</style>
