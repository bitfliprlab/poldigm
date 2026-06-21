<script lang="ts">
  import { isLocalApp } from '$lib/constants/runtime';

  export let characterImg: string;
  export let title: string;
  export let typeCode: string;

  let failed = isLocalApp;

  $: first = typeCode[0] ?? 'C';
  $: second = typeCode[1] ?? 'T';
  $: third = typeCode[2] ?? 'M';
  $: fourth = typeCode[3] ?? 'O';
  $: hue = [...typeCode].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  $: poseTilt = fourth === 'L' ? -8 : fourth === 'O' ? 4 : 0;
  $: headX = first === 'I' ? 134 : 122;
  $: accentShape = third === 'E' ? 'circle' : 'diamond';
</script>

{#if failed}
  <svg
    class="illustration"
    role="img"
    aria-label={`${title} 캐릭터 일러스트`}
    viewBox="0 0 260 260"
  >
    <defs>
      <linearGradient id={`persona-${typeCode}`} x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color={`hsl(${hue}, 88%, 64%)`} />
        <stop offset="100%" stop-color={`hsl(${(hue + 72) % 360}, 86%, 58%)`} />
      </linearGradient>
      <filter id={`glow-${typeCode}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect x="16" y="16" width="228" height="228" rx="34" fill="rgba(15, 23, 42, 0.96)" />
    <path
      d="M42 190 C78 150, 86 82, 134 64 C180 46, 210 82, 222 126 C238 184, 190 228, 112 220 C78 216, 54 206, 42 190Z"
      fill={`url(#persona-${typeCode})`}
      opacity="0.18"
    />

    {#if first === 'C'}
      <circle cx="62" cy="90" r="9" fill="rgba(34, 211, 238, 0.72)" />
      <circle cx="198" cy="92" r="9" fill="rgba(34, 211, 238, 0.72)" />
      <path d="M72 94 C104 70, 154 70, 188 94" fill="none" stroke="rgba(34, 211, 238, 0.46)" stroke-width="3" />
    {:else}
      <path d="M48 72 L88 52 L80 100 Z" fill="rgba(34, 211, 238, 0.38)" />
      <path d="M212 72 L172 52 L180 100 Z" fill="rgba(99, 102, 241, 0.42)" />
    {/if}

    <g transform={`rotate(${poseTilt} 130 142)`}>
      <path
        d="M82 220 C88 172, 98 142, 130 142 C164 142, 176 172, 184 220 Z"
        fill="rgba(249, 250, 251, 0.12)"
        stroke={`hsl(${hue}, 88%, 66%)`}
        stroke-width="4"
      />
      <path
        d="M94 190 C112 176, 148 176, 166 190"
        fill="none"
        stroke="rgba(249, 250, 251, 0.22)"
        stroke-width="5"
        stroke-linecap="round"
      />
      <circle
        cx={headX}
        cy="103"
        r="42"
        fill="rgba(249, 250, 251, 0.9)"
      />
      <path
        d="M92 104 C102 70, 124 54, 158 68 C172 74, 181 90, 177 110 C154 94, 126 88, 92 104Z"
        fill={`hsl(${(hue + 210) % 360}, 42%, 18%)`}
      />
      <circle cx={headX - 14} cy="105" r="4" fill="#111827" />
      <circle cx={headX + 16} cy="105" r="4" fill="#111827" />
      <path d={`M${headX - 13} 124 C${headX - 2} 132, ${headX + 12} 132, ${headX + 22} 124`} fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" />
    </g>

    {#if second === 'P'}
      <path d="M194 152 L224 138 L218 172 Z" fill="rgba(244, 63, 94, 0.74)" filter={`url(#glow-${typeCode})`} />
      <path d="M38 154 L70 140 L62 176 Z" fill="rgba(34, 211, 238, 0.66)" />
    {:else}
      <rect x="38" y="142" width="34" height="34" rx="8" fill="rgba(34, 211, 238, 0.28)" />
      <rect x="188" y="142" width="34" height="34" rx="8" fill="rgba(99, 102, 241, 0.34)" />
    {/if}

    {#if accentShape === 'circle'}
      <circle cx="130" cy="208" r="15" fill="rgba(45, 212, 191, 0.78)" />
    {:else}
      <path d="M130 190 L148 208 L130 226 L112 208 Z" fill="rgba(244, 63, 94, 0.78)" />
    {/if}

    <text x="130" y="244" text-anchor="middle">{typeCode}</text>
  </svg>
{:else}
  <img
    src={`/assets/characters/${characterImg}`}
    alt={`${title} 캐릭터 일러스트`}
    onerror={() => (failed = true)}
  />
{/if}

<style>
  img,
  .illustration {
    width: min(64vw, 260px);
    max-width: 100%;
    aspect-ratio: 1;
    margin: 0 auto;
  }

  img {
    display: block;
    object-fit: contain;
  }

  .illustration {
    display: block;
    filter: drop-shadow(0 18px 30px rgba(0, 0, 0, 0.34));
  }

  text {
    fill: rgba(249, 250, 251, 0.82);
    font-size: 19px;
    font-weight: var(--font-weight-black);
    letter-spacing: 0;
  }
</style>
