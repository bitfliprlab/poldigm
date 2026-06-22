<script lang="ts">
  export let text = '';
  export let highlights: string[] = [];

  type Segment = {
    text: string;
    highlighted: boolean;
  };

  $: terms = highlights
    .map((highlight) => highlight.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  $: segments = splitSegments(text, terms);

  function splitSegments(value: string, sortedTerms: string[]): Segment[] {
    if (!value || sortedTerms.length === 0) return [{ text: value, highlighted: false }];

    const result: Segment[] = [];
    let index = 0;

    while (index < value.length) {
      const match = sortedTerms.find((term) => value.startsWith(term, index));

      if (match) {
        result.push({ text: match, highlighted: true });
        index += match.length;
        continue;
      }

      const nextIndex = index + 1;
      const previous = result.at(-1);
      const character = value.slice(index, nextIndex);

      if (previous && !previous.highlighted) {
        previous.text += character;
      } else {
        result.push({ text: character, highlighted: false });
      }

      index = nextIndex;
    }

    return result;
  }
</script>

{#each segments as segment}
  {#if segment.highlighted}
    <strong>{segment.text}</strong>
  {:else}
    {segment.text}
  {/if}
{/each}
