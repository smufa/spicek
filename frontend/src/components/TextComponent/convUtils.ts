import { Disfluency, TranscriptToken } from '../../api/model';

export type FillerType = 'PW' | 'FP' | 'RP' | 'RV' | 'RS';

export interface ConvertedDisfluency {
  start_ms: number;
  end_ms: number;
  fillerType: FillerType;
}

export function convertDisfluency(
  disfluency: Disfluency,
): ConvertedDisfluency[] {
  const result: ConvertedDisfluency[] = [];

  // Iterate through each filler type
  (Object.keys(disfluency) as FillerType[]).forEach((fillerType) => {
    const tokens = disfluency[fillerType];

    // Convert each token to the new format
    tokens.forEach((token) => {
      result.push({
        start_ms: token.start_ms,
        end_ms: token.end_ms,
        fillerType,
      });
    });
  });

  return result;
}

// Example usage:
// const disfluency: Disfluency = { ... };
// const converted = convertDisfluency(disfluency);
export function mergeSubwordTokens(
  tokens: TranscriptToken[],
): TranscriptToken[] {
  const result: TranscriptToken[] = [];
  let currentWord = '';
  let start = tokens[0]?.start_ms ?? 0;
  let end = tokens[0]?.end_ms ?? 0;
  let confidences: number[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const cleanText = token.text.trim();

    if (currentWord.length === 0) {
      start = token.start_ms;
    }

    currentWord += cleanText;
    end = token.end_ms;
    confidences.push(token.confidence);

    const isLastToken = i === tokens.length - 1;
    const nextTokenStartsWithSpace =
      !isLastToken && tokens[i + 1].text.startsWith(' ');

    if (isLastToken || nextTokenStartsWithSpace) {
      result.push({
        text: currentWord.trim(),
        start_ms: start,
        end_ms: end,
        confidence: Math.min(...confidences), // or use average if preferred
      });

      // Reset for next word
      currentWord = '';
      confidences = [];
    }
  }

  return result;
}
