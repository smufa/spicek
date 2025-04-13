import { Box } from '@mantine/core';
import { FillerToken } from './FillerToken';
import { isTranscriptionToken, isFillerToken } from './utils';
import { TextToken } from './TextToken';
import { TranscriptToken } from '../../api/model';
import { mergeSubwordTokens } from './convUtils';

export interface TextElementProps {
  tokens: TranscriptToken[];
  fillers: FillerToken[];
  setTime: (timeMs: number) => void;
  timeMs: number;
}

export interface Token {
  start_ms: number;
  end_ms: number;
}

const mergeTokensAndFillers = (
  tokens: TranscriptToken[],
  fillers: FillerToken[],
): Token[] => {
  const data: Token[] = (tokens as Token[]).concat(fillers);
  return data;
};

export const TextElement = ({
  fillers,
  tokens,
  setTime,
  timeMs,
}: TextElementProps) => {
  const tokens2 = mergeSubwordTokens(tokens);
  const mergedTokens = mergeTokensAndFillers(tokens2, fillers).sort(
    (a, b) => (a.start_ms + a.end_ms) / 2 - (b.start_ms + b.end_ms) / 2,
  );

  return (
    <Box>
      {mergedTokens.map((token) => {
        if (isTranscriptionToken(token)) {
          return (
            <TextToken
              key={token.start_ms + '' + token.text}
              active={token.start_ms < timeMs && timeMs < token.end_ms}
              token={token}
              onClick={setTime}
            />
          );
        }
        if (isFillerToken(token)) {
          return (
            <FillerToken
              active={false}
              token={token}
              onClick={setTime}
              key={token.start_ms + token.fillerType}
            />
          );
        }
      })}
    </Box>
  );
};
