import { Text } from '@mantine/core';
import { TranscriptToken } from '../../api/model';

export const TextToken = ({
  token,
  onClick,
  active,
}: {
  token: TranscriptToken;
  onClick: (timestamp: number) => void;
  active: boolean;
}) => {
  return (
    <Text
      size="xl"
      // px="2px"
      style={{
        display: 'inline',
        cursor: 'pointer',
        transitionDuration: '0.1s',
      }}
      bg={active ? 'dark' : undefined}
      c={active ? 'white' : undefined}
      onClick={() => onClick(token.start_ms + 10)}
    >
      {token.text}
    </Text>
  );
};
