export interface Token {
  timestamp: number;
  textContent: string;
}

export interface FillerTokens {
  timestamp: number;
  fillerType: 'PW' | 'FP' | 'RP' | 'RV' | 'RS';
}

export interface TextElementProps {
  tokens: Token[];
  fillers: FillerTokens[];
}

const mergeTokensAndFillers = (
  tokens: Token[],
  fillers: FillerTokens[],
): (Token | FillerTokens)[] => {
  const data: (FillerTokens | Token)[] = [];
};

// export const TextElement = ({ fillers, tokens }: TextElementProps) => {};
