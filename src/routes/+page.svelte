<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import { getNickname, resetSession, saveNickname } from '$lib/client/session';
  import {
    absoluteUrl,
    defaultOgImageUrl,
    organizationJsonLd,
    siteDescription,
    siteImageAlt,
    siteLocale,
    siteName,
    siteTitle,
    webApplicationJsonLd,
    websiteJsonLd
  } from '$lib/shared/seo';

  let nickname = '';
  let hydrated = false;
  const ldJsonOpen = '<script type="application/ld+json">';
  const ldJsonClose = '</scr' + 'ipt>';
  const websiteJsonLdTag = `${ldJsonOpen}${JSON.stringify(websiteJsonLd)}${ldJsonClose}`;
  const webApplicationJsonLdTag = `${ldJsonOpen}${JSON.stringify(webApplicationJsonLd)}${ldJsonClose}`;
  const organizationJsonLdTag = `${ldJsonOpen}${JSON.stringify(organizationJsonLd)}${ldJsonClose}`;

  function currentNickname() {
    return document.querySelector<HTMLInputElement>('input[name="nickname"]')?.value ?? nickname;
  }

  async function startTest() {
    resetSession();
    saveNickname(currentNickname());
    await goto('/test?restart=1');
  }

  onMount(() => {
    nickname = getNickname();
    hydrated = true;
  });
</script>

<svelte:head>
  <title>{siteTitle}</title>
  <meta name="description" content={siteDescription} />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href={absoluteUrl('/')} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content={siteLocale} />
  <meta property="og:title" content={siteTitle} />
  <meta property="og:description" content={siteDescription} />
  <meta property="og:url" content={absoluteUrl('/')} />
  <meta property="og:image" content={defaultOgImageUrl} />
  <meta property="og:image:alt" content={siteImageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={siteTitle} />
  <meta name="twitter:description" content={siteDescription} />
  <meta name="twitter:image" content={defaultOgImageUrl} />
  {@html websiteJsonLdTag}
  {@html webApplicationJsonLdTag}
  {@html organizationJsonLdTag}
</svelte:head>

<section class="screen landing">
  <AppHeader />

  <div class="copy">
    <p>정답 없는 선택지</p>
    <h1>가치관 밸런스 체크</h1>
    <strong>20개 질문에 답하면 내 선택 기준을 가볍게 정리해줘요.</strong>
  </div>

  <div class="meta-card">
    <span>20문항</span>
    <span>로그인 없음</span>
    <span>약 3분</span>
  </div>

  <div class="bottom">
    <p>현재 <b>24,512</b>명이 테스트에 참여했어요</p>
    <label class="nickname">
      <span>닉네임</span>
      <input
        bind:value={nickname}
        maxlength="16"
        name="nickname"
        placeholder="선택 입력"
        autocomplete="nickname"
        disabled={!hydrated}
      />
    </label>
    <button class="start-button" type="button" disabled={!hydrated} onclick={startTest}>테스트 시작하기</button>
    <p class="legal-copy">
      시작 시 <a href="/terms">이용약관</a> 및 <a href="/privacy">개인정보처리방침</a>에 동의한 것으로 간주됩니다.
      닉네임은 선택 입력이며 서버에 저장되지 않습니다.
    </p>
  </div>
</section>

<style>
  .landing {
    position: relative;
    display: grid;
    grid-template-rows: auto auto auto;
    align-content: start;
    gap: 16px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }

  .copy {
    display: grid;
    gap: 12px;
    padding-top: 92px;
  }

  .copy p,
  .copy h1,
  .copy strong,
  .bottom p {
    margin: 0;
  }

  .copy p {
    color: var(--color-primary);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
  }

  h1 {
    max-width: 320px;
    font-size: 42px;
    line-height: 1.05;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .copy strong {
    max-width: 310px;
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
    line-height: var(--line-height-normal);
  }

  .meta-card {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .meta-card span {
    display: grid;
    place-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    background: var(--color-surface);
    color: var(--color-text-soft);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
  }

  .bottom {
    display: grid;
    gap: 12px;
    margin-top: 54px;
  }

  .bottom p {
    color: var(--color-text-muted);
    text-align: center;
    font-size: var(--font-size-caption);
  }

  .legal-copy {
    line-height: var(--line-height-normal);
  }

  .legal-copy a {
    color: var(--color-text-soft);
    font-weight: var(--font-weight-bold);
    text-decoration: none;
  }

  .bottom b {
    color: var(--color-primary);
  }

  .nickname {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
  }

  .nickname span {
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
  }

  .nickname input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--color-text);
    text-align: right;
  }

  .nickname input::placeholder {
    color: var(--color-text-muted);
  }

  .nickname input:disabled {
    opacity: 0.58;
  }

  .start-button {
    height: var(--cta-height);
    display: grid;
    place-items: center;
    border: 0;
    border-radius: var(--radius-md);
    background: #111111;
    color: #ffffff;
    text-decoration: none;
    font-weight: var(--font-weight-bold);
  }

  .start-button:disabled {
    opacity: 0.58;
    box-shadow: none;
  }
</style>
