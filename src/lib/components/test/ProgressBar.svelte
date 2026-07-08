<script lang="ts">
  export let current = 0;
  export let total = 20;
  export let label = '';

  $: percent = Math.max(0, Math.min(100, (current / total) * 100));
</script>

<div class="progress-meta">
  <span>{label}</span>
  <strong>{current}/{total}</strong>
</div>
<div class="progress-track" aria-label="진행률">
  <div class="progress-value" style={`width: ${percent}%`}></div>
</div>

<style>
  .progress-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-medium);
  }

  strong {
    color: var(--color-text);
  }

  .progress-track {
    height: 5px;
    overflow: hidden;
    border-radius: 999px;
    background: #e5e5e2;
  }

  .progress-value {
    height: 100%;
    border-radius: inherit;
    background: var(--color-primary);
    transition: width var(--transition-normal);
  }
</style>
