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

export function mergeTokensByWhitespace(
  tokens: TranscriptToken[],
): TranscriptToken[] {
  const result: TranscriptToken[] = [];
  let buffer = '';
  let start_ms = tokens[0]?.start_ms ?? 0;
  let end_ms = tokens[0]?.end_ms ?? 0;
  let minConfidence = Infinity;

  for (const token of tokens) {
    const parts = token.text.split(/(\s+)/); // split by whitespace but keep it
    for (const part of parts) {
      if (part === '') continue;

      if (/\s+/.test(part)) {
        // End of word
        if (buffer) {
          result.push({
            text: buffer,
            start_ms,
            end_ms,
            confidence: minConfidence,
          });
          buffer = '';
          minConfidence = Infinity;
        }
      } else {
        if (buffer === '') {
          start_ms = token.start_ms;
        }
        buffer += part;
        end_ms = token.end_ms;
        minConfidence = Math.min(minConfidence, token.confidence);
      }
    }
  }

  if (buffer) {
    result.push({
      text: buffer,
      start_ms,
      end_ms,
      confidence: minConfidence,
    });
  }

  return result;
}
