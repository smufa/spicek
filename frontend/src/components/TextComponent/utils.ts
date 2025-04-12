import { MantineColor } from '@mantine/core';
import { FillerToken } from './FillerToken';
import { Token } from './TextElement';
import { TranscriptionToken } from './TextToken';

export function getFillerColor(
  fillerType: FillerToken['fillerType'],
): MantineColor {
  const colorMap: Record<FillerToken['fillerType'], MantineColor> = {
    PW: 'gray', // Pause word - neutral gray
    FP: 'yellow', // Filled pause - attention yellow
    RP: 'orange', // Repeated word - warning orange
    RV: 'blue', // Verbal filler - calm blue
    RS: 'red', // Speech error - alert red
  };

  return colorMap[fillerType];
}

export function getFillerDescription(
  fillerType: FillerToken['fillerType'],
): string {
  const descriptionMap: Record<FillerToken['fillerType'], string> = {
    FP: 'Filled pause', // e.g., "um", "uh"
    PW: 'Partial word', // e.g., word cutoffs
    RP: 'Repetition', // e.g., repeated phrases
    RV: 'Revision', // e.g., mid-sentence corrections
    RS: 'Restart', // e.g., abandoned sentences
  };

  return descriptionMap[fillerType];
}

// Type guard for TranscriptionToken
export function isTranscriptionToken(
  token: Token,
): token is TranscriptionToken {
  return (token as TranscriptionToken).textContent !== undefined;
}

// Type guard for FillerTokens
export function isFillerToken(token: Token): token is FillerToken {
  return (token as FillerToken).fillerType !== undefined;
}

// Type guard that checks for any token type
export function isToken(token: unknown): token is Token {
  return (
    typeof token === 'object' &&
    token !== null &&
    'timeFromMs' in token &&
    typeof (token as Token).timeFromMs === 'number'
  );
}
