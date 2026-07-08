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
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding: 0 0 2px;
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
    font-size: 15px;
    white-space: nowrap;
  }

  .primary {
    border-color: transparent;
    background: var(--color-primary);
    color: #ffffff;
  }

  .message {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--font-size-caption);
    text-align: center;
  }
</style>
