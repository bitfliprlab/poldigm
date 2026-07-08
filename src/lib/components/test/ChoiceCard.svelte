<script lang="ts">
  import type { Choice, QuestionChoiceDisplay } from '$lib/shared/types';
  import HighlightedText from './HighlightedText.svelte';

  export let choice: Choice;
  export let text: string;
  export let display: QuestionChoiceDisplay | null = null;
  export let disabled = false;
  export let onSelect: () => void = () => {};
</script>

<button class="choice-card" {disabled} onclick={onSelect}>
  <span class="choice-badge">{choice}</span>
  <span class="choice-copy">
    <strong class="choice-label">{display?.label ?? `${choice} 선택`}</strong>
    <span class="choice-body">
      <HighlightedText text={display?.body ?? text} highlights={display?.highlights ?? []} />
    </span>
  </span>
</button>

<style>
  .choice-card {
    width: 100%;
    min-height: 92px;
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    align-items: center;
    gap: 14px;
    padding: 15px 16px;
    border: 1px solid rgba(17, 17, 17, 0.08);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    color: var(--color-text-soft);
    text-align: left;
    transition:
      transform var(--transition-fast),
      border-color var(--transition-fast),
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .choice-card:focus-visible {
    border-color: rgba(17, 17, 17, 0.16);
    box-shadow: var(--focus-ring);
    outline: none;
  }

  .choice-card:active {
    transform: scale(0.99);
  }

  .choice-card:disabled {
    opacity: 0.64;
    transform: none;
  }

  .choice-badge {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid rgba(17, 17, 17, 0.1);
    border-radius: 999px;
    background: #f4f4f1;
    color: var(--color-text);
    font-weight: var(--font-weight-black);
    font-size: 13px;
  }

  .choice-copy {
    min-width: 0;
    display: grid;
    gap: 7px;
  }

  .choice-label {
    color: var(--color-text);
    font-size: 16px;
    font-weight: var(--font-weight-black);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .choice-body {
    font-size: 15px;
    font-weight: var(--font-weight-normal);
    line-height: var(--line-height-normal);
    color: var(--color-text-soft);
    overflow-wrap: anywhere;
  }

  .choice-body :global(strong) {
    color: var(--color-text);
    font-weight: var(--font-weight-black);
  }

  @media (max-width: 390px) {
    .choice-card {
      grid-template-columns: 30px minmax(0, 1fr);
      gap: 12px;
      min-height: 94px;
    }

    .choice-badge {
      width: 30px;
      height: 30px;
    }
  }
</style>
