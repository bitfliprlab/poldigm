<script lang="ts">
  import type { PublicResult } from '$lib/shared/types';
  import AxisGauge from './AxisGauge.svelte';

  export let result: PublicResult;
  export let nickname = '';

  $: ownerLabel = nickname ? `${nickname}님의 사회적·정치적 가치관은` : '나의 사회적·정치적 가치관은';
</script>

<section
  id="result-capture"
  class:strong={result.resultViewModel.intensityTag === 'S'}
  class="capture"
>
  <p class="eyebrow">{ownerLabel}</p>
  <h1>{result.resultViewModel.title}</h1>
  <p class="code">{result.resultCode}</p>

  <p class="subtitle">{result.resultViewModel.subtitle}</p>

  <div class="gauges">
    {#each result.resultViewModel.axisGauges as gauge}
      <AxisGauge left={gauge.left} right={gauge.right} view={gauge} />
    {/each}
  </div>

  <footer class="capture-footer">Poldigm.com</footer>
</section>

<style>
  .capture {
    width: 100%;
    display: grid;
    gap: 11px;
    align-items: center;
    padding: 20px;
    overflow: hidden;
    border: 1px solid rgba(20, 23, 22, 0.06);
    border-radius: var(--radius-lg);
    background: #ffffff;
  }

  .capture.strong {
    border-color: rgba(255, 90, 61, 0.24);
  }

  .eyebrow,
  .code,
  .subtitle,
  footer {
    margin: 0;
    text-align: center;
  }

  .eyebrow,
  .code,
  footer {
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-medium);
  }

  .code {
    display: inline-grid;
    place-self: center;
    min-width: 72px;
    padding: 5px 8px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: #f2f2ef;
    color: var(--color-primary);
    font-weight: var(--font-weight-black);
  }

  h1 {
    margin: 0;
    text-align: center;
    color: var(--color-text);
    font-size: 28px;
    line-height: var(--line-height-tight);
    font-weight: var(--font-weight-black);
    overflow-wrap: anywhere;
  }

  .subtitle {
    color: var(--color-text-soft);
    font-size: 15px;
    line-height: var(--line-height-normal);
    text-align: center;
  }

  .gauges {
    width: 100%;
    display: grid;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  .capture-footer {
    display: none;
  }

  :global(.capture.exporting) .capture-footer {
    display: block;
  }
</style>
