<script lang="ts">
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import { resetSession } from '$lib/client/session';

  function startTest() {
    resetSession();
  }
</script>

<section class="screen landing">
  <AppHeader />

  <div class="hero-visual" aria-hidden="true">
    <span>CTMO</span>
    <span>CPEL</span>
    <span>IPML</span>
    <span>ITEO</span>
  </div>

  <div class="copy">
    <p>100개 후보 딜레마 중</p>
    <h1>당신에게 도착한 20문항.</h1>
    <strong>숨겨진 사회적 페르소나와 16가지 가치관 스펙트럼</strong>
  </div>

  <div class="bottom">
    <p>현재 <b>24,512</b>명이 테스트에 참여했어요</p>
    <a class="start-button" role="button" href="/test?restart=1" onclick={startTest}>테스트 시작하기</a>
  </div>
</section>

<style>
  .landing {
    position: relative;
    display: grid;
    grid-template-rows: auto minmax(240px, 1fr) auto auto;
    gap: 24px;
    overflow: hidden;
  }

  .hero-visual {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 280px;
  }

  .hero-visual::before {
    content: "";
    position: absolute;
    width: 230px;
    aspect-ratio: 1;
    border: 1px solid rgba(34, 211, 238, 0.32);
    border-radius: 50%;
    background:
      radial-gradient(circle, rgba(34, 211, 238, 0.2), transparent 62%),
      radial-gradient(circle at 28% 20%, rgba(244, 63, 94, 0.24), transparent 42%);
    filter: drop-shadow(0 0 28px rgba(99, 102, 241, 0.34));
  }

  .hero-visual span {
    position: absolute;
    display: grid;
    place-items: center;
    width: 120px;
    aspect-ratio: 1;
    border: 1px solid rgba(249, 250, 251, 0.12);
    border-radius: 22px;
    background: rgba(31, 41, 55, 0.72);
    color: var(--color-text);
    font-weight: var(--font-weight-black);
  }

  .hero-visual span:nth-child(1) {
    transform: translate(-72px, -48px) rotate(-10deg);
  }

  .hero-visual span:nth-child(2) {
    transform: translate(70px, -26px) rotate(12deg);
  }

  .hero-visual span:nth-child(3) {
    transform: translate(-48px, 84px) rotate(8deg);
  }

  .hero-visual span:nth-child(4) {
    transform: translate(82px, 86px) rotate(-8deg);
  }

  .copy {
    display: grid;
    gap: 10px;
    padding-bottom: 150px;
  }

  .copy p,
  .copy h1,
  .copy strong,
  .bottom p {
    margin: 0;
  }

  .copy p {
    color: var(--color-accent);
    font-weight: var(--font-weight-bold);
  }

  h1 {
    font-size: 42px;
    line-height: 1.05;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .copy strong {
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
    line-height: var(--line-height-normal);
  }

  .bottom {
    position: fixed;
    left: max(16px, calc((100vw - var(--viewport-max-width)) / 2 + 16px));
    right: max(16px, calc((100vw - var(--viewport-max-width)) / 2 + 16px));
    bottom: calc(18px + env(safe-area-inset-bottom));
    display: grid;
    gap: 12px;
    max-width: calc(var(--viewport-max-width) - 32px);
    margin: 0 auto;
  }

  .bottom p {
    color: var(--color-text-muted);
    text-align: center;
    font-size: var(--font-size-caption);
  }

  .bottom b {
    color: var(--color-text);
  }

  .start-button {
    height: var(--cta-height);
    display: grid;
    place-items: center;
    border: 0;
    border-radius: var(--radius-md);
    background: var(--color-primary);
    color: var(--color-text);
    text-decoration: none;
    font-weight: var(--font-weight-bold);
    box-shadow: var(--shadow-primary-glow);
  }
</style>
