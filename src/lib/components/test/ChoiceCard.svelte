<script lang="ts">
  import type { Choice } from '$lib/shared/types';

  export let choice: Choice;
  export let text: string;
  export let disabled = false;
  export let onSelect: () => void = () => {};
</script>

<button class="choice-card" {disabled} onclick={onSelect}>
  <span>{choice}</span>
  <strong>{text}</strong>
</button>

<style>
  .choice-card {
    width: 100%;
    min-height: var(--choice-min-height);
    display: grid;
    grid-template-columns: 36px 1fr;
    align-items: center;
    gap: 14px;
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

  span {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(34, 211, 238, 0.12);
    color: var(--color-accent);
    font-weight: var(--font-weight-black);
  }

  strong {
    font-size: var(--font-size-choice);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-normal);
    overflow-wrap: anywhere;
  }
</style>
