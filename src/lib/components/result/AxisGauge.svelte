<script lang="ts">
  import type { Letter, Scores } from '$lib/shared/types';
  import { LETTER_LABELS } from '$lib/shared/constants';

  export let left: Letter;
  export let right: Letter;
  export let scores: Scores;

  $: leftScore = scores[left];
  $: rightScore = scores[right];
  $: total = Math.max(1, leftScore + rightScore);
  $: leftPercent = Math.round((leftScore / total) * 100);
</script>

<div class="gauge">
  <div class="labels">
    <span>{left} {LETTER_LABELS[left]}</span>
    <strong>{leftPercent}%</strong>
    <span>{right} {LETTER_LABELS[right]}</span>
  </div>
  <div class="track">
    <div class="fill" style={`width: ${leftPercent}%`}></div>
  </div>
</div>

<style>
  .gauge {
    display: grid;
    gap: 8px;
  }

  .labels {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--color-text-muted);
  }

  .labels span:last-child {
    text-align: right;
  }

  strong {
    color: var(--color-text);
    font-size: 12px;
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
