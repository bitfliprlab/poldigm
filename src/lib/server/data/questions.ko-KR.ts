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
        prompt: '공동의 안전과 개인의 사생활이 부딪힐 때, 무엇을 먼저 지켜야 할까요.',
        leftChoice: '위험을 줄이기 위해 모두에게 적용되는 기준을 먼저 세워야 한다.',
        rightChoice: '불편이 있더라도 개인의 동의와 사생활을 먼저 보호해야 한다.'
      },
      {
        prompt: '함께 쓰는 공간에서 공통 규칙과 개인의 방식이 엇갈립니다.',
        leftChoice: '예측 가능한 이용을 위해 같은 규칙을 우선 적용하는 편이 낫다.',
        rightChoice: '조금 복잡해져도 각자의 사정과 선택을 더 넓게 인정해야 한다.'
      }
    ],
    leftBranch: [
      '큰 피해를 막기 위해, 제한된 기간 동안 일부 개인 정보를 모으자는 제안이 나왔습니다.',
      '여러 사람의 피해를 줄이려면 일부 활동을 잠시 제한해야 한다는 의견이 나옵니다.',
      '공동의 신뢰를 지키기 위해 개인에게 불편한 절차를 요구해야 하는 순간입니다.'
    ],
    rightBranch: [
      '사생활 보호 절차를 지키다 보면 공동 안전 조치가 늦어질 수 있습니다.',
      '개인의 자율을 넓게 두면 일부가 그 여지를 악용할 가능성도 있습니다.',
      '선택권을 충분히 보장하면 공동 대응의 속도와 통일성이 떨어질 수 있습니다.'
    ],
    balanced: [
      '공동 안전과 사생활 보호가 모두 필요하지만, 먼저 둘 기준은 하나뿐입니다.',
      '모두의 편의를 높이는 규칙이 누군가의 자유를 줄일 수 있습니다.',
      '위험을 줄이기 위한 정보 공유와 개인의 통제권이 맞부딪힙니다.'
    ],
    leftPrinciples: [
      '위험이 분명하다면, 한시적인 정보 수집은 받아들일 수 있다.',
      '피해를 줄이는 목적이 뚜렷하다면, 잠시의 활동 제한은 감수할 수 있다.',
      '모두가 신뢰를 유지하려면, 개인도 일정한 불편을 나눠 져야 한다.'
    ],
    rightPrinciples: [
      '위기 상황이라도, 개인이 통제권을 잃는 방식은 경계해야 한다.',
      '일부 악용 가능성만으로 모두의 자율을 먼저 줄여서는 안 된다.',
      '느리더라도 개인이 동의하고 선택할 수 있는 절차가 필요하다.'
    ],
    leftConcessions: [
      '안전이 중요해도, 사생활을 넘기는 기준은 더 좁게 잡아야 한다.',
      '제한이 필요하더라도 기간과 범위를 더 엄격히 줄여야 한다.',
      '공동 책임을 말하더라도, 개인에게 과도한 부담을 넘겨서는 안 된다.'
    ],
    rightConcessions: [
      '피해가 커질 상황이라면, 사생활 보호도 일부 조정할 수 있다.',
      '악용이 반복된다면, 자율보다 공동 기준을 먼저 세워야 한다.',
      '공동 대응이 무너지지 않도록, 일정한 조율은 받아들일 수 있다.'
    ],
    balancedLeftChoices: [
      '피해를 줄이는 공동 기준을 먼저 세우고, 보호 장치는 함께 보완한다.',
      '모두가 예측할 수 있는 공통 규칙을 먼저 두는 편이 낫다.',
      '필요한 범위의 정보 공유를 허용하되, 감시 장치를 함께 둔다.'
    ],
    balancedRightChoices: [
      '개인의 동의와 통제권을 먼저 보장하고, 필요한 조치는 좁게 설계한다.',
      '개별 상황을 반영할 여지를 더 크게 남기는 편이 낫다.',
      '정보 공유보다 개인이 거절할 수 있는 절차를 먼저 마련한다.'
    ]
  },
  {
    axis: 'T_P',
    compact: 'TP',
    left: 'T',
    right: 'P',
    phase1: [
      {
        prompt: '오래 이어진 관습과 새로운 생활 방식이 같은 공간에서 부딪힙니다.',
        leftChoice: '검증된 관습은 안정감을 주므로, 바꿀 때 더 신중해야 한다.',
        rightChoice: '새로운 생활 방식도 빠르게 인정하고 제도 안에 담아야 한다.'
      },
      {
        prompt: '공동체 교육에서 공통 예절과 다양한 표현 중 무엇을 먼저 둘지 정해야 합니다.',
        leftChoice: '함께 지내기 위한 공통 예절과 책임을 먼저 익혀야 한다.',
        rightChoice: '서로 다른 정체성과 표현 방식을 먼저 존중해야 한다.'
      }
    ],
    leftBranch: [
      '오래된 규칙이 일부에게 불편하지만, 공동체의 안정감을 지킨다는 의견이 있습니다.',
      '느린 절차라도 구성원에게 예측 가능성을 준다는 평가가 나옵니다.',
      '새 방식을 급히 들이면 내부 갈등이 커질 수 있다는 우려가 있습니다.'
    ],
    rightBranch: [
      '새로운 권리 요구를 반영하면 기존 구성원이 낯설고 불안해할 수 있습니다.',
      '변화가 필요하지만, 아직 모두가 받아들일 만큼 설명되지 않았습니다.',
      '다양성을 넓히는 변화가 오래된 관습의 의미를 약하게 만들 수 있습니다.'
    ],
    balanced: [
      '전통은 안정감을 주지만, 일부 구성원을 밖에 세울 수도 있습니다.',
      '새 기준이 필요하지만, 변화 속도가 공동체의 수용력을 넘을 수 있습니다.',
      '익숙한 규칙과 새로운 표현 방식 중 어디에 더 무게를 둘지 정해야 합니다.'
    ],
    leftPrinciples: [
      '오래 쌓인 규칙은 충분한 검토 없이 흔들지 않는 편이 낫다.',
      '느린 절차라도, 공동체가 함께 이해할 시간을 가져야 한다.',
      '변화가 필요하더라도, 내부의 신뢰가 무너지지 않게 해야 한다.'
    ],
    rightPrinciples: [
      '낯설더라도, 배제된 사람의 권리를 먼저 반영해야 한다.',
      '합의가 완벽하지 않아도, 필요한 변화는 시작할 수 있어야 한다.',
      '관습보다 다양한 삶의 방식을 동등하게 인정하는 일이 더 중요하다.'
    ],
    leftConcessions: [
      '안정이 중요해도, 누군가를 계속 불편하게 만든다면 고쳐야 한다.',
      '절차가 오히려 피해를 키운다면, 예외적인 개선이 필요하다.',
      '신뢰를 지키더라도, 변화의 필요성을 미루기만 해서는 안 된다.'
    ],
    rightConcessions: [
      '권리 확대도 공동체가 이해할 수 있는 설명과 순서가 필요하다.',
      '변화가 너무 빠르면, 제도에 대한 신뢰가 약해질 수 있다.',
      '관습을 모두 낡은 것으로 보지 말고, 남길 부분은 남겨야 한다.'
    ],
    balancedLeftChoices: [
      '기존 규칙을 기본으로 두되, 불편한 지점을 점진적으로 고친다.',
      '사회가 받아들일 수 있는 속도 안에서 변화를 진행한다.',
      '공통의 예절을 먼저 세우고, 새로운 표현은 그 안에서 넓힌다.'
    ],
    balancedRightChoices: [
      '배제되는 사람이 있다면, 규칙부터 과감하게 다시 설계한다.',
      '필요한 변화라면 설명을 병행하되 먼저 실행한다.',
      '새로운 표현 방식을 제도 안에 먼저 넣고, 관습은 재해석한다.'
    ]
  },
  {
    axis: 'M_E',
    compact: 'ME',
    left: 'M',
    right: 'E',
    phase1: [
      {
        prompt: '같은 조직 안에서 보상 기준을 새로 정해야 합니다.',
        leftChoice: '성과와 기여가 큰 사람에게 더 큰 보상이 돌아가야 한다.',
        rightChoice: '기본적인 안정과 지나친 격차 완화를 먼저 보장해야 한다.'
      },
      {
        prompt: '선발 과정에서 노력의 결과와 출발선 보정이 충돌합니다.',
        leftChoice: '최종 결과는 성과와 노력으로 평가하는 편이 공정하다.',
        rightChoice: '출발 조건의 차이를 보정해야 경쟁도 더 공정해진다.'
      }
    ],
    leftBranch: [
      '성과가 높은 사람에게 자원을 더 몰아주면 전체 효율이 높아질 수 있습니다.',
      '차등 보상이 약해지면 노력의 동기가 줄어든다는 우려가 있습니다.',
      '결과 중심 평가가 불리한 환경을 충분히 반영하지 못할 수 있습니다.'
    ],
    rightBranch: [
      '격차를 줄이기 위해 높은 성과의 보상을 일부 제한하자는 제안이 있습니다.',
      '출발선 보정이 커지면 평가 기준이 흐려진다는 우려가 나옵니다.',
      '기본 안정을 넓히면 경쟁 압력이 줄어 전체 성과가 낮아질 수 있습니다.'
    ],
    balanced: [
      '성과 보상과 격차 완화가 모두 필요하지만, 예산은 한정되어 있습니다.',
      '노력의 결과와 출발선의 차이를 함께 고려해야 하는 장면입니다.',
      '높은 성과에 대한 보상과 최소한의 안정 보장이 맞부딪힙니다.'
    ],
    leftPrinciples: [
      '높은 기여를 분명히 인정해야 더 많은 사람이 노력할 이유를 갖는다.',
      '보상 차이가 있어야 노력과 책임의 의미가 유지된다.',
      '결과 기준이 흔들리면 평가의 예측 가능성이 약해진다.'
    ],
    rightPrinciples: [
      '격차가 너무 커지면, 공동체 전체의 기회가 좁아진다.',
      '출발선 차이가 크다면, 보정 없이 공정하다고 보기 어렵다.',
      '기본 안정이 있어야 더 많은 사람이 위험을 감수하고 도전할 수 있다.'
    ],
    leftConcessions: [
      '효율이 높아져도, 기본 생활이 흔들리는 사람은 보호해야 한다.',
      '차등은 필요하지만, 지나친 경쟁은 조직의 신뢰를 해칠 수 있다.',
      '결과 중심 평가도 환경의 차이를 일부는 반영해야 한다.'
    ],
    rightConcessions: [
      '격차 완화가 필요해도, 기여의 차이를 모두 지워서는 안 된다.',
      '보정은 필요하지만, 평가 기준이 불투명해지면 신뢰가 줄어든다.',
      '안정 보장과 함께 성과에 대한 추가 보상은 남겨야 한다.'
    ],
    balancedLeftChoices: [
      '기여에 따른 차등 보상을 기본으로 두고, 최소 안전망을 보완한다.',
      '명확한 노력 평가를 유지하되, 불리한 조건은 제한적으로 반영한다.',
      '높은 성과에는 분명한 보상을 주는 편이 낫다.'
    ],
    balancedRightChoices: [
      '격차가 지나치게 커지지 않도록 보상 상한과 지원을 함께 둔다.',
      '출발선의 차이를 먼저 보정하고, 그 뒤 성과를 비교한다.',
      '누구나 버틸 수 있는 기본 안정을 먼저 보장해야 한다.'
    ]
  },
  {
    axis: 'O_L',
    compact: 'OL',
    left: 'O',
    right: 'L',
    phase1: [
      {
        prompt: '공공 질서와 자유로운 선택이 같은 문제를 두고 부딪힙니다.',
        leftChoice: '예측 가능한 질서를 위해 일정한 규제와 기준이 필요하다.',
        rightChoice: '과도한 규제보다 개인의 선택과 책임을 더 믿어야 한다.'
      },
      {
        prompt: '위험을 줄이는 규칙과 자유로운 시도가 충돌합니다.',
        leftChoice: '위험이 반복된다면, 미리 막는 규칙을 먼저 두어야 한다.',
        rightChoice: '위험 가능성만으로 자유로운 시도를 막아서는 안 된다.'
      }
    ],
    leftBranch: [
      '질서를 지키기 위해 아직 피해가 생기지 않은 행동도 제한하자는 의견이 나옵니다.',
      '반복되는 문제를 줄이기 위해 거래와 표현의 기준을 더 엄격히 하려 합니다.',
      '공공장소의 예측 가능성을 높이기 위해 행동 규칙을 자세히 만들자는 제안입니다.'
    ],
    rightBranch: [
      '자유를 넓게 인정하면 일부 사람이 무책임하게 행동할 수 있습니다.',
      '규제를 줄이면 새로운 시도는 늘지만, 피해 구제가 늦어질 수 있습니다.',
      '자율을 우선하면 공공장소에서 불편을 겪는 사람이 생길 수 있습니다.'
    ],
    balanced: [
      '질서를 위한 규칙과 개인의 자유로운 선택 사이에서 기준을 정해야 합니다.',
      '새로운 시도를 허용하되, 피해를 줄일 장치도 함께 필요합니다.',
      '예측 가능한 질서와 스스로 책임지는 자유가 동시에 요구됩니다.'
    ],
    leftPrinciples: [
      '피해가 커지기 전에 분명한 기준을 세우는 편이 낫다.',
      '반복되는 문제는 더 강한 기준으로 줄여야 한다.',
      '공공장소에서는 개인의 편의보다 모두의 예측 가능성이 더 중요하다.'
    ],
    rightPrinciples: [
      '일부 오용 가능성만으로 자유를 먼저 줄여서는 안 된다.',
      '새로운 시도는 실패 가능성까지 포함해 허용되어야 한다.',
      '불편이 있더라도 개인의 선택과 책임을 더 존중해야 한다.'
    ],
    leftConcessions: [
      '피해가 명확하지 않은 행동까지 막으면 통제가 과해질 수 있다.',
      '강한 기준은 필요해도, 새로운 시도를 질식시켜서는 안 된다.',
      '규칙이 너무 자세하면 개인이 판단할 여지가 사라진다.'
    ],
    rightConcessions: [
      '오용이 반복된다면, 자유보다 최소한의 질서가 먼저일 수 있다.',
      '실패의 비용이 다른 사람에게 전가된다면 사전 기준이 필요하다.',
      '공공장소의 불편이 커진다면, 자율도 일부 조정되어야 한다.'
    ],
    balancedLeftChoices: [
      '피해 가능성이 크다면 사전 규칙을 먼저 세운다.',
      '새로운 시도보다 피해 예방 장치를 먼저 마련한다.',
      '공공장소에서는 모두가 예측할 수 있는 규칙을 우선한다.'
    ],
    balancedRightChoices: [
      '실제 피해가 확인되기 전까지는 자유로운 선택을 넓게 둔다.',
      '새로운 시도를 허용하고, 문제가 생기면 사후에 조정한다.',
      '개인이 책임질 수 있는 범위라면 자율을 먼저 존중한다.'
    ]
  }
];

const LETTER_DISPLAY: Record<Letter, { label: string; highlights: string[] }> = {
  C: { label: '공동 기준 우선', highlights: ['공동', '안전', '기준', '신뢰'] },
  I: { label: '개인 보호 우선', highlights: ['개인', '사생활', '자율', '선택권'] },
  T: { label: '기존 질서 우선', highlights: ['관습', '안정', '절차', '신뢰'] },
  P: { label: '변화 반영 우선', highlights: ['변화', '권리', '다양성', '표현'] },
  M: { label: '성과 기준 우선', highlights: ['성과', '기여', '노력', '보상'] },
  E: { label: '격차 완화 우선', highlights: ['격차', '출발선', '안정', '보정'] },
  O: { label: '질서 기준 우선', highlights: ['질서', '규칙', '기준', '예측'] },
  L: { label: '자율 선택 우선', highlights: ['자유', '자율', '선택', '책임'] }
};

const CONCESSION_LABELS: Record<Letter, string> = {
  C: '개인 부담 조정',
  I: '공동 기준 인정',
  T: '변화 필요 인정',
  P: '수용 속도 조정',
  M: '안전망 보완',
  E: '기여 차이 인정',
  O: '자율 여지 보장',
  L: '최소 질서 인정'
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
        A: `${LETTER_DISPLAY[target].label.replace(' 우선', '')} 유지`,
        B: CONCESSION_LABELS[target]
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
    prompt: '공동의 위험을 줄이는 일과 사생활을 지키는 일이 충돌합니다.',
    choices: {
      A: '여러 사람의 피해를 막는 공통 기준을 먼저 마련해야 한다.',
      B: '조금 느려져도 개인의 동의와 사생활 보호가 먼저다.'
    }
  },
  Q_1_C_I_2: {
    prompt: '공용 공간에서 모두의 예측 가능성과 개인의 생활 방식이 엇갈립니다.',
    choices: {
      A: '누구나 같은 기준을 예상할 수 있도록 공통 규칙을 먼저 둔다.',
      B: '공간이 조금 복잡해져도 개인의 방식과 선택을 더 인정한다.'
    }
  },
  Q_1_T_P_1: {
    prompt: '익숙한 관습과 새롭게 등장한 생활 방식이 함께 조정되어야 합니다.',
    choices: {
      A: '오래 검증된 관습은 공동체의 안정감을 위해 천천히 바꾼다.',
      B: '새로운 생활 방식도 빠르게 인정하고 제도에 반영한다.'
    }
  },
  Q_1_T_P_2: {
    prompt: '공동체가 가르칠 기준에서 공통 예절과 다양한 표현이 맞섭니다.',
    choices: {
      A: '함께 지내는 기본 예절과 책임을 먼저 익히게 해야 한다.',
      B: '서로 다른 정체성과 표현 방식을 먼저 존중하게 해야 한다.'
    }
  },
  Q_1_M_E_1: {
    prompt: '보상을 나눌 때 개인의 성과와 기본적인 안정이 함께 요구됩니다.',
    choices: {
      A: '더 크게 기여한 사람에게 더 큰 보상이 돌아가는 편이 공정하다.',
      B: '지나친 격차를 줄이고 기본적인 안정부터 보장하는 편이 공정하다.'
    }
  },
  Q_1_M_E_2: {
    prompt: '선발 기준에서 노력의 결과와 출발 조건의 차이를 함께 봐야 합니다.',
    choices: {
      A: '최종 평가는 성과와 노력으로 판단하는 편이 예측 가능하다.',
      B: '출발선의 차이를 보정해야 경쟁도 더 공정해진다.'
    }
  },
  Q_1_O_L_1: {
    prompt: '공공장소에서 질서를 지키는 일과 개인의 자유가 부딪힙니다.',
    choices: {
      A: '피해를 막기 위해 사전 규칙과 기준을 먼저 세워야 한다.',
      B: '실제 피해가 크지 않다면 개인의 자유를 더 넓게 인정해야 한다.'
    }
  },
  Q_1_O_L_2: {
    prompt: '새로운 시도를 허용할 때 사전 관리와 자율의 폭을 정해야 합니다.',
    choices: {
      A: '예상되는 혼란을 줄이도록 최소 기준을 먼저 마련한다.',
      B: '시도할 자유를 먼저 열어두고 문제는 이후에 조정한다.'
    }
  }
};

function phase1GeneratedVariantCopy(question: QuestionDefinition): VariantCopy {
  const labelA = question.display.choices.A.label;
  const labelB = question.display.choices.B.label;

  return {
    prompt: `${labelA}과 ${labelB} 중 가까운 판단 기준을 고릅니다.`,
    choices: {
      A: `${labelA}을 먼저 두고, 생기는 불편은 보완한다.`,
      B: `${labelB}을 먼저 두고, 필요한 조정은 나중에 더한다.`
    }
  };
}

const PHASE2_BRANCH_VARIANT_COPY = {
  prompt: [
    (label: string) => `${label}의 원칙이 부담을 만들 때, 어디까지 유지할지 정해야 합니다.`,
    (label: string) => `${label}을 지키는 과정에서 예외를 둘지 다시 판단해야 합니다.`,
    (label: string) => `${label}의 비용이 커질 때, 기준과 조정 중 무엇을 택할까요.`
  ],
  principle: [
    (label: string) => `${label}을 유지하고, 불편이 있어도 기준을 먼저 둔다.`,
    (label: string) => `${label}을 유지해 예측 가능한 판단을 지킨다.`,
    (label: string) => `${label}을 지키되, 필요한 보완은 나중에 더한다.`
  ],
  concession: [
    (label: string) => `${label}을 인정하고, 부담이 커지는 지점은 조정한다.`,
    (label: string) => `${label}을 받아들여 원칙의 적용 범위를 좁힌다.`,
    (label: string) => `${label}을 먼저 두고, 예외가 필요한 상황을 분리한다.`
  ]
};

const PHASE2_BALANCED_VARIANT_COPY = {
  prompt: [
    (left: string, right: string) => `${left}과 ${right}이 모두 설득력 있을 때, 어느 비용을 감수할까요.`,
    (left: string, right: string) => `${left}과 ${right} 사이에서 먼저 잃지 말아야 할 기준을 골라야 합니다.`,
    (left: string, right: string) => `${left}과 ${right}이 정면으로 맞설 때, 어디에 더 무게를 둘까요.`
  ],
  left: [
    (label: string) => `${label}을 먼저 두고, 생기는 비용은 보완한다.`,
    (label: string) => `${label}을 기준으로 삼고, 예외는 좁게 둔다.`,
    (label: string) => `${label}을 우선해 전체 판단의 일관성을 지킨다.`
  ],
  right: [
    (label: string) => `${label}을 먼저 두고, 생기는 비용은 조정한다.`,
    (label: string) => `${label}을 기준으로 삼고, 기존 기준은 다시 맞춘다.`,
    (label: string) => `${label}을 우선해 놓치는 사람을 줄인다.`
  ]
};

function phase2VariantCopy(question: QuestionDefinition, variantOrder: 2 | 3): VariantCopy | null {
  if (question.phase !== 2) return null;

  const orderIndex = (question.branchOrder ?? 1) - 1;
  const labelA = question.display.choices.A.label;
  const labelB = question.display.choices.B.label;

  if (variantOrder === 3) {
    if (question.branchCondition === 'BALANCED') {
      return {
        prompt: `${labelA}과 ${labelB}을 동시에 만족시키기 어렵다면 무엇을 남길까요.`,
        choices: {
          A: `${labelA}을 먼저 보존하고, 빠지는 부분은 별도로 보완한다.`,
          B: `${labelB}을 먼저 보존하고, 기존 기준은 필요한 만큼 조정한다.`
        }
      };
    }

    return {
      prompt: `${labelA}을 계속 밀고 갈수록 ${labelB}의 요구도 커집니다.`,
      choices: {
        A: `${labelA}을 먼저 지키고, 생기는 부담은 감수한다.`,
        B: `${labelB}을 받아들여 원칙의 강도를 낮춘다.`
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
