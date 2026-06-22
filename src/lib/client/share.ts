import type { PublicResult } from '$lib/shared/types';
import { appBaseUrl } from '$lib/constants/runtime';

export async function copyResultLink(result: PublicResult): Promise<void> {
  const url = `${appBaseUrl}/result/${result.resultId}`;
  await navigator.clipboard.writeText(url);
}

export async function saveCaptureImage(elementId = 'result-capture'): Promise<void> {
  const target = document.getElementById(elementId);
  if (!target) throw new Error('캡처 영역을 찾을 수 없습니다.');

  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(target, {
    backgroundColor: null,
    scale: 2,
    useCORS: true
  });

  const link = document.createElement('a');
  link.download = 'poldigm-result.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function shareText(result: PublicResult, nickname = ''): string {
  const ownerLabel = nickname ? `${nickname}님의 사회적·정치적 가치관은` : '나의 사회적·정치적 가치관은';
  return `${ownerLabel} [${result.resultViewModel.title}]\n${result.resultViewModel.subtitle}\n${appBaseUrl}`;
}
