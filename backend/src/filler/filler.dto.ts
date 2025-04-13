export class FillerDto {
  disfluency: Disfluency;
  transcription: Transcription[];
  wpm: number[];
}

export class Disfluency {
  FP: DisfluencyToken[];
  RP: DisfluencyToken[];
  RV: DisfluencyToken[];
  RS: DisfluencyToken[];
  PW: DisfluencyToken[];
}

export class DisfluencyToken {
  start_ms: number;
  end_ms: number;
}

export class Transcription {
  text: string;
  start_ms: number;
  end_ms: number;
  confidence: number;
}
