<script lang="ts">
  import { onMount } from 'svelte';
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import BottomActions from '$lib/components/result/BottomActions.svelte';
  import ResultCapture from '$lib/components/result/ResultCapture.svelte';
  import type { PublicResult } from '$lib/shared/types';
  import { getLastResult } from '$lib/client/session';

  export let data: {
    result: PublicResult | null;
    resultId: string;
  };

  let result: PublicResult | null = data.result;

  onMount(() => {
    if (result) return;
    const fallback = getLastResult();
    if (fallback?.resultId === data.resultId) {
      result = fallback;
    }
  });
</script>

<section class="screen result-screen">
  <AppHeader compact />

  {#if result}
    <ResultCapture {result} />

    <section class="detail">
      <h2>상세 해석</h2>
      <p>{result.resultViewModel.description}</p>
    </section>

    <section class="chemistry">
      <h2>궁합</h2>
      <div>
        <article>
          <span>환상의 파트너</span>
          <strong>{result.resultViewModel.chemistryBest}</strong>
        </article>
        <article>
          <span>충돌 포인트</span>
          <strong>{result.resultViewModel.chemistryWorst}</strong>
        </article>
      </div>
    </section>

    <BottomActions {result} />
  {:else}
    <div class="missing">
      <h1>저장된 결과를 찾을 수 없어요.</h1>
      <p>로컬 MVP의 mock 저장소는 개발 서버 재시작 시 사라질 수 있습니다.</p>
      <a href="/">테스트 다시 시작</a>
    </div>
  {/if}
</section>

<style>
  .result-screen {
    display: grid;
    gap: 18px;
  }

  .detail,
  .chemistry {
    display: grid;
    gap: 10px;
    padding: 18px 0;
    border-top: 1px solid var(--color-border);
  }

  h2,
  p {
    margin: 0;
  }

  h2 {
    font-size: 16px;
  }

  p {
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
    line-height: var(--line-height-relaxed);
  }

  .chemistry div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  article {
    display: grid;
    gap: 8px;
    min-height: 96px;
    padding: 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  article span {
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
  }

  article strong {
    font-size: 18px;
    line-height: var(--line-height-tight);
  }

  .missing {
    min-height: 70dvh;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 14px;
    text-align: center;
  }

  .missing h1 {
    margin: 0;
    font-size: 24px;
  }

  .missing a {
    display: grid;
    place-items: center;
    min-width: 180px;
    min-height: 48px;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: var(--color-text);
    text-decoration: none;
    font-weight: var(--font-weight-bold);
  }
</style>
