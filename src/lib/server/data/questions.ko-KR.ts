import type { Axis, Choice, Letter, QuestionDisplay } from '$lib/shared/types';
import { AXIS_SIDES } from '$lib/shared/constants';
import type { QuestionDefinition } from './types';

type AxisCopy = {
  axis: Axis;
  compact: string;
  left: Letter;
  right: Letter;
  phase1: Array<{
    prompt: string;
    leftChoice: string;
    rightChoice: string;
  }>;
  leftBranch: string[];
  rightBranch: string[];
  balanced: string[];
  leftPrinciples: string[];
  rightPrinciples: string[];
  leftConcessions: string[];
  rightConcessions: string[];
  balancedLeftChoices: string[];
  balancedRightChoices: string[];
};

const AXIS_COPY: AxisCopy[] = [
  {
    axis: 'C_I',
    compact: 'CI',
    left: 'C',
    right: 'I',
    phase1: [
      {
        prompt: '아파트 단톡방에서 분실 사고를 막자며 출입 기록 공유를 요구합니다.',
        leftChoice: '불편해도 반복 피해를 줄이는 확인 절차를 먼저 둔다.',
        rightChoice: '불안해도 개인의 출입 기록은 함부로 공유하지 않는다.'
      },
      {
        prompt: '공유 사무실에서 모두 같은 예약 규칙을 쓰자는 말이 나옵니다.',
        leftChoice: '예외가 줄어들도록 같은 규칙을 먼저 적용한다.',
        rightChoice: '조금 복잡해져도 각자의 일하는 방식을 더 인정한다.'
      }
    ],
    leftBranch: [
      '당신이 세운 확인 절차 때문에 한 사람이 계속 감시받는다고 느낍니다.',
      '피해를 막는 규칙이 늦게 온 사람의 급한 사정을 막아섭니다.',
      '모두를 지키자는 절차가 특정 사람에게만 더 번거롭게 작동합니다.'
    ],
    rightBranch: [
      '동의를 기다리는 사이 같은 피해가 한 번 더 발생했습니다.',
      '자율에 맡겼더니 일부가 허점을 이용해 책임을 피합니다.',
      '각자 선택을 존중하자 공통 대응이 매번 늦어집니다.'
    ],
    balanced: [
      '분실 사고가 잦은 공간에서 출입 기록을 남길지 정해야 합니다.',
      '공용 냉장고 규칙을 자세히 만들수록 개인 사정은 줄어듭니다.',
      '위험 알림을 빠르게 보내려면 누군가의 위치 정보가 필요합니다.'
    ],
    leftPrinciples: [
      '감시처럼 느껴져도 피해를 막는 확인 절차는 유지한다.',
      '급한 사정이 있어도 공통 규칙을 먼저 통과하게 한다.',
      '불편이 한쪽에 몰려도 신뢰를 위한 절차는 그대로 둔다.'
    ],
    rightPrinciples: [
      '피해가 반복돼도 동의 없는 기록 공유는 넘지 않는다.',
      '일부가 악용해도 모두의 자율을 먼저 줄이지 않는다.',
      '대응이 늦어져도 각자가 동의할 절차를 남긴다.'
    ],
    leftConcessions: [
      '절차는 두되 누가 무엇을 보는지 더 좁게 제한한다.',
      '규칙은 유지하되 급한 사정에는 좁은 예외를 둔다.',
      '절차는 줄이고 부담이 한 사람에게 몰리지 않게 바꾼다.'
    ],
    rightConcessions: [
      '반복 피해를 막기 위해 필요한 기록만 잠시 허용한다.',
      '악용이 반복되는 부분에는 공통 기준을 새로 둔다.',
      '대응이 무너지지 않도록 최소한의 조율은 받아들인다.'
    ],
    balancedLeftChoices: [
      '기록을 남기되 열람 권한과 보관 기간을 짧게 묶는다.',
      '같은 규칙을 먼저 두고 예외는 신청하게 한다.',
      '위치 공유를 허용하되 긴급 알림에만 쓰게 한다.'
    ],
    balancedRightChoices: [
      '기록 공유는 동의한 사람에게만 좁게 적용한다.',
      '개별 사정을 먼저 듣고 필요한 규칙만 남긴다.',
      '위치 공유보다 거절할 수 있는 절차를 먼저 둔다.'
    ]
  },
  {
    axis: 'T_P',
    compact: 'TP',
    left: 'T',
    right: 'P',
    phase1: [
      {
        prompt: '동네 축제에서 오래된 의식과 새로운 공연 제안이 충돌합니다.',
        leftChoice: '익숙한 순서를 유지하고 바꿀 부분은 천천히 논의한다.',
        rightChoice: '새로 온 사람들도 편하게 참여하도록 방식을 먼저 바꾼다.'
      },
      {
        prompt: '학교 행사 복장 규정을 두고 단정함과 자기표현이 부딪힙니다.',
        leftChoice: '행사의 공통 분위기를 위해 기본 복장선을 먼저 둔다.',
        rightChoice: '행사를 망치지 않는 한 각자의 표현을 먼저 허용한다.'
      }
    ],
    leftBranch: [
      '지켜온 방식 때문에 새로 온 사람이 행사 준비에서 빠졌다고 느낍니다.',
      '천천히 바꾸는 사이 불편을 겪는 사람은 또 기다려야 합니다.',
      '익숙한 절차를 지키느라 필요한 변화가 매번 뒤로 밀립니다.'
    ],
    rightBranch: [
      '새 방식을 열자 오래 지켜온 사람들이 밀려났다고 느낍니다.',
      '먼저 바꿨지만 바뀐 이유를 듣지 못한 사람들이 규칙을 믿지 못합니다.',
      '표현을 넓히자 행사의 오래된 상징이 흐려졌다는 말이 나옵니다.'
    ],
    balanced: [
      '입학식에서 오래된 절차를 줄이면 누군가는 서운해합니다.',
      '동호회 규칙을 고치면 새 회원은 편하고 기존 회원은 불안합니다.',
      '기념행사에서 익숙한 상징과 새 표현을 함께 둘 수 없습니다.'
    ],
    leftPrinciples: [
      '새로 온 사람이 낯설어도 오래된 방식은 쉽게 흔들지 않는다.',
      '불편이 이어져도 모두가 이해할 시간을 먼저 둔다.',
      '변화가 늦어져도 익숙한 절차의 신뢰를 먼저 지킨다.'
    ],
    rightPrinciples: [
      '기존 사람들이 낯설어도 새 참여 방식은 먼저 열어둔다.',
      '설명이 부족해도 필요한 변화라면 먼저 시작한다.',
      '상징이 약해져도 다양한 표현을 같은 자리에 둔다.'
    ],
    leftConcessions: [
      '방식은 지키되 새로 온 사람이 맡을 자리를 따로 만든다.',
      '절차는 유지하되 기다리는 사람에게 임시 예외를 둔다.',
      '기존 절차를 남기되 이번에는 바꿀 항목을 못 박는다.'
    ],
    rightConcessions: [
      '새 방식을 열되 기존 사람들이 따라올 시간을 둔다.',
      '먼저 바꾸기보다 이유와 순서를 더 설득한 뒤 진행한다.',
      '표현은 넓히되 오래된 상징 일부는 남긴다.'
    ],
    balancedLeftChoices: [
      '절차는 남기고 가장 부담스러운 부분만 줄인다.',
      '기존 회원이 따라올 속도에 맞춰 규칙을 고친다.',
      '익숙한 상징을 중심에 두고 새 표현은 옆에 둔다.'
    ],
    balancedRightChoices: [
      '새 참여자가 빠지지 않도록 절차부터 다시 짠다.',
      '불안이 있어도 새 기준을 먼저 적용하고 설명을 붙인다.',
      '새 표현을 중심에 두고 오래된 상징은 다시 해석한다.'
    ]
  },
  {
    axis: 'M_E',
    compact: 'ME',
    left: 'M',
    right: 'E',
    phase1: [
      {
        prompt: '놀이공원 우선탑승권 때문에 일반 대기줄이 더 길어졌다는 불만이 나옵니다.',
        leftChoice: '추가 비용을 낸 사람의 빠른 이용은 하나의 선택지로 인정한다.',
        rightChoice: '일반 이용자의 대기 부담이 커진다면 우선권은 제한한다.'
      },
      {
        prompt: '장학금 심사에서 높은 점수와 어려운 가정 형편을 함께 봐야 합니다.',
        leftChoice: '최종 점수와 준비 결과를 기준으로 뽑는다.',
        rightChoice: '출발 조건이 어려운 사람에게 보정 기회를 준다.'
      }
    ],
    leftBranch: [
      '성과자에게 자원이 몰리자 조용히 버틴 팀원이 팀을 떠납니다.',
      '차등 보상이 커지자 협업보다 자기 실적만 앞세우는 분위기가 생깁니다.',
      '결과만 보니 시작부터 불리했던 사람은 계속 뒤처집니다.'
    ],
    rightBranch: [
      '보상 격차를 줄이자 많이 기여한 사람이 억울하다고 말합니다.',
      '보정 기준이 늘어나자 누가 왜 뽑혔는지 설명하기 어려워집니다.',
      '안정 지원이 커지자 부담 큰 역할을 맡으려는 사람이 줄어듭니다.'
    ],
    balanced: [
      '보너스 예산은 적고, 최고 성과자와 생계가 급한 팀원이 있습니다.',
      '채용 최종 대상자는 점수가 높거나 환경이 어려운 사람으로 갈립니다.',
      '성과급을 키우면 최저 보장이 줄고, 보장을 키우면 성과급이 줄어듭니다.'
    ],
    leftPrinciples: [
      '팀원이 빠져도 큰 기여에는 확실한 자원을 몰아준다.',
      '협업이 약해져도 보상 차이는 분명히 둔다.',
      '불리한 출발이 있어도 결과 기준은 흔들지 않는다.'
    ],
    rightPrinciples: [
      '성과자가 억울해도 보상 격차는 일정 선에서 막는다.',
      '설명이 복잡해져도 출발선 차이는 심사에 넣는다.',
      '성과 압박이 줄어도 기본 안정은 먼저 넓힌다.'
    ],
    leftConcessions: [
      '큰 보상은 주되 버티는 사람의 최소 몫은 남긴다.',
      '차등은 두되 협업을 해치는 수준은 줄인다.',
      '결과 기준은 유지하되 불리한 조건은 일부 반영한다.'
    ],
    rightConcessions: [
      '격차는 줄이되 큰 기여에 대한 추가 보상은 남긴다.',
      '보정은 하되 누가 봐도 설명되는 기준만 쓴다.',
      '안정 지원은 두되 부담 큰 역할의 보상도 남긴다.'
    ],
    balancedLeftChoices: [
      '최고 성과자에게 먼저 주고, 남은 몫으로 급한 사람을 돕는다.',
      '점수를 먼저 보고 어려운 형편은 보조 기준으로 둔다.',
      '성과급을 먼저 지키고 최소 보장은 얇게 남긴다.'
    ],
    balancedRightChoices: [
      '생계가 급한 사람을 먼저 돕고 성과 보상은 줄인다.',
      '어려운 형편을 먼저 보정하고 그 뒤 점수를 본다.',
      '최저 보장을 먼저 지키고 성과급은 남는 범위에서 준다.'
    ]
  },
  {
    axis: 'O_L',
    compact: 'OL',
    left: 'O',
    right: 'L',
    phase1: [
      {
        prompt: '광장에서 소음 민원이 늘자 공연 허가 기준을 만들자고 합니다.',
        leftChoice: '예상되는 피해를 줄이도록 허가 기준을 먼저 둔다.',
        rightChoice: '민원이 있어도 자유롭게 시도할 공간은 넓게 둔다.'
      },
      {
        prompt: '아파트 단지에 배달 로봇을 들이자는 제안이 나왔습니다.',
        leftChoice: '사고가 나기 전에 운행 기준을 먼저 세운다.',
        rightChoice: '먼저 운행해보고 문제가 확인되면 그때 고친다.'
      }
    ],
    leftBranch: [
      '아직 문제없던 작은 행동까지 금지 목록에 들어갑니다.',
      '기준을 강화하자 새로 시작하려던 사람이 허가 앞에서 멈춥니다.',
      '규칙이 자세해질수록 사람들은 스스로 판단하지 않게 됩니다.'
    ],
    rightBranch: [
      '자율에 맡겼더니 일부가 뒷정리 없이 자리를 떠납니다.',
      '먼저 허용한 시도가 실패해 주변 사람이 뒤처리를 맡게 됩니다.',
      '자유로운 이용이 늘자 조용히 쓰던 사람들의 불편이 커집니다.'
    ],
    balanced: [
      '광장 사용을 예약제로 바꾸면 즉흥 공연은 줄어듭니다.',
      '배달 로봇을 열어두면 편하지만 사고 책임자가 분명하지 않습니다.',
      '공용 라운지를 자유롭게 쓰게 하면 쉬고 싶은 사람은 불편합니다.'
    ],
    leftPrinciples: [
      '작은 행동까지 묶여도 문제가 생기기 전에 기준을 세운다.',
      '새 시도가 막혀도 반복 문제는 더 강한 기준으로 줄인다.',
      '판단 여지가 줄어도 공공장소의 예측 가능성을 먼저 둔다.'
    ],
    rightPrinciples: [
      '뒷정리 문제가 생겨도 이용 방식은 먼저 열어둔다.',
      '뒤처리 부담이 생겨도 새 시도는 먼저 허용한다.',
      '불편한 사람이 있어도 선택할 자유를 먼저 존중한다.'
    ],
    leftConcessions: [
      '피해가 분명하지 않은 행동은 금지 목록에서 뺀다.',
      '기준은 두되 새 시도가 통과할 작은 길을 남긴다.',
      '규칙은 줄이고 현장에서 판단할 여지를 남긴다.'
    ],
    rightConcessions: [
      '뒷정리가 반복되면 이용 전 최소 규칙을 둔다.',
      '실패 비용이 남에게 가면 사전 기준을 먼저 둔다.',
      '불편이 커지는 공간에는 이용 시간과 범위를 정한다.'
    ],
    balancedLeftChoices: [
      '예약제를 먼저 두고 즉흥 공연은 남는 시간에 허용한다.',
      '운행 기준과 책임자를 정한 뒤 로봇을 허용한다.',
      '라운지 이용 시간과 소음 기준을 먼저 정한다.'
    ],
    balancedRightChoices: [
      '즉흥 공연을 열어두고 민원이 쌓이면 조정한다.',
      '먼저 운행해보고 사고가 생긴 지점을 고친다.',
      '자유 이용을 유지하고 불편은 신고 후 조정한다.'
    ]
  }
];

const LETTER_DISPLAY: Record<Letter, { label: string; highlights: string[] }> = {
  C: { label: '먼저 막기', highlights: ['피해', '확인', '절차', '기록'] },
  I: { label: '동의 먼저', highlights: ['동의', '사생활', '자율', '선택'] },
  T: { label: '천천히 바꾸기', highlights: ['오래된', '익숙한', '절차', '신뢰'] },
  P: { label: '먼저 열어두기', highlights: ['새로운', '참여', '표현', '변화'] },
  M: { label: '기여대로', highlights: ['성과', '기여', '점수', '보상'] },
  E: { label: '버틸 만큼', highlights: ['버틸', '출발', '안정', '보정'] },
  O: { label: '미리 정하기', highlights: ['규칙', '기준', '피해', '예측'] },
  L: { label: '해보고 고치기', highlights: ['자유', '시도', '허용', '조정'] }
};

function splitPrompt(prompt: string): [string, string] {
  const normalized = prompt.trim();
  const commaIndex = normalized.indexOf(',');
  if (commaIndex > 10 && commaIndex < normalized.length - 10) {
    return [normalized.slice(0, commaIndex + 1), normalized.slice(commaIndex + 1).trim()];
  }

  const words = normalized.split(' ');
  if (words.length < 4) return [normalized, normalized];

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function highlightsForText(text: string, highlights: string[]): string[] {
  const contained = unique(highlights).filter((highlight) => text.includes(highlight));
  if (contained.length > 0) return contained.slice(0, 6);

  return unique(
    text
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 2)
      .slice(0, 2)
  );
}

function choiceDisplay(label: string, body: string, highlights: string[]): QuestionDisplay['choices'][Choice] {
  const labelHighlights = label.split(' ').filter((word) => word.length >= 2);
  return {
    label,
    body,
    highlights: highlightsForText(`${label} ${body}`, [...labelHighlights, ...highlights]).slice(0, 5)
  };
}

function phase1ScenarioTag(axis: Axis, order: 1 | 2): string {
  const tags: Record<Axis, Record<1 | 2, string>> = {
    C_I: { 1: 'privacy', 2: 'shared-space' },
    T_P: { 1: 'lifestyle-change', 2: 'education' },
    M_E: { 1: 'workplace-reward', 2: 'selection' },
    O_L: { 1: 'public-space', 2: 'innovation' }
  };

  return tags[axis][order];
}

function phase2ScenarioTag(branchCondition: QuestionDefinition['branchCondition'], order: 1 | 2 | 3): string {
  if (branchCondition === 'BALANCED') {
    const balancedTags: Record<1 | 2 | 3, string> = {
      1: 'resource-tradeoff',
      2: 'social-rules',
      3: 'risk-control'
    };
    return balancedTags[order];
  }

  const branchTags: Record<1 | 2 | 3, string> = {
    1: 'public-policy',
    2: 'procedure',
    3: 'trust-conflict'
  };

  return branchTags[order];
}

function variantScenarioTag(base: QuestionDefinition, variantOrder: number): string {
  if (variantOrder === 2) return base.metadata.scenarioTag;
  if (base.phase === 1) return 'value-frame';
  if (base.branchCondition === 'BALANCED') return 'balanced-frame';
  return 'principle-pressure';
}

function createDisplay(params: {
  prompt: string;
  promptHighlights: string[];
  choiceLabels: Record<Choice, string>;
  choices: Record<Choice, string>;
  choiceHighlights: Record<Choice, string[]>;
}): QuestionDisplay {
  return {
    promptLines: splitPrompt(params.prompt),
    promptHighlights: highlightsForText(params.prompt, params.promptHighlights),
    choices: {
      A: choiceDisplay(params.choiceLabels.A, params.choices.A, params.choiceHighlights.A),
      B: choiceDisplay(params.choiceLabels.B, params.choices.B, params.choiceHighlights.B)
    }
  };
}

function phase1Question(copy: AxisCopy, order: 1 | 2): QuestionDefinition {
  const phase = copy.phase1[order - 1];
  const choices = {
    A: phase.leftChoice,
    B: phase.rightChoice
  };
  const slotId = `Q_1_${copy.axis}_${order}`;
  return {
    id: slotId,
    metadata: {
      scenarioTag: phase1ScenarioTag(copy.axis, order),
      copyFamily: 'base-copy',
      toneTag: order === 1 ? 'daily' : 'institutional'
    },
    locale: 'ko-KR',
    axis: copy.axis,
    phase: 1,
    branchCondition: 'COMMON',
    commonOrder: order,
    prompt: phase.prompt,
    choices,
    display: createDisplay({
      prompt: phase.prompt,
      promptHighlights: [...LETTER_DISPLAY[copy.left].highlights, ...LETTER_DISPLAY[copy.right].highlights],
      choiceLabels: {
        A: LETTER_DISPLAY[copy.left].label,
        B: LETTER_DISPLAY[copy.right].label
      },
      choices,
      choiceHighlights: {
        A: LETTER_DISPLAY[copy.left].highlights,
        B: LETTER_DISPLAY[copy.right].highlights
      }
    }),
    scoreEffect: {
      A: { [copy.left]: 20 },
      B: { [copy.right]: 20 }
    },
    intensityEffect: {
      A: 'neutral',
      B: 'neutral'
    }
  };
}

function branchQuestion(copy: AxisCopy, target: Letter, order: 1 | 2 | 3): QuestionDefinition {
  const isLeft = target === copy.left;
  const prompt = (isLeft ? copy.leftBranch : copy.rightBranch)[order - 1];
  const choices = {
    A: (isLeft ? copy.leftPrinciples : copy.rightPrinciples)[order - 1],
    B: (isLeft ? copy.leftConcessions : copy.rightConcessions)[order - 1]
  };
  const slotId = `Q_2_${target}_${order}`;
  return {
    id: slotId,
    metadata: {
      scenarioTag: phase2ScenarioTag(target, order),
      copyFamily: 'base-copy',
      toneTag: order === 3 ? 'crisis' : 'institutional'
    },
    locale: 'ko-KR',
    axis: copy.axis,
    phase: 2,
    branchCondition: target,
    branchOrder: order,
    prompt,
    choices,
    display: createDisplay({
      prompt,
      promptHighlights: LETTER_DISPLAY[target].highlights,
      choiceLabels: {
        A: '그대로 간다',
        B: '한발 물린다'
      },
      choices,
      choiceHighlights: {
        A: LETTER_DISPLAY[target].highlights,
        B: ['예외', '조정', ...LETTER_DISPLAY[target].highlights]
      }
    }),
    scoreEffect: {
      A: { [target]: 20 },
      B: {}
    },
    intensityEffect: {
      A: 'principle',
      B: 'concession'
    }
  };
}

function balancedQuestion(copy: AxisCopy, order: 1 | 2 | 3): QuestionDefinition {
  const prompt = copy.balanced[order - 1];
  const choices = {
    A: copy.balancedLeftChoices[order - 1],
    B: copy.balancedRightChoices[order - 1]
  };
  const slotId = `Q_2_${copy.compact}_BAL_${order}`;
  return {
    id: slotId,
    metadata: {
      scenarioTag: phase2ScenarioTag('BALANCED', order),
      copyFamily: 'base-copy',
      toneTag: order === 1 ? 'daily' : 'institutional'
    },
    locale: 'ko-KR',
    axis: copy.axis,
    phase: 2,
    branchCondition: 'BALANCED',
    branchOrder: order,
    prompt,
    choices,
    display: createDisplay({
      prompt,
      promptHighlights: [...LETTER_DISPLAY[copy.left].highlights, ...LETTER_DISPLAY[copy.right].highlights],
      choiceLabels: {
        A: LETTER_DISPLAY[copy.left].label,
        B: LETTER_DISPLAY[copy.right].label
      },
      choices,
      choiceHighlights: {
        A: LETTER_DISPLAY[copy.left].highlights,
        B: LETTER_DISPLAY[copy.right].highlights
      }
    }),
    scoreEffect: {
      A: { [copy.left]: 20 },
      B: { [copy.right]: 20 }
    },
    intensityEffect: {
      A: 'neutral',
      B: 'neutral'
    }
  };
}

export const questions: QuestionDefinition[] = AXIS_COPY.flatMap((copy) => {
  const [left, right] = AXIS_SIDES[copy.axis];
  return [
    phase1Question(copy, 1),
    phase1Question(copy, 2),
    branchQuestion(copy, left, 1),
    branchQuestion(copy, left, 2),
    branchQuestion(copy, left, 3),
    branchQuestion(copy, right, 1),
    branchQuestion(copy, right, 2),
    branchQuestion(copy, right, 3),
    balancedQuestion(copy, 1),
    balancedQuestion(copy, 2),
    balancedQuestion(copy, 3)
  ];
});

type VariantCopy = { prompt: string; choices: Record<Choice, string> };

const phase1VariantCopy: Record<string, VariantCopy> = {
  Q_1_C_I_1: {
    prompt: '관리실이 안전을 위해 방문자 명단을 더 오래 보관하자고 합니다.',
    choices: {
      A: '피해를 막는 데 필요한 기간만큼은 명단 보관을 허용한다.',
      B: '안전 목적이어도 방문 기록은 짧게 남겨야 한다.'
    }
  },
  Q_1_C_I_2: {
    prompt: '공용 세탁실에서 예약 시간을 넘기는 사람 때문에 갈등이 납니다.',
    choices: {
      A: '모두에게 똑같이 적용되는 벌점 규칙을 먼저 만든다.',
      B: '사정이 있을 수 있으니 조정할 여지를 남긴다.'
    }
  },
  Q_1_T_P_1: {
    prompt: '가족 모임에서 오래된 호칭과 새 가족의 불편함이 부딪힙니다.',
    choices: {
      A: '오래 이어진 호칭은 천천히 바꾸는 편이 낫다.',
      B: '불편한 사람이 있다면 부르는 방식부터 바꾼다.'
    }
  },
  Q_1_T_P_2: {
    prompt: '동아리 신입 교육에서 오래된 환영 의식을 계속할지 말이 나옵니다.',
    choices: {
      A: '불편해도 함께 해온 의식의 의미를 먼저 알려준다.',
      B: '새 회원이 부담을 느낀다면 참여 방식을 먼저 바꾼다.'
    }
  },
  Q_1_M_E_1: {
    prompt: '놀이공원 우선탑승권 때문에 일반 대기줄이 더 길어졌다는 불만이 나옵니다.',
    choices: {
      A: '추가 비용을 낸 사람의 빠른 이용은 하나의 선택지로 인정한다.',
      B: '일반 이용자의 대기 부담이 커진다면 우선권은 제한한다.'
    }
  },
  Q_1_M_E_2: {
    prompt: '인턴 선발에서 높은 점수와 어려운 환경을 함께 봐야 합니다.',
    choices: {
      A: '점수와 결과가 분명한 사람을 먼저 뽑는다.',
      B: '환경의 차이를 감안해 기회를 보정한다.'
    }
  },
  Q_1_O_L_1: {
    prompt: '공원에서 밤늦은 운동 모임을 제한하자는 민원이 들어옵니다.',
    choices: {
      A: '소음 피해를 줄이도록 시간 제한을 먼저 둔다.',
      B: '실제 피해가 크지 않다면 이용 자유를 넓게 둔다.'
    }
  },
  Q_1_O_L_2: {
    prompt: '무인 판매대를 열려는데 물건 분실과 장난 구매를 걱정합니다.',
    choices: {
      A: '문제가 생기기 전에 이용 기준을 먼저 세운다.',
      B: '먼저 열어보고 문제가 보이면 그때 고친다.'
    }
  }
};

function phase1GeneratedVariantCopy(question: QuestionDefinition): VariantCopy {
  const overrides: Record<string, VariantCopy> = {
    Q_1_C_I_1: {
      prompt: '건물 출입 앱에 방문 시간이 자동 저장된다는 안내가 붙었습니다.',
      choices: {
        A: '도난과 사고를 줄이는 데 필요하다면 저장을 허용한다.',
        B: '편리해도 개인의 출입 시간은 남기지 않는 편이 낫다.'
      }
    },
    Q_1_C_I_2: {
      prompt: '공용 주방 사용법을 두고 세세한 규칙과 자율 정리가 맞섭니다.',
      choices: {
        A: '갈등을 줄이려면 누구에게나 같은 사용 규칙을 둔다.',
        B: '조금 어수선해도 각자 조율할 여지를 더 남긴다.'
      }
    },
    Q_1_T_P_1: {
      prompt: '명절 모임 순서를 바꾸자는 말에 어른들이 서운해합니다.',
      choices: {
        A: '오래 이어진 순서는 가능한 한 천천히 바꾼다.',
        B: '불편한 사람이 있다면 모임 방식부터 새로 맞춘다.'
      }
    },
    Q_1_T_P_2: {
      prompt: '학교 발표회에서 정해진 형식과 자유로운 무대가 맞붙습니다.',
      choices: {
        A: '함께 보는 자리인 만큼 기본 형식을 먼저 지킨다.',
        B: '다른 표현도 무대 안에 먼저 들어올 수 있게 한다.'
      }
    },
    Q_1_M_E_1: {
      prompt: '팀 포상에서 매출을 올린 사람과 오래 버틴 사람이 함께 거론됩니다.',
      choices: {
        A: '눈에 보이는 결과를 만든 사람에게 더 크게 준다.',
        B: '팀이 무너지지 않게 기본 몫을 먼저 나눈다.'
      }
    },
    Q_1_M_E_2: {
      prompt: '대회 선발에서 최고 점수와 어려운 준비 환경이 함께 보입니다.',
      choices: {
        A: '선발은 최종 점수와 실력으로 분명하게 정한다.',
        B: '준비 환경의 차이를 감안해 기회를 보정한다.'
      }
    },
    Q_1_O_L_1: {
      prompt: '동네 골목에서 야외 테이블을 허용할지 두고 민원이 갈립니다.',
      choices: {
        A: '통행과 소음을 줄이도록 먼저 이용 기준을 둔다.',
        B: '큰 피해가 없다면 가게와 손님의 선택을 넓게 둔다.'
      }
    },
    Q_1_O_L_2: {
      prompt: '새 플리마켓을 열려는데 골목 혼잡과 첫 시도 기회가 함께 보입니다.',
      choices: {
        A: '혼잡을 줄일 최소 규칙을 세운 뒤 열게 한다.',
        B: '먼저 열어보고 문제가 생긴 부분만 고친다.'
      }
    }
  };

  const override = overrides[question.id];
  if (override) return override;

  const labelA = question.display.choices.A.label;
  const labelB = question.display.choices.B.label;

  return {
    prompt: `${labelA} / ${labelB} 중 가까운 판단 기준을 고릅니다.`,
    choices: {
      A: `${labelA} 쪽을 먼저 두고, 생기는 불편은 보완한다.`,
      B: `${labelB} 쪽을 먼저 두고, 필요한 조정은 나중에 더한다.`
    }
  };
}

const PHASE2_BRANCH_VARIANT_COPY = {
  prompt: [
    (_label: string) => '처음 세운 기준 때문에 누군가의 부담이 커집니다.',
    (_label: string) => '기준을 지키자 예외를 요구하는 사람이 생깁니다.',
    (_label: string) => '원칙을 계속 밀고 갈수록 반대쪽 요구도 커집니다.'
  ],
  principle: [
    (_label: string) => '부담이 생겨도 처음 세운 기준을 유지한다.',
    (_label: string) => '예외가 늘면 기준이 흐려지므로 그대로 둔다.',
    (_label: string) => '비용이 보여도 원칙을 먼저 지키고 보완은 나중에 한다.'
  ],
  concession: [
    (_label: string) => '부담이 커지는 지점에서는 기준을 좁힌다.',
    (_label: string) => '예외를 인정하고 적용 범위를 다시 잡는다.',
    (_label: string) => '원칙보다 지금 생기는 피해를 먼저 줄인다.'
  ]
};

const PHASE2_BALANCED_VARIANT_COPY = {
  prompt: [
    (left: string, right: string) => `${left} / ${right} 모두 설득력 있지만 하나는 밀려납니다.`,
    (left: string, right: string) => `${left} / ${right} 사이에서 먼저 잃지 말아야 할 쪽을 고릅니다.`,
    (left: string, right: string) => `${left} / ${right}이 정면으로 맞설 때 한쪽을 택해야 합니다.`
  ],
  left: [
    (label: string) => `${label} 쪽을 먼저 두고, 생기는 비용은 보완한다.`,
    (label: string) => `${label} 쪽을 기준으로 삼고 예외는 좁게 둔다.`,
    (label: string) => `${label} 쪽을 우선해 판단의 일관성을 지킨다.`
  ],
  right: [
    (label: string) => `${label} 쪽을 먼저 두고, 생기는 비용은 조정한다.`,
    (label: string) => `${label} 쪽을 기준으로 삼고 기존 기준은 다시 맞춘다.`,
    (label: string) => `${label} 쪽을 우선해 놓치는 사람을 줄인다.`
  ]
};

function phase2VariantCopy(question: QuestionDefinition, variantOrder: 2 | 3): VariantCopy | null {
  if (question.phase !== 2) return null;

  const orderIndex = (question.branchOrder ?? 1) - 1;
  const labelA = question.display.choices.A.label;
  const labelB = question.display.choices.B.label;

  if (variantOrder === 2 && question.id === 'Q_2_CI_BAL_1') {
    return {
      prompt: '분실을 줄이려면 기록이 필요하지만, 기록이 남는 일도 부담입니다.',
      choices: {
        A: '피해를 줄이도록 최소한의 출입 기록은 남긴다.',
        B: '불안해도 동의 없는 기록 공유는 피한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_CI_BAL_2') {
    return {
      prompt: '공용 냉장고에 같은 규칙을 붙이면 개인 사정은 덜 보입니다.',
      choices: {
        A: '같은 규칙을 먼저 두고 필요한 예외는 따로 받는다.',
        B: '개별 사정을 먼저 듣고 꼭 필요한 규칙만 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_CI_BAL_3') {
    return {
      prompt: '빠른 위험 알림에는 위치 공유가 필요하지만 거절권도 필요합니다.',
      choices: {
        A: '긴급 알림에 한해 위치 공유를 먼저 허용한다.',
        B: '알림이 늦어져도 위치 공유를 거절할 절차를 둔다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_TP_BAL_1') {
    return {
      prompt: '입학식 절차를 줄이면 새 학생은 편하지만 준비한 사람은 서운합니다.',
      choices: {
        A: '오래 준비한 절차는 남기고 부담스러운 부분만 줄인다.',
        B: '새 학생이 빠지지 않도록 입학식 순서부터 다시 짠다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_TP_BAL_2') {
    return {
      prompt: '동호회 규칙을 바꾸면 새 회원은 편하지만 기존 회원은 불안합니다.',
      choices: {
        A: '기존 회원이 따라올 속도에 맞춰 규칙을 고친다.',
        B: '불안이 있어도 새 회원에게 맞는 기준을 먼저 적용한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_TP_BAL_3') {
    return {
      prompt: '기념행사 순서표에서 익숙한 상징과 새 표현이 같은 순서에 들어가려 합니다.',
      choices: {
        A: '익숙한 상징을 중심 순서에 두고 새 표현은 뒤에 붙인다.',
        B: '새 표현을 중심 순서에 두고 오래된 상징은 짧게 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_C_3') {
    return {
      prompt: '확인 절차가 한 사람에게만 계속 몰린다는 불만이 나옵니다.',
      choices: {
        A: '부담이 몰려도 모두의 신뢰를 위한 절차는 유지한다.',
        B: '절차를 줄이고 부담이 한 사람에게 몰리지 않게 바꾼다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_C_1') {
    return {
      prompt: '분실 사고 뒤 방문 스티커 확인이 매번 길어져 주민이 지칩니다.',
      choices: {
        A: '번거로워도 분실을 줄이는 방문 확인은 계속 유지한다.',
        B: '확인은 남기되 오래 걸리는 설명 절차는 줄인다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_C_2') {
    return {
      prompt: '공통 규칙 때문에 늦게 도착한 사람이 중요한 일을 놓칩니다.',
      choices: {
        A: '사정이 급해도 모두에게 같은 통과 기준을 적용한다.',
        B: '공통 기준은 두되 급한 일에는 확인된 예외를 둔다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_C_1') {
    return {
      prompt: '확인 절차 때문에 한 사람이 계속 감시받는다고 느낍니다.',
      choices: {
        A: '감시처럼 느껴져도 피해를 막는 확인 절차는 유지한다.',
        B: '절차는 두되 누가 무엇을 보는지 더 좁게 제한한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_C_2') {
    return {
      prompt: '피해를 막는 규칙이 늦게 온 사람의 급한 사정을 막아섭니다.',
      choices: {
        A: '급한 사정이 있어도 공통 규칙을 먼저 통과하게 한다.',
        B: '규칙은 유지하되 급한 사정에는 좁은 예외를 둔다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_C_3') {
    return {
      prompt: '모두를 지키자는 절차가 특정 사람에게만 더 번거롭게 작동합니다.',
      choices: {
        A: '불편이 한쪽에 몰려도 신뢰를 위한 절차는 그대로 둔다.',
        B: '절차는 줄이고 부담이 한 사람에게 몰리지 않게 바꾼다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_I_1') {
    return {
      prompt: '동의를 기다리는 사이 같은 피해가 한 번 더 발생했습니다.',
      choices: {
        A: '피해가 반복돼도 동의 없는 기록 공유는 넘지 않는다.',
        B: '반복 피해를 막기 위해 필요한 기록만 잠시 허용한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_I_2') {
    return {
      prompt: '공용 주방을 자율에 맡기자 정리할 사람이 매번 빠집니다.',
      choices: {
        A: '정리가 빠져도 이용자의 자율 약속을 먼저 믿는다.',
        B: '정리 공백이 반복되면 최소한의 당번 기준을 둔다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_I_3') {
    return {
      prompt: '각자 선택을 존중하자 공통 대응이 매번 늦어집니다.',
      choices: {
        A: '대응이 늦어져도 각자가 동의할 절차를 남긴다.',
        B: '대응이 무너지지 않도록 최소한의 조율은 받아들인다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_I_1') {
    return {
      prompt: '동의 절차를 지키는 동안 피해 신고가 한참 늦어집니다.',
      choices: {
        A: '대응이 늦어져도 동의 없는 정보 공유는 넘지 않는다.',
        B: '피해가 커질 때는 필요한 정보만 잠시 공유한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_T_1') {
    return {
      prompt: '지켜온 방식 때문에 새로 온 사람이 행사 준비에서 빠졌다고 느낍니다.',
      choices: {
        A: '새로 온 사람이 낯설어도 오래된 방식은 쉽게 흔들지 않는다.',
        B: '방식은 지키되 새로 온 사람이 맡을 자리를 따로 만든다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_T_1') {
    return {
      prompt: '오래된 순서를 지키자 처음 온 사람이 맡을 역할을 찾지 못합니다.',
      choices: {
        A: '처음 온 사람이 어색해도 오래된 준비 순서는 그대로 둔다.',
        B: '순서는 남기되 처음 온 사람이 들어올 작은 역할을 만든다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_T_3') {
    return {
      prompt: '익숙한 절차를 지키느라 필요한 변화가 매번 뒤로 밀립니다.',
      choices: {
        A: '변화가 늦어져도 익숙한 절차의 신뢰를 먼저 지킨다.',
        B: '기존 절차를 남기되 이번에는 바꿀 항목을 못 박는다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_TP_BAL_1') {
    return {
      prompt: '입학식 절차를 줄이면 새 학생은 편하지만 오래 준비한 사람은 서운합니다.',
      choices: {
        A: '오래 이어진 절차는 남기고 가장 부담스러운 부분만 줄인다.',
        B: '새 학생이 빠지지 않도록 절차부터 다시 짠다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_T_2') {
    return {
      prompt: '기존 절차를 기다리는 사이 불편을 겪는 사람이 또 생깁니다.',
      choices: {
        A: '불편이 이어져도 모두가 이해할 시간을 먼저 둔다.',
        B: '절차는 유지하되 기다리는 사람에게 임시 예외를 둔다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_T_2') {
    return {
      prompt: '천천히 바꾸는 사이 새 회원의 불편이 다음 모임까지 이어집니다.',
      choices: {
        A: '불편이 남아도 모두가 납득할 때까지 변화는 늦춘다.',
        B: '기존 절차는 두되 새 회원에게는 임시 선택지를 준다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_P_1') {
    return {
      prompt: '새 방식을 열자 오래 지켜온 사람들이 밀려났다고 느낍니다.',
      choices: {
        A: '기존 사람들이 낯설어도 새 참여 방식은 먼저 열어둔다.',
        B: '새 방식을 열되 기존 사람들이 따라올 시간을 둔다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_P_1') {
    return {
      prompt: '새 참여 방식을 열자 오래 준비한 사람이 자리를 잃었다고 느낍니다.',
      choices: {
        A: '서운한 사람이 있어도 새 참여 방식은 먼저 열어둔다.',
        B: '새 방식은 열되 오래 준비한 사람의 자리도 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_P_2') {
    return {
      prompt: '먼저 바꿨지만 바뀐 이유를 듣지 못한 사람들이 규칙을 믿지 못합니다.',
      choices: {
        A: '설명이 부족해도 필요한 변화라면 먼저 시작한다.',
        B: '먼저 바꾸기보다 이유와 순서를 더 설득한 뒤 진행한다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_P_2') {
    return {
      prompt: '새 규칙이 바로 적용되자 이유를 못 들은 사람이 따라오지 못합니다.',
      choices: {
        A: '설명이 늦어도 필요한 변화라면 새 규칙부터 적용한다.',
        B: '적용은 늦추고 바뀌는 이유와 순서를 먼저 설명한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_P_3') {
    return {
      prompt: '새 표현을 넓히자 행사의 오래된 상징이 흐려졌다는 말이 나옵니다.',
      choices: {
        A: '상징이 약해져도 다양한 표현을 같은 자리에 둔다.',
        B: '표현은 넓히되 오래된 상징 일부는 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_M_1') {
    return {
      prompt: '성과자에게 자원이 몰리자 조용히 버틴 팀원이 팀을 떠납니다.',
      choices: {
        A: '팀원이 떠나도 큰 기여에는 확실한 자원을 몰아준다.',
        B: '큰 보상은 주되 버티는 사람의 최소 몫은 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_M_1') {
    return {
      prompt: '핵심 담당자에게만 장비가 배정되자 뒤에서 돕던 사람이 빠집니다.',
      choices: {
        A: '뒤에서 돕던 사람이 빠져도 큰 성과를 낸 쪽에 장비를 몰아준다.',
        B: '핵심 장비는 주되 함께 버틴 사람의 기본 지원도 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_M_2') {
    return {
      prompt: '차등 보상이 커지자 협업보다 자기 실적만 앞세우는 분위기가 생깁니다.',
      choices: {
        A: '협업이 약해져도 보상 차이는 분명히 둔다.',
        B: '차등은 두되 협업을 해치는 수준은 줄인다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_M_2') {
    return {
      prompt: '성과 순위가 커지자 사람들은 공동 작업 기록을 남기지 않습니다.',
      choices: {
        A: '협업 기록이 줄어도 개인 성과 차이는 분명히 보상한다.',
        B: '차등 보상은 두되 함께 만든 기록도 평가에 넣는다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_M_3') {
    return {
      prompt: '결과만 보자 시작부터 불리했던 사람이 계속 뒤처집니다.',
      choices: {
        A: '불리한 출발이 있어도 결과 기준은 흔들지 않는다.',
        B: '결과 기준은 유지하되 불리한 조건은 일부 반영한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_E_1') {
    return {
      prompt: '보상 격차를 줄이자 많이 기여한 사람이 억울하다고 말합니다.',
      choices: {
        A: '성과자가 억울해도 보상 격차는 일정 선에서 막는다.',
        B: '격차는 줄이되 큰 기여에 대한 추가 보상은 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_E_2') {
    return {
      prompt: '보정 기준이 늘어나자 누가 왜 뽑혔는지 설명하기 어려워집니다.',
      choices: {
        A: '설명이 복잡해져도 출발선 차이는 심사에 넣는다.',
        B: '보정은 하되 누가 봐도 설명되는 기준만 쓴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_E_2') {
    return {
      prompt: '심사 기준이 늘어나자 탈락한 사람이 이유를 납득하지 못합니다.',
      choices: {
        A: '설명이 어려워도 출발 조건의 차이는 계속 반영한다.',
        B: '보정은 남기되 탈락 이유를 설명할 수 있는 기준만 쓴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_E_3') {
    return {
      prompt: '안정 지원이 커지자 부담 큰 역할을 맡으려는 사람이 줄어듭니다.',
      choices: {
        A: '성과 압박이 줄어도 기본 안정은 먼저 넓힌다.',
        B: '안정 지원은 두되 부담 큰 역할의 보상도 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_E_3') {
    return {
      prompt: '기본 몫을 넓히자 어려운 일을 맡겠다는 사람이 줄어듭니다.',
      choices: {
        A: '맡는 사람이 줄어도 모두가 버틸 기본 몫을 먼저 지킨다.',
        B: '기본 몫은 두되 어려운 일을 맡는 보상도 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_O_1') {
    return {
      prompt: '아직 문제없던 작은 행동까지 금지 목록에 들어갑니다.',
      choices: {
        A: '작은 행동까지 묶여도 문제가 생기기 전에 기준을 세운다.',
        B: '피해가 분명하지 않은 행동은 금지 목록에서 뺀다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_O_1') {
    return {
      prompt: '민원이 생기기 전인데도 작은 모임까지 금지하자는 말이 나옵니다.',
      choices: {
        A: '아직 민원이 없어도 문제를 막기 위해 기준을 먼저 둔다.',
        B: '피해가 확인되기 전까지 작은 모임은 허용한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_O_2') {
    return {
      prompt: '기준을 강화하자 새로 시작하려던 사람이 허가 앞에서 멈춥니다.',
      choices: {
        A: '새 시도가 막혀도 반복 문제는 더 강한 기준으로 줄인다.',
        B: '기준은 두되 새 시도가 통과할 작은 길을 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_O_3') {
    return {
      prompt: '규칙이 자세해질수록 사람들은 스스로 판단하지 않게 됩니다.',
      choices: {
        A: '판단 여지가 줄어도 공공장소의 예측 가능성을 먼저 둔다.',
        B: '규칙은 줄이고 현장에서 판단할 여지를 남긴다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_L_1') {
    return {
      prompt: '자율에 맡겼더니 일부가 뒷정리 없이 자리를 떠납니다.',
      choices: {
        A: '뒷정리 문제가 생겨도 이용 방식은 먼저 열어둔다.',
        B: '뒷정리가 반복되면 이용 전 최소 규칙을 둔다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_L_1') {
    return {
      prompt: '자유롭게 쓰게 둔 공간에 쓰레기가 남아 다음 사람이 불편합니다.',
      choices: {
        A: '뒷정리 문제가 있어도 자유 이용은 먼저 유지한다.',
        B: '자유 이용은 두되 퇴실 전 확인 규칙을 붙인다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_L_2') {
    return {
      prompt: '먼저 허용한 시도가 실패해 주변 사람이 뒤처리를 맡게 됩니다.',
      choices: {
        A: '뒤처리 부담이 생겨도 새 시도는 먼저 허용한다.',
        B: '실패 비용이 남에게 가면 사전 기준을 먼저 둔다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_L_2') {
    return {
      prompt: '새 시도를 먼저 열었지만 문제가 생겨 옆 사람이 수습합니다.',
      choices: {
        A: '수습 부담이 생겨도 새 시도는 먼저 열어둔다.',
        B: '부담이 남에게 가면 시작 전 책임 기준을 둔다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_L_3') {
    return {
      prompt: '자유롭게 쓰는 공간에서 쉬고 싶던 사람들의 불편이 커집니다.',
      choices: {
        A: '불편한 사람이 있어도 이용할 자유를 먼저 열어둔다.',
        B: '불편이 커지는 시간대에는 이용 범위를 정한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_ME_BAL_1') {
    return {
      prompt: '보너스 예산이 적어 최고 성과자와 생계가 급한 팀원 중 먼저 정해야 합니다.',
      choices: {
        A: '최고 성과자에게 먼저 주고, 남은 몫으로 급한 사람을 돕는다.',
        B: '생계가 급한 사람을 먼저 돕고 성과 보상은 줄인다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_ME_BAL_2') {
    return {
      prompt: '채용 마지막 자리는 점수가 높은 사람과 환경이 어려운 사람으로 갈립니다.',
      choices: {
        A: '최종 점수를 먼저 보고 어려운 환경은 보조 기준으로 둔다.',
        B: '어려운 환경을 먼저 보정하고 그 뒤 점수를 비교한다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_ME_BAL_3') {
    return {
      prompt: '한정된 예산에서 성과급을 키우면 최저 보장이 줄어듭니다.',
      choices: {
        A: '성과급을 먼저 지키고 최저 보장은 남는 만큼만 둔다.',
        B: '최저 보장을 먼저 지키고 성과급은 남는 만큼만 준다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_OL_BAL_1') {
    return {
      prompt: '광장 사용을 예약제로 바꾸면 예정 없이 모이는 사람은 줄어듭니다.',
      choices: {
        A: '예약 기준을 먼저 두고 남는 시간에만 모임을 허용한다.',
        B: '예정 없는 모임은 열어두고 민원이 쌓이면 기준을 만든다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_OL_BAL_2') {
    return {
      prompt: '배달 로봇은 편하지만 사고가 나면 책임질 사람이 분명하지 않습니다.',
      choices: {
        A: '운행 기준과 책임자를 정한 뒤 로봇을 허용한다.',
        B: '먼저 운행해보고 사고가 생긴 지점을 고친다.'
      }
    };
  }

  if (variantOrder === 2 && question.id === 'Q_2_OL_BAL_3') {
    return {
      prompt: '공용 라운지를 자유롭게 쓰면 쉬고 싶은 사람은 불편합니다.',
      choices: {
        A: '라운지 이용 시간과 소음 기준을 먼저 정한다.',
        B: '자유 이용을 열어두고 불편이 쌓이면 조정한다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_CI_BAL_2') {
    return {
      prompt: '공용 냉장고 규칙을 자세히 만들수록 개인 사정은 줄어듭니다.',
      choices: {
        A: '같은 규칙을 먼저 두고 예외는 신청하게 한다.',
        B: '개별 사정을 먼저 듣고 필요한 규칙만 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_CI_BAL_3') {
    return {
      prompt: '위험 알림을 빠르게 보내려면 누군가의 위치 정보가 필요합니다.',
      choices: {
        A: '위치 공유를 허용하되 긴급 알림에만 쓰게 한다.',
        B: '위치 공유보다 거절할 수 있는 절차를 먼저 둔다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_TP_BAL_2') {
    return {
      prompt: '동호회 규칙을 고치면 새 회원은 편하고 기존 회원은 불안합니다.',
      choices: {
        A: '기존 회원이 따라올 속도에 맞춰 규칙을 고친다.',
        B: '불안이 있어도 새 기준을 먼저 적용하고 설명을 붙인다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_TP_BAL_3') {
    return {
      prompt: '기념행사에서 익숙한 상징과 새 표현을 함께 둘 수 없습니다.',
      choices: {
        A: '익숙한 상징을 중심에 두고 새 표현은 옆에 둔다.',
        B: '새 표현을 중심에 두고 오래된 상징은 다시 해석한다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_T_3') {
    return {
      prompt: '익숙한 절차를 지키느라 필요한 변화가 매번 뒤로 밀립니다.',
      choices: {
        A: '변화가 늦어져도 익숙한 절차의 신뢰를 먼저 지킨다.',
        B: '기존 절차를 남기되 이번에는 바꿀 항목을 못 박는다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_ME_BAL_2') {
    return {
      prompt: '채용 최종 대상자는 점수가 높거나 환경이 어려운 사람으로 갈립니다.',
      choices: {
        A: '점수를 먼저 보고 어려운 형편은 보조 기준으로 둔다.',
        B: '어려운 형편을 먼저 보정하고 그 뒤 점수를 본다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_ME_BAL_3') {
    return {
      prompt: '성과급을 키우면 최저 보장이 줄고, 보장을 키우면 성과급이 줄어듭니다.',
      choices: {
        A: '성과급을 먼저 지키고 최소 보장은 얇게 남긴다.',
        B: '최저 보장을 먼저 지키고 성과급은 남는 범위에서 준다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_OL_BAL_1') {
    return {
      prompt: '광장 사용을 예약제로 바꾸면 즉흥 공연은 줄어듭니다.',
      choices: {
        A: '예약제를 먼저 두고 즉흥 공연은 남는 시간에 허용한다.',
        B: '즉흥 공연을 열어두고 민원이 쌓이면 조정한다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_OL_BAL_3') {
    return {
      prompt: '공용 라운지를 자유롭게 쓰게 하면 쉬고 싶은 사람은 불편합니다.',
      choices: {
        A: '라운지 이용 시간과 소음 기준을 먼저 정한다.',
        B: '자유 이용을 유지하고 불편은 신고 후 조정한다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_P_3') {
    return {
      prompt: '새 표현을 넓히자 오래된 상징이 흐려졌다는 말이 나옵니다.',
      choices: {
        A: '상징이 약해져도 다양한 표현을 같은 자리에 둔다.',
        B: '표현은 넓히되 오래된 상징 일부는 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_M_3') {
    return {
      prompt: '결과만 보자 시작부터 불리했던 사람이 계속 뒤처집니다.',
      choices: {
        A: '불리한 출발이 있어도 결과 기준은 흔들지 않는다.',
        B: '결과 기준은 유지하되 불리한 조건은 일부 반영한다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_E_1') {
    return {
      prompt: '보상 격차를 줄이자 많이 기여한 사람이 억울하다고 말합니다.',
      choices: {
        A: '성과자가 억울해도 보상 격차는 일정 선에서 막는다.',
        B: '격차는 줄이되 큰 기여에 대한 추가 보상은 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_O_2') {
    return {
      prompt: '기준을 강화하자 새로 시작하려던 사람이 허가 앞에서 멈춥니다.',
      choices: {
        A: '새 시도가 막혀도 반복 문제는 더 강한 기준으로 줄인다.',
        B: '기준은 두되 새 시도가 통과할 작은 길을 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_O_3') {
    return {
      prompt: '규칙이 자세해질수록 사람들은 스스로 판단하지 않게 됩니다.',
      choices: {
        A: '판단 여지가 줄어도 공공장소의 예측 가능성을 먼저 둔다.',
        B: '규칙은 줄이고 현장에서 판단할 여지를 남긴다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_I_2') {
    return {
      prompt: '자율에 맡겼더니 일부가 허점을 이용해 책임을 피합니다.',
      choices: {
        A: '일부가 악용해도 모두의 자율을 먼저 줄이지 않는다.',
        B: '악용이 반복되는 부분에는 공통 기준을 새로 둔다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_I_3') {
    return {
      prompt: '각자 선택을 존중하자 공통 대응이 매번 늦어집니다.',
      choices: {
        A: '대응이 늦어져도 각자가 동의할 절차를 남긴다.',
        B: '대응이 무너지지 않도록 최소한의 조율은 받아들인다.'
      }
    };
  }

  if (variantOrder === 3 && question.id === 'Q_2_L_3') {
    return {
      prompt: '자유로운 이용이 늘자 조용히 쓰던 사람들의 불편이 커집니다.',
      choices: {
        A: '불편한 사람이 있어도 선택할 자유를 먼저 존중한다.',
        B: '불편이 커지는 공간에는 이용 시간과 범위를 정한다.'
      }
    };
  }

  if (variantOrder === 3) {
    if (question.branchCondition === 'BALANCED') {
      return {
        prompt: `${labelA} / ${labelB}을 동시에 만족시키기 어렵다면 무엇을 남길까요.`,
        choices: {
          A: `${labelA} 쪽을 먼저 보존하고, 빠지는 부분은 따로 보완한다.`,
          B: `${labelB} 쪽을 먼저 보존하고, 기존 기준은 필요한 만큼 조정한다.`
        }
      };
    }

    return {
      prompt: '원칙을 계속 밀고 갈수록 반대쪽 요구도 커집니다.',
      choices: {
        A: '처음 세운 기준을 지키고, 생기는 부담은 감수한다.',
        B: '반대쪽 요구를 받아들여 원칙의 강도를 낮춘다.'
      }
    };
  }

  if (question.branchCondition === 'BALANCED') {
    return {
      prompt: PHASE2_BALANCED_VARIANT_COPY.prompt[orderIndex](labelA, labelB),
      choices: {
        A: PHASE2_BALANCED_VARIANT_COPY.left[orderIndex](labelA),
        B: PHASE2_BALANCED_VARIANT_COPY.right[orderIndex](labelB)
      }
    };
  }

  return {
    prompt: PHASE2_BRANCH_VARIANT_COPY.prompt[orderIndex](labelA),
    choices: {
      A: PHASE2_BRANCH_VARIANT_COPY.principle[orderIndex](labelA),
      B: PHASE2_BRANCH_VARIANT_COPY.concession[orderIndex](labelB)
    }
  };
}

function variantQuestion(
  base: QuestionDefinition,
  variantOrder: number,
  copy: VariantCopy
): QuestionDefinition {
  return {
    ...base,
    id: `${base.id}_V${variantOrder}`,
    slotId: base.id,
    variantOrder,
    metadata: {
      ...base.metadata,
      scenarioTag: variantScenarioTag(base, variantOrder),
      copyFamily: `variant-v${variantOrder}`
    },
    prompt: copy.prompt,
    choices: copy.choices,
    display: createDisplay({
      prompt: copy.prompt,
      promptHighlights: base.display.promptHighlights,
      choiceLabels: {
        A: base.display.choices.A.label,
        B: base.display.choices.B.label
      },
      choices: copy.choices,
      choiceHighlights: {
        A: base.display.choices.A.highlights,
        B: base.display.choices.B.highlights
      }
    })
  };
}

export const questionVariants: QuestionDefinition[] = questions.flatMap((question) => {
  const variantCopies = question.phase === 1
    ? [phase1VariantCopy[question.id], phase1GeneratedVariantCopy(question)]
    : [phase2VariantCopy(question, 2), phase2VariantCopy(question, 3)];

  return variantCopies.flatMap((variantCopy, index) => {
    if (!variantCopy) return [];
    return [variantQuestion(question, index + 2, variantCopy)];
  });
});

export const allQuestions = [...questions, ...questionVariants];

export const questionsById = new Map(allQuestions.map((question) => [question.id, question]));

export const questionsBySlotId = allQuestions.reduce((map, question) => {
  const slotId = question.slotId ?? question.id;
  const bucket = map.get(slotId) ?? [];
  bucket.push(question);
  bucket.sort((a, b) => (a.variantOrder ?? 1) - (b.variantOrder ?? 1));
  map.set(slotId, bucket);
  return map;
}, new Map<string, QuestionDefinition[]>());
