export class TranscriptToken {
  text: string;
  start_ms: number;
  end_ms: number;
  confidence: number;
}

// Main transcript DTO
export class Transcript {
  id: string;
  text: string;
  tokens: TranscriptToken[];
}
