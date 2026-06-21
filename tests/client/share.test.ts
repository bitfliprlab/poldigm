import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('capture import boundary', () => {
  it('does not statically import html2canvas for SSR', () => {
    const source = readFileSync('src/lib/client/share.ts', 'utf8');

    expect(source).toContain("await import('html2canvas')");
    expect(source).not.toContain("import html2canvas from 'html2canvas'");
  });
});
