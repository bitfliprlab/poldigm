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
    min-height: 132px;
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    align-items: center;
    gap: 16px;
    padding: var(--space-card);
    border: 1px solid transparent;
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

  .choice-card:hover,
  .choice-card:focus-visible {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
    color: var(--color-text);
    box-shadow: var(--focus-ring);
    outline: none;
  }

  .choice-card:active {
    transform: scale(0.98);
  }

  .choice-card:disabled {
    opacity: 0.64;
    transform: none;
  }

  .choice-badge {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: rgba(34, 211, 238, 0.12);
    color: var(--color-accent);
    font-weight: var(--font-weight-black);
  }

  .choice-copy {
    min-width: 0;
    display: grid;
    gap: 7px;
  }

  .choice-label {
    color: var(--color-text);
    font-size: 19px;
    font-weight: var(--font-weight-black);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .choice-body {
    font-size: 16px;
    font-weight: var(--font-weight-medium);
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
      grid-template-columns: 34px minmax(0, 1fr);
      gap: 12px;
      min-height: 138px;
    }

    .choice-badge {
      width: 34px;
      height: 34px;
    }
  }
</style>
