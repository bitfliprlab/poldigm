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
  $: hue = [...typeCode].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 40;
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
        <stop offset="0%" stop-color={`hsl(${28 + hue}, 36%, 68%)`} />
        <stop offset="100%" stop-color={`hsl(${170 + hue}, 22%, 42%)`} />
      </linearGradient>
      <filter id={`glow-${typeCode}`} x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <rect x="16" y="16" width="228" height="228" rx="16" fill="#f6f1e8" stroke="#d8d0c2" stroke-width="2" />
    <path
      d="M42 190 C78 150, 86 82, 134 64 C180 46, 210 82, 222 126 C238 184, 190 228, 112 220 C78 216, 54 206, 42 190Z"
      fill={`url(#persona-${typeCode})`}
      opacity="0.22"
    />

    {#if first === 'C'}
      <circle cx="62" cy="90" r="9" fill="#111111" opacity="0.45" />
      <circle cx="198" cy="92" r="9" fill="#111111" opacity="0.45" />
      <path d="M72 94 C104 70, 154 70, 188 94" fill="none" stroke="#111111" stroke-width="3" opacity="0.28" />
    {:else}
      <path d="M48 72 L88 52 L80 100 Z" fill="#111111" opacity="0.18" />
      <path d="M212 72 L172 52 L180 100 Z" fill="#ff5a3d" opacity="0.28" />
    {/if}

    <g transform={`rotate(${poseTilt} 130 142)`}>
      <path
        d="M82 220 C88 172, 98 142, 130 142 C164 142, 176 172, 184 220 Z"
        fill="#fbfaf7"
        stroke={`hsl(${170 + hue}, 22%, 38%)`}
        stroke-width="4"
      />
      <path
        d="M94 190 C112 176, 148 176, 166 190"
        fill="none"
        stroke="#d8d0c2"
        stroke-width="5"
        stroke-linecap="round"
      />
      <circle
        cx={headX}
        cy="103"
        r="42"
        fill="#fffaf1"
      />
      <path
        d="M92 104 C102 70, 124 54, 158 68 C172 74, 181 90, 177 110 C154 94, 126 88, 92 104Z"
        fill="#464137"
      />
      <circle cx={headX - 14} cy="105" r="4" fill="#111827" />
      <circle cx={headX + 16} cy="105" r="4" fill="#111827" />
      <path d={`M${headX - 13} 124 C${headX - 2} 132, ${headX + 12} 132, ${headX + 22} 124`} fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" />
    </g>

    {#if second === 'P'}
      <path d="M194 152 L224 138 L218 172 Z" fill="#ff5a3d" opacity="0.7" />
      <path d="M38 154 L70 140 L62 176 Z" fill="#111111" opacity="0.44" />
    {:else}
      <rect x="38" y="142" width="34" height="34" rx="5" fill="#111111" opacity="0.16" />
      <rect x="188" y="142" width="34" height="34" rx="5" fill="#ff5a3d" opacity="0.22" />
    {/if}

    {#if accentShape === 'circle'}
      <circle cx="130" cy="208" r="15" fill="#4f6f52" opacity="0.74" />
    {:else}
      <path d="M130 190 L148 208 L130 226 L112 208 Z" fill="#ff5a3d" opacity="0.72" />
    {/if}

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
    width: min(38vw, 148px);
    max-width: 100%;
    aspect-ratio: 1;
    margin: 0 auto 8px;
  }

  img {
    display: block;
    object-fit: contain;
  }

  .illustration {
    display: block;
    filter: none;
  }

</style>
