<script lang="ts">
  import type { PublicResult } from '$lib/shared/types';
  import AxisGauge from './AxisGauge.svelte';
  import CharacterImage from './CharacterImage.svelte';

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

  <CharacterImage
    characterImg={result.resultViewModel.characterImg}
    title={result.resultViewModel.title}
    typeCode={result.resultViewModel.typeCode}
  />

  <p class="subtitle">{result.resultViewModel.subtitle}</p>

  <div class="gauges">
    {#each result.resultViewModel.axisGauges as gauge}
      <AxisGauge left={gauge.left} right={gauge.right} view={gauge} />
    {/each}
  </div>

  <footer>Poldigm.com</footer>
</section>

<style>
  .capture {
    width: 100%;
    aspect-ratio: var(--capture-aspect-ratio);
    display: grid;
    grid-template-rows: auto auto auto minmax(180px, 1fr) auto auto auto;
    gap: 12px;
    align-items: center;
    padding: 24px 22px;
    overflow: hidden;
    border: 1px solid rgba(99, 102, 241, 0.35);
    border-radius: 8px;
    background:
      radial-gradient(circle at 50% 18%, rgba(34, 211, 238, 0.18), transparent 28%),
      linear-gradient(180deg, #111827 0%, #0b1020 100%);
  }

  .capture.strong {
    border-color: rgba(244, 63, 94, 0.48);
    background:
      radial-gradient(circle at 50% 18%, rgba(244, 63, 94, 0.18), transparent 28%),
      linear-gradient(180deg, #111827 0%, #0b1020 100%);
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

  h1 {
    margin: 0;
    text-align: center;
    color: var(--color-text);
    font-size: clamp(24px, 8vw, var(--font-size-display));
    line-height: var(--line-height-tight);
    font-weight: var(--font-weight-black);
    overflow-wrap: anywhere;
  }

  .subtitle {
    color: var(--color-text-soft);
    font-size: 13px;
    line-height: var(--line-height-normal);
  }

  .gauges {
    display: grid;
    gap: 9px;
  }
</style>
