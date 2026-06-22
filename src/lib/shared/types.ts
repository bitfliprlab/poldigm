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

export type QuestionChoiceDisplay = {
  label: string;
  body: string;
  highlights: string[];
};

export type QuestionDisplay = {
  promptLines: [string, string];
  promptHighlights: string[];
  choices: Record<Choice, QuestionChoiceDisplay>;
};

export type PublicQuestion = {
  id: string;
  phase: 1 | 2;
  axis: Axis;
  prompt: string;
  choices: Record<Choice, string>;
  display: QuestionDisplay;
  progress: {
    current: number;
    total: 20;
    label: string;
  };
};

export type Scores = Record<Letter, number>;

export type ResultAxisGauge = {
  left: Letter;
  right: Letter;
  leftPercent: number;
  winner: Letter;
  winnerPercent: number;
  directionLabel: string;
  strengthLabel: '강하게 기울어짐' | '기울어짐' | '균형에 가까움';
};

export type ResultViewModel = {
  typeCode: string;
  intensityTag: IntensityTag;
  title: string;
  subtitle: string;
  characterImg: string;
  description: string;
  axisGauges: ResultAxisGauge[];
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
