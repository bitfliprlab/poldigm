<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import AppHeader from '$lib/components/layout/AppHeader.svelte';
  import ChoiceCard from '$lib/components/test/ChoiceCard.svelte';
  import ProgressBar from '$lib/components/test/ProgressBar.svelte';
  import type { AnswerHistoryItem, Choice, PublicQuestion, PublicResult } from '$lib/shared/types';
  import {
    appendAnswer,
    deviceType,
    getHistory,
    getPlayTimeSec,
    resetSession,
    saveLastResult
  } from '$lib/client/session';

  type NextQuestionResponse =
    | { status: 'in_progress'; question: PublicQuestion }
    | { status: 'completed'; nextAction: 'submit_result' };

  let question: PublicQuestion | null = null;
  let history: AnswerHistoryItem[] = [];
  let loading = true;
  let submitting = false;
  let errorMessage = '';
  let analysisProgress = 0;

  async function requestNextQuestion(currentHistory: AnswerHistoryItem[]) {
    const response = await fetch('/api/next-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history: currentHistory })
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.error?.message ?? '다음 질문을 불러오지 못했어요.');

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
        turnstileToken: 'local-mock-token',
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
      await requestNextQuestion(history);
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
    try {
      await requestNextQuestion([]);
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    if (new URLSearchParams(window.location.search).get('restart') === '1') {
      resetSession();
      window.history.replaceState({}, '', '/test');
    }

    history = getHistory();
    if (history.length >= 20) {
      resetSession();
      history = [];
    }

    try {
      await requestNextQuestion(history);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : '진행 정보를 복구하지 못했어요.';
    } finally {
      loading = false;
    }
  });
</script>

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
  {:else if question}
    <ProgressBar
      current={question.progress.current}
      total={question.progress.total}
      label={question.progress.label}
    />

    <article class="question-card">
      <span>{question.axis.replace('_', ' / ')}</span>
      <h1>{question.prompt}</h1>
    </article>

    <div class="choices">
      <ChoiceCard choice="A" text={question.choices.A} disabled={loading} onSelect={() => choose('A')} />
      <ChoiceCard choice="B" text={question.choices.B} disabled={loading} onSelect={() => choose('B')} />
    </div>
  {:else}
    <div class="analysis">
      <p>첫 질문을 준비하고 있습니다...</p>
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
    grid-template-rows: auto auto minmax(220px, 1fr) auto;
    gap: 24px;
  }

  .question-card {
    display: grid;
    align-content: center;
    gap: 18px;
    min-height: 260px;
  }

  .question-card span {
    color: var(--color-accent);
    font-size: var(--font-size-caption);
    font-weight: var(--font-weight-bold);
  }

  h1 {
    margin: 0;
    font-size: var(--font-size-question);
    line-height: var(--line-height-question);
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .choices {
    display: grid;
    gap: 14px;
    padding-bottom: 24px;
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
    color: var(--color-accent);
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
    border: 1px solid rgba(244, 63, 94, 0.4);
    border-radius: var(--radius-md);
    background: rgba(244, 63, 94, 0.08);
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
    color: var(--color-text);
    font-weight: var(--font-weight-bold);
  }

  .error .ghost {
    border: 1px solid var(--color-border);
    background: transparent;
  }
</style>
