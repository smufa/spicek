import { FillerToken } from './FillerToken';
import { TranscriptionToken } from './TextToken';

// Transcription Tokens (Words with precise time ranges)
export const transcriptionTokens: TranscriptionToken[] = [
  { timeFromMs: 0, timeToMs: 300, textContent: 'Okay' },
  { timeFromMs: 300, timeToMs: 600, textContent: 'so' },
  { timeFromMs: 600, timeToMs: 900, textContent: 'the' },
  { timeFromMs: 900, timeToMs: 1200, textContent: 'main' },
  { timeFromMs: 1200, timeToMs: 1600, textContent: 'issue' },
  { timeFromMs: 1600, timeToMs: 1900, textContent: 'is' },
  { timeFromMs: 1900, timeToMs: 2200, textContent: 'that' },
  { timeFromMs: 2200, timeToMs: 2500, textContent: 'we' },
  { timeFromMs: 2500, timeToMs: 2900, textContent: 'need' },
  { timeFromMs: 2900, timeToMs: 3200, textContent: 'to' },
  { timeFromMs: 3200, timeToMs: 3600, textContent: 'fix' },
  { timeFromMs: 3600, timeToMs: 4000, textContent: 'this' },
  { timeFromMs: 4000, timeToMs: 4400, textContent: 'now' },
  // ... (80+ additional words following same pattern)
];

// Filler Tokens (Disfluencies with precise time ranges)
export const fillerTokens: FillerToken[] = [
  { timeFromMs: 280, timeToMs: 420, fillerType: 'FP' }, // "uh" overlapping end of "Okay"
  { timeFromMs: 1150, timeToMs: 1300, fillerType: 'PW' }, // "ma-" cutoff before "main"
  { timeFromMs: 2100, timeToMs: 2250, fillerType: 'RP' }, // "that-" repetition
  { timeFromMs: 3400, timeToMs: 3550, fillerType: 'RV' }, // "fi-" revision
  // ... (20+ additional fillers following same pattern)
];

// Example combined timeline (first 5 seconds):
/*
  0-300ms: "Okay"
  280-420ms: [FP]
  300-600ms: "so"
  600-900ms: "the"
  900-1200ms: "main"
  1150-1300ms: [PW]
  1200-1600ms: "issue"
  ...
*/
