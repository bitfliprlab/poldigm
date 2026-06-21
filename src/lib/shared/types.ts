export type Axis = 'C_I' | 'T_P' | 'M_E' | 'O_L';
export type Letter = 'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L';
export type Choice = 'A' | 'B';
export type IntensityEffect = 'principle' | 'concession' | 'neutral';
export type BranchCondition = 'COMMON' | Letter | 'BALANCED';
export type IntensityTag = 'S' | 'M';
export type DeviceType = 'Mobile' | 'Desktop' | 'Tablet';

export type AnswerHistoryItem = {
  questionId: string;
  choice: Choice;
  answeredAt?: string;
};

export type PublicQuestion = {
  id: string;
  phase: 1 | 2;
  axis: Axis;
  prompt: string;
  choices: Record<Choice, string>;
  progress: {
    current: number;
    total: 20;
    label: string;
  };
};

export type Scores = Record<Letter, number>;

export type ResultViewModel = {
  typeCode: string;
  intensityTag: IntensityTag;
  title: string;
  subtitle: string;
  characterImg: string;
  description: string;
  chemistryBest: string;
  chemistryWorst: string;
};

export type PublicResult = {
  resultId: string;
  resultCode: string;
  locale: 'ko-KR';
  scores: Scores;
  resultViewModel: ResultViewModel;
};

export type ApiErrorCode =
  | 'validation_error'
  | 'bot_verification_failed'
  | 'abuse_suspected'
  | 'server_error';

export type ApiErrorBody = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};
