<script lang="ts">
  export let compact = false;
</script>

<header class:compact>
  <a href="/" aria-label="Poldigm 홈">Poldigm</a>
  <span>Social Persona Test</span>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 0 24px;
  }

  header.compact {
    padding-bottom: 12px;
  }

  a {
    text-decoration: none;
    font-size: 18px;
    font-weight: var(--font-weight-black);
    letter-spacing: 0;
  }

  span {
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-medium);
  }
</style>
