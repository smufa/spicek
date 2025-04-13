import { Tooltip, Badge } from '@mantine/core';
import { getFillerColor, getFillerDescription } from './utils';

export interface FillerToken {
  fillerType: 'PW' | 'FP' | 'RP' | 'RV' | 'RS';
  start_ms: number;
  end_ms: number;
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
        variant={active ? 'filled' : 'light'}
        style={{
          cursor: 'pointer',
        }}
        size="lg"
        radius="sm"
        mx="2px"
        color={active ? 'cyan' : getFillerColor(token.fillerType)}
        onClick={() => onClick(token.start_ms + 10)}
      >
        {token.fillerType}
      </Badge>
    </Tooltip>
  );
};
