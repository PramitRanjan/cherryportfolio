import { ASCII_FORMS, accentVar, type AsciiFormName } from '@/lib/motifs';

export interface AsciiArtProps {
  form: AsciiFormName;
  tint?: string;
  className?: string;
}

/** Trims the leading/trailing blank lines the ASCII_FORMS template strings carry. */
function trimForm(raw: string): string {
  return raw.replace(/^\n+/, '').replace(/\n+$/, '');
}

/**
 * Renders one of the shared ASCII glyphs (`lib/motifs.ts`) as decorative,
 * token-tinted texture. Purely presentational — always `aria-hidden`.
 */
export default function AsciiArt({ form, tint, className }: AsciiArtProps) {
  return (
    <pre
      aria-hidden="true"
      className={`select-none pointer-events-none whitespace-pre font-[family-name:var(--font-mono)] ${className ?? ''}`}
      style={{
        color: accentVar(tint),
        lineHeight: 1.05,
        margin: 0,
      }}
    >
      {trimForm(ASCII_FORMS[form])}
    </pre>
  );
}
