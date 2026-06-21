<script lang="ts">
  import type { PublicResult } from '$lib/shared/types';
  import { copyResultLink, saveCaptureImage } from '$lib/client/share';

  export let result: PublicResult;

  let message = '';
  let busy = false;

  async function copyLink() {
    await copyResultLink(result);
    message = '링크를 복사했어요.';
  }

  async function saveImage() {
    busy = true;
    message = '';
    try {
      await saveCaptureImage();
      message = '이미지 저장을 시작했어요.';
    } catch {
      message = '이미지 저장에 실패했어요. 링크 복사는 사용할 수 있습니다.';
    } finally {
      busy = false;
    }
  }
</script>

<div class="actions">
  <button class="primary" disabled={busy} onclick={saveImage}>이미지 저장</button>
  <button onclick={copyLink}>링크 복사</button>
  <a href="/">다시 하기</a>
</div>
{#if message}
  <p class="message" role="status">{message}</p>
{/if}

<style>
  .actions {
    position: sticky;
    bottom: 0;
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 8px;
    padding: 12px 0 calc(14px + env(safe-area-inset-bottom));
    background: linear-gradient(180deg, rgba(17, 24, 39, 0), var(--color-bg) 24%);
  }

  button,
  a {
    min-height: 48px;
    display: grid;
    place-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    text-decoration: none;
    font-weight: var(--font-weight-bold);
  }

  .primary {
    border-color: transparent;
    background: var(--color-primary);
    box-shadow: var(--shadow-primary-glow);
  }

  .message {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
    text-align: center;
  }
</style>
