import { Tooltip, Badge } from '@mantine/core';
import { Token } from './TextElement';
import { getFillerColor, getFillerDescription } from './utils';

export interface FillerToken extends Token {
  fillerType: 'PW' | 'FP' | 'RP' | 'RV' | 'RS';
}

export const FillerToken = ({
  token,
  onClick,
  active,
}: {
  token: FillerToken;
  onClick: (timestamp: number) => void;
  active: boolean;
}) => {
  return (
    <Tooltip
      label={getFillerDescription(token.fillerType)}
      style={{
        display: 'inline',
      }}
    >
      <Badge
        variant={active ? 'light' : 'outline'}
        style={{
          cursor: 'pointer',
        }}
        mx="2px"
        // py="lg"
        color={active ? 'cyan' : getFillerColor(token.fillerType)}
        onClick={() => onClick(token.timeFromMs + 10)}
      >
        {token.fillerType}
      </Badge>
    </Tooltip>
  );
};
