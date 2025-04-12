import { Text } from '@mantine/core';
import { Token } from './TextElement';

export interface TranscriptionToken extends Token {
  textContent: string;
}

export const TextToken = ({
  token,
  onClick,
  active,
}: {
  token: TranscriptionToken;
  onClick: (timestamp: number) => void;
  active: boolean;
}) => {
  return (
    <Text
      px="2px"
      style={{
        display: 'inline',
        cursor: 'pointer',
        transitionDuration: '0.1s',
      }}
      bg={active ? 'dark' : undefined}
      c={active ? 'white' : undefined}
      onClick={() => onClick(token.timeFromMs + 10)}
    >
      {token.textContent}
    </Text>
  );
};
