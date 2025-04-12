import { Box } from '@mantine/core';
import { FillerToken } from './FillerToken';
import { isTranscriptionToken, isFillerToken } from './utils';
import { TextToken } from './TextToken';

export interface Token {
  timeFromMs: number;
  timeToMs: number;
}

export interface TextElementProps {
  tokens: Token[];
  fillers: FillerToken[];
  setTime: (timeMs: number) => void;
  timeMs: number;
}

const mergeTokensAndFillers = (
  tokens: Token[],
  fillers: FillerToken[],
): Token[] => {
  const data: Token[] = tokens.concat(fillers);
  return data;
};

export const TextElement = ({
  fillers,
  tokens,
  setTime,
  timeMs,
}: TextElementProps) => {
  const mergedTokens = mergeTokensAndFillers(tokens, fillers).sort(
    (a, b) => (a.timeFromMs + a.timeToMs) / 2 - (b.timeFromMs + b.timeToMs) / 2,
  );

  return (
    <Box
      style={
        {
          // justifyContent: 'space-between',
        }
      }
    >
      {mergedTokens.map((token) => {
        if (isTranscriptionToken(token)) {
          return (
            <TextToken
              key={token.timeFromMs}
              active={token.timeFromMs < timeMs && timeMs < token.timeToMs}
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
              key={token.timeFromMs}
            />
          );
        }
      })}
    </Box>
  );
};
