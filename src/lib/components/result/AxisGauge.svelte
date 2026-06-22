<script lang="ts">
  import type { Letter, ResultAxisGauge, Scores } from '$lib/shared/types';
  import { LETTER_LABELS } from '$lib/shared/constants';
  import { buildAxisGaugeView } from '$lib/shared/result-display';

  export let left: Letter;
  export let right: Letter;
  export let scores: Scores | undefined = undefined;
  export let view: ResultAxisGauge | undefined = undefined;

  $: gaugeView = view ?? (scores ? buildAxisGaugeView({ left, right, scores }) : undefined);
  $: leftDisplayPercent = gaugeView?.leftPercent ?? 50;
  $: rightDisplayPercent = 100 - leftDisplayPercent;
</script>

<div class="gauge">
  <div class="labels">
    <span class="axis-label">
      <span>{left} {LETTER_LABELS[left]}</span>
      <strong>{leftDisplayPercent}%</strong>
    </span>
    <span class="split">/</span>
    <span class="axis-label right">
      <span>{right} {LETTER_LABELS[right]}</span>
      <strong>{rightDisplayPercent}%</strong>
    </span>
  </div>
  <div class="track">
    <div class="fill" style={`width: ${leftDisplayPercent}%`}></div>
  </div>
  <p>{gaugeView?.directionLabel ?? `${left} ${LETTER_LABELS[left]} 쪽`} · {gaugeView?.strengthLabel ?? '균형에 가까움'}</p>
</div>

<style>
  .gauge {
    display: grid;
    gap: 8px;
  }

  .labels {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--color-text-muted);
  }

  .axis-label {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .axis-label > span {
    overflow-wrap: anywhere;
  }

  .axis-label.right {
    text-align: right;
  }

  .split {
    color: var(--color-text-subtle);
    font-size: 10px;
  }

  strong {
    color: var(--color-text);
    font-size: 12px;
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 11px;
    line-height: var(--line-height-tight);
    text-align: center;
  }

  .track {
    height: 9px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(249, 250, 251, 0.12);
  }

  .fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
    transition: width var(--transition-normal);
  }
</style>
