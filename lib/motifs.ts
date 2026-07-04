/**
 * Shared vocabulary for the motif kit. ASCII forms are plain data —
 * adding a new form is adding a string, no component changes.
 * Density ramp used: ` .':-=+*#%@`
 */

export const ASCII_FORMS = {
  /* her signature halftone four-petal flower */
  flower: `
      .:%%:.
    .%@@@@@@%.
    %@@@@@@@@%
 .:. '%@@@@%' .:.
:%@@%: '%%' :%@@%:
%@@@@@%:  :%@@@@@%
%@@@@@%:  :%@@@@@%
:%@@%: .%%. :%@@%:
 ':' .%@@@@%. ':'
    %@@@@@@@@%
    '%@@@@@@%'
      ':%%:'
`,

  /* a looser bloom — flower + leaves, for bigger texture moments */
  bloom: `
          .:*:.
        .:%@@@%:.      .
   *:.  %@@@@@@@%   .:*:.
  :%@%: '%@@@@@%' .:%@@%:.
   ':'  .:'%%%':. '%@@@@%'
      :%@%: : :%@%: ':%:'
      '%@' .*. '@%'    '
   .:. .:%@@@%:. .:.
  :%@%: %@@@@@% :%@%:
   ':'  '%@@@%'  ':'
     '    :%:    '
          :%:
       .  :%:  .
        '.:%:.'
          :%:
`,

  /* mugmood — the moka pot on the porch */
  moka: `
      ( (
     ) )
   ________
   \\ .::. /
    \\'::'/
    |----|
    | %% |
   /------\\
  / .:%%:. \\
 /__________\\
`,

  /* small delights */
  star: `
      .
     .*.
 ..:*%@%*:..
   '%@@@%'
    *@@@*
   *%' '%*
  .'     '.
`,

  sparkle: `
     .
    .:.
  .:%@%:.
 ::%@@@%::
  ':%@%:'
    ':'
     '
`,

  heart: `
  .:%%:..:%%:.
 :%@@@@%%@@@@%:
 %@@@@@@@@@@@@%
 '%@@@@@@@@@@%'
   '%@@@@@@%'
     '%@@%'
       ''
`,

  /* everloop — memory, return, cycles */
  loop: `
  .:*:.    .:*:.
 :%'  '%::%'  '%:
:%      %%      %:
:%      %%      %:
 :%.  .%::%.  .%:
  ':*:'    ':*:'
`,

  /* slowness, calm */
  wave: `
.:*:.      .:*:.      .:*:.
     ':.:'      ':.:'
  .:*:.      .:*:.      .:*
:'     ':.:'      ':.:'
`,

  /* tessera — mosaic tiles */
  tile: `
%%:: ::%% %%::
::%% %%:: ::%%
%%:: ::%% %%::
::%% %%:: ::%%
`,
} as const;

export type AsciiFormName = keyof typeof ASCII_FORMS;

const ACCENT_PRESETS = ['aurora', 'mugmood', 'everloop', 'tessera', 'wally'] as const;
export type AccentPreset = (typeof ACCENT_PRESETS)[number];

function isPreset(name: string): name is AccentPreset {
  return (ACCENT_PRESETS as readonly string[]).includes(name);
}

/** 'aurora' → 'var(--accent-aurora)'; raw CSS colors pass through; fallback is her accent. */
export function accentVar(name?: string): string {
  if (!name) return 'var(--color-accent)';
  if (isPreset(name)) return `var(--accent-${name})`;
  if (name.startsWith('#') || name.startsWith('var(') || name.startsWith('rgb')) return name;
  return 'var(--color-accent)';
}

/** 'aurora' → 'var(--grad-aurora)' (a comma-separated stop list token). */
export function gradientStops(name?: string): string {
  if (name && isPreset(name)) return `var(--grad-${name})`;
  return 'var(--color-accent), var(--color-peach)';
}

/** Which ASCII form stands in for a project when it has no imagery yet. */
export function motifForAccent(name?: string): AsciiFormName {
  switch (name) {
    case 'aurora':
      return 'flower';
    case 'mugmood':
      return 'moka';
    case 'everloop':
      return 'loop';
    case 'tessera':
      return 'tile';
    case 'wally':
      return 'star';
    default:
      return 'sparkle';
  }
}
