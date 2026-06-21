<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<div class="app-shell">
  <main class="mobile-viewport">
    {@render children()}
  </main>
</div>
