<script lang="ts">
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import ChoiceCard from '$lib/components/test/ChoiceCard.svelte';
  import HighlightedText from '$lib/components/test/HighlightedText.svelte';
  import ProgressBar from '$lib/components/test/ProgressBar.svelte';
  import type { AnswerHistoryItem, Choice, PublicQuestion, PublicResult } from '$lib/shared/types';
  import {
    appendAnswer,
    deviceType,
    getHistory,
    getPlayTimeSec,
    getQuestionSeed,
    resetSession,
    saveLastResult
  } from '$lib/client/session';
  import { isLocalApp } from '$lib/constants/runtime';

  type NextQuestionResponse =
    | { status: 'in_progress'; question: PublicQuestion }
    | { status: 'completed'; nextAction: 'submit_result' };

  let question: PublicQuestion | null = null;
  let history: AnswerHistoryItem[] = [];
  let loading = true;
  let submitting = false;
  let errorMessage = '';
  let analysisProgress = 0;
  let turnstileContainer: HTMLDivElement;
  let turnstileWidgetId: string | null = null;
  let turnstileToken = '';
  let botVerified = false;
  let botVerifying = false;
  let botVerificationGrant = '';
  let testStarted = false;

  const turnstileSiteKey = env.PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? '';
  const usesLocalTurnstileMock = dev && isLocalApp;

  type TurnstileApi = {
    render: (
      container: HTMLElement,
      options: {
        sitekey: string;
        action: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
      }
    ) => string;
    reset: (widgetId?: string) => void;
  };

  type TurnstileWindow = Window & {
    turnstile?: TurnstileApi;
  };

  function loadTurnstileScript() {
    return new Promise<void>((resolve, reject) => {
      if (!turnstileSiteKey || usesLocalTurnstileMock) {
        resolve();
        return;
      }

      const turnstileWindow = window as TurnstileWindow;
      if (turnstileWindow.turnstile) {
        resolve();
        return;
      }

      const existingScript = document.getElementById('cloudflare-turnstile-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('봇 검증 스크립트를 불러오지 못했습니다.')), {
          once: true
        });
        return;
      }

      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener('error', () => reject(new Error('봇 검증 스크립트를 불러오지 못했습니다.')), {
        once: true
      });
      document.head.appendChild(script);
    });
  }

  async function renderTurnstile() {
    if (!turnstileSiteKey || usesLocalTurnstileMock || turnstileWidgetId || !turnstileContainer) return;

    await loadTurnstileScript();
    const turnstile = (window as TurnstileWindow).turnstile;
    if (!turnstile) throw new Error('봇 검증을 초기화하지 못했습니다.');

    turnstileWidgetId = turnstile.render(turnstileContainer, {
      sitekey: turnstileSiteKey,
      action: 'test_start',
      callback: (token: string) => {
        turnstileToken = token;
        void completeBotVerification(token);
      },
      'expired-callback': () => {
        turnstileToken = '';
        botVerificationGrant = '';
        botVerified = false;
        if (turnstileWidgetId) turnstile.reset(turnstileWidgetId);
      },
      'error-callback': () => {
        turnstileToken = '';
      }
    });
  }

  async function completeBotVerification(token: string) {
    if (botVerified || botVerifying) return;

    botVerifying = true;
    errorMessage = '';
    try {
      const response = await fetch('/api/verify-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turnstileToken: token })
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? '봇 검증에 실패했습니다.');

      botVerificationGrant = String(payload.botVerificationGrant ?? '');
      if (!botVerificationGrant) throw new Error('봇 검증에 실패했습니다.');
      botVerified = true;
      await startOrResumeTest();
    } catch (error) {
      turnstileToken = '';
      botVerificationGrant = '';
      botVerified = false;
      errorMessage = error instanceof Error ? error.message : '봇 검증에 실패했습니다.';
      const turnstile = (window as TurnstileWindow).turnstile;
      if (turnstileWidgetId) turnstile?.reset(turnstileWidgetId);
    } finally {
      botVerifying = false;
    }
  }

  async function startOrResumeTest() {
    if (testStarted) return;
    testStarted = true;
    loading = true;
    try {
      await requestNextQuestion(history);
    } catch (error) {
      testStarted = false;
      errorMessage = error instanceof Error ? error.message : '진행 정보를 복구하지 못했어요.';
    } finally {
      loading = false;
    }
  }

  async function requestNextQuestion(currentHistory: AnswerHistoryItem[]) {
    const response = await fetch('/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: currentHistory, questionSeed: getQuestionSeed() })
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message ?? '다음 문항을 불러오지 못했어요.');

    const data = payload as NextQuestionResponse;
    if (data.status === 'completed') {
      await submitResult(currentHistory);
      return;
    }

    question = data.question;
  }

  async function submitResult(currentHistory: AnswerHistoryItem[]) {
    submitting = true;
    analysisProgress = 15;
    await tickAnalysis(62);

    const response = await fetch('/api/submit-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history: currentHistory,
        turnstileToken: botVerificationGrant,
        playTimeSec: getPlayTimeSec(),
        deviceType: deviceType()
      })
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message ?? '결과를 계산하지 못했어요.');

    const result = payload as PublicResult;
    saveLastResult(result);
    analysisProgress = 100;
    await new Promise((resolve) => setTimeout(resolve, 300));
    await goto(`/result/${result.resultId}`);
  }

  async function tickAnalysis(to: number) {
    while (analysisProgress < to) {
      analysisProgress += 7;
      await new Promise((resolve) => setTimeout(resolve, 70));
    }
  }

  async function choose(choice: Choice) {
    if (!question || loading || submitting) return;

    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();

    errorMessage = '';
    loading = true;
    const nextHistory = appendAnswer({
      questionId: question.id,
      choice,
      answeredAt: new Date().toISOString()
    });
    history = nextHistory;

    try {
      if (nextHistory.length === 20) {
        await submitResult(nextHistory);
      } else {
        await requestNextQuestion(nextHistory);
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : '오류가 발생했어요.';
    } finally {
      loading = false;
      submitting = false;
    }
  }

  async function retry() {
    errorMessage = '';
    loading = true;
    try {
      if (botVerified) {
        await requestNextQuestion(history);
      } else {
        await renderTurnstile();
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : '오류가 발생했어요.';
    } finally {
      loading = false;
    }
  }

  async function restart() {
    resetSession();
    history = [];
    question = null;
    errorMessage = '';
    loading = true;
    testStarted = false;
    try {
      if (usesLocalTurnstileMock) {
        botVerified = true;
        botVerificationGrant = 'local-mock-token';
        await startOrResumeTest();
      } else {
        botVerified = false;
        botVerificationGrant = '';
        if (turnstileWidgetId) (window as TurnstileWindow).turnstile?.reset(turnstileWidgetId);
        await renderTurnstile();
      }
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    if (new URLSearchParams(window.location.search).get('restart') === '1') {
      resetSession();
      await goto('/test', { replaceState: true, noScroll: true });
    }

    history = getHistory();
    if (history.length >= 20) {
      resetSession();
      history = [];
    }

    try {
      if (usesLocalTurnstileMock) {
        botVerified = true;
        botVerificationGrant = 'local-mock-token';
        await startOrResumeTest();
      } else if (!turnstileSiteKey) {
        throw new Error('봇 검증 설정이 누락되었습니다.');
      } else {
        await renderTurnstile();
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : '진행 정보를 복구하지 못했어요.';
    } finally {
      if (!botVerified) loading = false;
    }
  });
</script>

<svelte:head>
  <title>테스트 진행 중 - Poldigm</title>
  <meta name="description" content="Poldigm 테스트를 진행 중입니다." />
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<section class="screen test-screen">
  <AppHeader compact />

  {#if submitting}
    <div class="analysis" aria-live="polite">
      <p>당신의 가치관 데이터를 분석 중입니다...</p>
      <strong>{Math.min(100, analysisProgress)}%</strong>
      <div class="keywords">
        <span>공공 안전</span>
        <span>자유</span>
        <span>평등</span>
        <span>질서</span>
      </div>
    </div>
  {:else if !botVerified && !usesLocalTurnstileMock}
    <div class="verification" aria-live="polite">
      <div class="verification-copy">
        <span>Bot check</span>
        <h1>테스트를 시작하기 전에 확인할게요.</h1>
        <p>검증이 끝나면 바로 첫 문항으로 넘어갑니다.</p>
      </div>

      {#if turnstileSiteKey}
        <div class="bot-check" aria-label="Bot verification">
          <div bind:this={turnstileContainer}></div>
        </div>
      {/if}

      {#if botVerifying}
        <p class="verification-status">확인 중입니다...</p>
      {/if}
    </div>
  {:else if question}
    <ProgressBar
      current={question.progress.current}
      total={question.progress.total}
      label={question.progress.label}
    />

    <article class="question-card">
      <span class="question-axis">{question.axis.replace('_', ' / ')}</span>
      <h1 aria-label={question.prompt}>
        {#each question.display.promptLines as line}
          <span class="question-line">
            <HighlightedText text={line} highlights={question.display.promptHighlights} />
          </span>
        {/each}
      </h1>
    </article>

    <div class="choices">
      <ChoiceCard
        choice="A"
        text={question.choices.A}
        display={question.display.choices.A}
        disabled={loading}
        onSelect={() => choose('A')}
      />
      <ChoiceCard
        choice="B"
        text={question.choices.B}
        display={question.display.choices.B}
        disabled={loading}
        onSelect={() => choose('B')}
      />
    </div>
  {:else}
    <div class="analysis">
      <p>첫 문항을 준비하고 있습니다...</p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="error" role="alert">
      <p>{errorMessage}</p>
      <button onclick={retry}>다시 시도</button>
      <button class="ghost" onclick={restart}>처음부터 시작</button>
    </div>
  {/if}
</section>

<style>
  .test-screen {
    display: grid;
    grid-template-rows: auto auto auto auto;
    gap: 14px;
  }

  .question-card {
    display: grid;
    align-content: center;
    gap: 14px;
    min-height: 178px;
    padding: 20px 18px;
    border: 1px solid rgba(20, 23, 22, 0.06);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
  }

  .question-axis {
    color: var(--color-primary);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
  }

  h1 {
    margin: 0;
    font-size: 23px;
    line-height: var(--line-height-question);
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .question-line {
    display: block;
  }

  .question-line + .question-line {
    margin-top: 6px;
  }

  h1 :global(strong) {
    color: var(--color-text);
    font-weight: var(--font-weight-black);
  }

  .choices {
    display: grid;
    gap: 9px;
    padding-bottom: 24px;
  }

  @media (min-width: 420px) {
    h1 {
      font-size: 25px;
    }
  }

  .analysis {
    min-height: 72dvh;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 22px;
    text-align: center;
  }

  .analysis p {
    margin: 0;
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
  }

  .analysis strong {
    font-size: 52px;
    color: var(--color-primary);
  }

  .verification {
    min-height: 72dvh;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 18px;
    text-align: center;
  }

  .verification-copy {
    display: grid;
    gap: 8px;
    max-width: 360px;
  }

  .verification-copy span {
    color: var(--color-primary);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
  }

  .verification-copy h1 {
    font-size: 25px;
  }

  .verification-copy p,
  .verification-status {
    margin: 0;
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
  }

  .keywords {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .keywords span {
    padding: 8px 10px;
    border: 1px solid var(--color-border);
    border-radius: 999px;
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
  }

  .error {
    display: grid;
    gap: 10px;
    padding: 14px;
    border: 1px solid rgba(159, 47, 63, 0.32);
    border-radius: var(--radius-md);
    background: rgba(159, 47, 63, 0.08);
  }

  .error p {
    margin: 0;
    color: var(--color-text-soft);
    font-size: var(--font-size-body);
  }

  .error button {
    min-height: 42px;
    border: 0;
    border-radius: var(--radius-md);
    background: var(--color-strong);
    color: #ffffff;
    font-weight: var(--font-weight-bold);
  }

  .error .ghost {
    border: 1px solid var(--color-border);
    background: transparent;
  }

  .bot-check {
    min-height: 70px;
    display: grid;
    place-items: center;
  }
</style>
