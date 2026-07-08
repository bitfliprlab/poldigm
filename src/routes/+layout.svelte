<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { initAnalytics, trackPageView } from '$lib/client/analytics';
  import '../app.css';

  let { children } = $props();

  onMount(() => {
    initAnalytics();
    trackPageView();
  });

  afterNavigate(() => {
    trackPageView();
  });
</script>

<div class="app-shell">
  <main class="mobile-viewport">
    {@render children()}
  </main>
</div>
