import type { Axis, Letter } from '$lib/shared/types';
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
        prompt: '공동의 안전과 개인의 사생활이 충돌할 때 더 가까운 기준을 고릅니다.',
        leftChoice: '공동체의 위험을 줄이는 조치가 먼저 마련되어야 한다.',
        rightChoice: '개인의 동의와 사생활 보호가 먼저 지켜져야 한다.'
      },
      {
        prompt: '모두가 함께 쓰는 공간에서 규칙과 자율이 부딪히는 상황입니다.',
        leftChoice: '공동의 질서를 위해 같은 기준을 적용하는 편이 낫다.',
        rightChoice: '각자의 상황과 선택을 더 넓게 인정하는 편이 낫다.'
      }
    ],
    leftBranch: [
      '공동 안전을 이유로 개인 정보 일부를 임시로 모아야 하는 상황입니다.',
      '다수의 피해를 막기 위해 일부 이동과 활동을 제한하자는 제안이 나왔습니다.',
      '공동체 전체의 신뢰를 지키기 위해 개인의 불편을 요구하는 상황입니다.'
    ],
    rightBranch: [
      '개인의 사생활을 지키면 공동 안전 조치가 느려지는 상황입니다.',
      '자율을 넓게 인정하면 일부 구성원이 규칙을 악용할 가능성이 있습니다.',
      '개인의 선택권을 보호하면 공동 대응의 속도가 낮아지는 상황입니다.'
    ],
    balanced: [
      '공동 안전과 개인 사생활이 모두 중요한 상황에서 우선순위를 정해야 합니다.',
      '모두의 편의를 높이는 규칙이 일부 사람의 자유를 줄일 수 있습니다.',
      '위험을 줄이기 위한 정보 공유와 개인의 통제권이 충돌합니다.'
    ],
    leftPrinciples: [
      '찬성한다. 위험이 크다면 공동 안전을 위한 최소한의 정보 수집은 필요하다.',
      '찬성한다. 공동체 전체를 보호하기 위해 한시적 제한은 감수할 수 있다.',
      '찬성한다. 모두가 버티기 위해서는 개인도 일정한 책임을 져야 한다.'
    ],
    rightPrinciples: [
      '찬성한다. 위기 상황에서도 개인의 동의 없는 침해는 신중해야 한다.',
      '찬성한다. 일부 악용 가능성만으로 모두의 자율을 줄여서는 안 된다.',
      '찬성한다. 느리더라도 개인의 선택권을 존중하는 절차가 필요하다.'
    ],
    leftConcessions: [
      '반대한다. 안전이 중요해도 사생활 침해의 기준은 좁게 잡아야 한다.',
      '반대한다. 제한이 필요해도 기간과 범위를 더 엄격히 정해야 한다.',
      '반대한다. 공동 책임을 요구하더라도 개인에게 과도한 부담을 주면 안 된다.'
    ],
    rightConcessions: [
      '반대한다. 피해가 커지는 상황이라면 사생활 보호도 일부 양보할 수 있다.',
      '반대한다. 악용이 반복된다면 자율보다 공동 기준을 먼저 세워야 한다.',
      '반대한다. 공동 대응이 무너지지 않도록 일정한 조율은 받아들일 수 있다.'
    ],
    balancedLeftChoices: [
      '피해를 줄이는 공동 기준을 먼저 세우고, 이후 보호 장치를 보완한다.',
      '모두가 예측 가능한 규칙을 먼저 두는 편이 낫다.',
      '필요한 범위의 정보 공유를 허용하고 감시 장치를 둔다.'
    ],
    balancedRightChoices: [
      '개인의 동의와 통제권을 먼저 보장하고, 필요한 조치는 좁게 설계한다.',
      '개별 상황을 반영할 여지를 더 크게 남기는 편이 낫다.',
      '정보 공유보다 개인이 거부할 수 있는 절차를 먼저 만든다.'
    ]
  },
  {
    axis: 'T_P',
    compact: 'TP',
    left: 'T',
    right: 'P',
    phase1: [
      {
        prompt: '오래 이어진 관습과 새로운 생활 방식이 충돌하는 장면입니다.',
        leftChoice: '검증된 관습은 사회의 안정감을 위해 신중히 바꾸어야 한다.',
        rightChoice: '새로운 생활 방식은 빠르게 인정하고 제도에 반영해야 한다.'
      },
      {
        prompt: '공동체 교육에서 예절과 다양성 중 무엇을 더 강조할지 정해야 합니다.',
        leftChoice: '공통의 예절과 책임을 먼저 배워야 한다.',
        rightChoice: '서로 다른 정체성과 표현을 먼저 존중해야 한다.'
      }
    ],
    leftBranch: [
      '전통적 규칙이 일부 사람에게 불편을 주지만 공동체의 안정감을 준다는 의견이 있습니다.',
      '오래된 절차가 느리더라도 구성원에게 예측 가능성을 준다는 평가가 있습니다.',
      '새 제도를 급하게 도입하면 세대 간 갈등이 커질 수 있는 상황입니다.'
    ],
    rightBranch: [
      '새로운 권리 요구를 반영하면 기존 구성원이 혼란을 느낄 수 있습니다.',
      '빠른 제도 변화가 필요하지만 아직 사회적 합의가 충분하지 않습니다.',
      '다양성을 넓히는 변화가 기존 관습의 의미를 약하게 만들 수 있습니다.'
    ],
    balanced: [
      '전통이 안정감을 주지만 일부 구성원을 배제할 수 있는 상황입니다.',
      '새로운 기준이 필요하지만 변화 속도가 공동체의 수용력을 넘을 수 있습니다.',
      '익숙한 규칙과 새로운 표현 방식 중 어느 쪽에 더 무게를 둘지 정해야 합니다.'
    ],
    leftPrinciples: [
      '찬성한다. 오래 유지된 규칙은 충분한 검토 없이는 흔들지 않는 편이 낫다.',
      '찬성한다. 느린 절차라도 공동체가 함께 이해할 시간을 주어야 한다.',
      '찬성한다. 변화는 필요해도 세대 간 신뢰가 무너지지 않아야 한다.'
    ],
    rightPrinciples: [
      '찬성한다. 혼란이 있더라도 배제된 사람의 권리를 먼저 반영해야 한다.',
      '찬성한다. 합의가 완벽하지 않아도 필요한 변화는 시작해야 한다.',
      '찬성한다. 관습보다 다양한 삶의 방식이 동등하게 인정되는 것이 중요하다.'
    ],
    leftConcessions: [
      '반대한다. 안정이 중요해도 누군가를 계속 불편하게 만들면 고쳐야 한다.',
      '반대한다. 절차가 느려 피해가 커진다면 예외적 개선이 필요하다.',
      '반대한다. 신뢰를 지키더라도 변화의 필요성을 미루기만 해서는 안 된다.'
    ],
    rightConcessions: [
      '반대한다. 권리 확대도 공동체가 이해할 수 있는 설명과 순서가 필요하다.',
      '반대한다. 변화가 너무 빠르면 제도에 대한 신뢰가 약해질 수 있다.',
      '반대한다. 관습을 모두 낡은 것으로 보지 않고 의미 있는 부분은 남겨야 한다.'
    ],
    balancedLeftChoices: [
      '기존 규칙을 기본으로 두되 불편한 지점을 점진적으로 고친다.',
      '사회가 받아들일 수 있는 속도 안에서 변화한다.',
      '공통의 예절을 먼저 세우고 새로운 표현은 그 안에서 넓힌다.'
    ],
    balancedRightChoices: [
      '배제되는 사람이 있다면 규칙을 더 과감하게 다시 설계한다.',
      '필요한 변화라면 설명을 병행하며 먼저 실행한다.',
      '새로운 표현 방식을 제도 안에 먼저 넣고 관습을 재해석한다.'
    ]
  },
  {
    axis: 'M_E',
    compact: 'ME',
    left: 'M',
    right: 'E',
    phase1: [
      {
        prompt: '같은 조직 안에서 보상 기준을 정해야 하는 상황입니다.',
        leftChoice: '성과와 기여가 큰 사람에게 더 많은 보상이 가야 한다.',
        rightChoice: '기본적인 안정과 격차 완화를 먼저 보장해야 한다.'
      },
      {
        prompt: '선발 과정에서 실력 평가와 출발선 보정이 충돌합니다.',
        leftChoice: '최종 결과는 능력과 노력으로 평가하는 편이 공정하다.',
        rightChoice: '불리한 출발 조건을 보정해야 더 공정하다.'
      }
    ],
    leftBranch: [
      '성과가 높은 사람에게 자원을 몰아주면 전체 효율이 높아지는 상황입니다.',
      '차등 보상이 약해지면 노력의 동기가 떨어질 수 있다는 우려가 있습니다.',
      '최종 결과 중심의 평가가 불리한 환경을 충분히 반영하지 못할 수 있습니다.'
    ],
    rightBranch: [
      '격차를 줄이기 위해 성과가 높은 사람의 보상을 일부 제한하자는 제안이 있습니다.',
      '출발선 보정이 커지면 평가 기준이 흐려질 수 있다는 우려가 있습니다.',
      '기본 안정을 보장하면 경쟁 압력이 줄어 전체 성과가 낮아질 수 있습니다.'
    ],
    balanced: [
      '성과 보상과 격차 완화가 모두 필요한 상황에서 기준을 정해야 합니다.',
      '노력의 결과와 출발선의 차이를 함께 고려해야 하는 장면입니다.',
      '높은 성과에 대한 보상과 최소한의 안정 보장이 충돌합니다.'
    ],
    leftPrinciples: [
      '찬성한다. 높은 기여를 인정해야 더 많은 사람이 실력을 키우려 한다.',
      '찬성한다. 보상 차이가 있어야 노력과 책임의 의미가 살아난다.',
      '찬성한다. 결과 기준이 흔들리면 평가의 예측 가능성이 약해진다.'
    ],
    rightPrinciples: [
      '찬성한다. 격차가 커지면 공동체 전체의 기회가 좁아진다.',
      '찬성한다. 출발선 차이가 크다면 보정 없이는 공정하다고 보기 어렵다.',
      '찬성한다. 기본 안정이 있어야 누구나 도전할 수 있다.'
    ],
    leftConcessions: [
      '반대한다. 효율이 높아져도 기본 생활이 흔들리는 사람은 보호해야 한다.',
      '반대한다. 차등은 필요하지만 지나친 격차는 조직의 신뢰를 해친다.',
      '반대한다. 결과 중심 평가도 환경의 차이를 일부 반영해야 한다.'
    ],
    rightConcessions: [
      '반대한다. 격차 완화가 필요해도 기여의 차이를 모두 지우면 안 된다.',
      '반대한다. 보정은 필요하지만 평가 기준이 불투명해지면 신뢰가 떨어진다.',
      '반대한다. 안정 보장과 함께 성과에 대한 추가 보상도 남겨야 한다.'
    ],
    balancedLeftChoices: [
      '기여에 따른 차등 보상을 기본으로 두고 최소 안전망을 보완한다.',
      '명확한 실력 평가를 유지하되 불리한 조건은 제한적으로 반영한다.',
      '높은 성과에는 분명한 보상을 주는 편이 낫다.'
    ],
    balancedRightChoices: [
      '격차가 지나치게 커지지 않도록 보상 상한과 지원을 함께 둔다.',
      '출발선의 차이를 먼저 보정하고 그 뒤 성과를 비교한다.',
      '누구나 버틸 수 있는 기본 안정이 먼저 보장되어야 한다.'
    ]
  },
  {
    axis: 'O_L',
    compact: 'OL',
    left: 'O',
    right: 'L',
    phase1: [
      {
        prompt: '공공 질서와 자유로운 선택이 부딪히는 상황입니다.',
        leftChoice: '예측 가능한 질서를 위해 일정한 규제가 필요하다.',
        rightChoice: '과도한 규제보다 개인의 선택과 책임을 믿어야 한다.'
      },
      {
        prompt: '위험을 줄이는 규칙과 자유로운 시도가 충돌합니다.',
        leftChoice: '위험이 반복된다면 미리 막는 규칙이 먼저다.',
        rightChoice: '위험 가능성만으로 자유로운 시도를 막아서는 안 된다.'
      }
    ],
    leftBranch: [
      '질서를 지키기 위해 아직 피해가 생기지 않은 행동도 제한하자는 의견이 있습니다.',
      '반복되는 혼란을 줄이기 위해 거래와 표현의 기준을 엄격히 하려 합니다.',
      '공공장소의 예측 가능성을 높이기 위해 행동 규칙을 자세히 만들자는 제안이 있습니다.'
    ],
    rightBranch: [
      '자유를 넓게 인정하면 일부 사람이 무책임하게 행동할 수 있습니다.',
      '규제를 줄이면 새로운 시도는 늘지만 피해 구제가 늦어질 수 있습니다.',
      '자율을 우선하면 공공장소에서 불편을 겪는 사람이 생길 수 있습니다.'
    ],
    balanced: [
      '질서를 위한 규칙과 개인의 자유로운 선택 사이에서 기준을 정해야 합니다.',
      '새로운 시도를 허용하면서도 피해를 줄일 장치가 필요한 상황입니다.',
      '예측 가능한 질서와 스스로 책임지는 자유가 동시에 요구됩니다.'
    ],
    leftPrinciples: [
      '찬성한다. 피해가 커지기 전에 분명한 기준을 세우는 편이 낫다.',
      '찬성한다. 반복되는 혼란은 강한 기준으로 줄여야 한다.',
      '찬성한다. 공공장소에서는 개인의 편의보다 모두의 예측 가능성이 중요하다.'
    ],
    rightPrinciples: [
      '찬성한다. 일부 남용 가능성만으로 자유를 먼저 줄여서는 안 된다.',
      '찬성한다. 새로운 시도는 실패 가능성까지 포함해 허용되어야 한다.',
      '찬성한다. 불편이 있어도 개인의 선택과 책임을 더 존중해야 한다.'
    ],
    leftConcessions: [
      '반대한다. 피해가 명확하지 않은 행동까지 막으면 통제가 과해진다.',
      '반대한다. 강한 기준은 필요해도 새로운 시도를 질식시키면 안 된다.',
      '반대한다. 규칙이 너무 자세하면 개인의 판단 여지가 사라진다.'
    ],
    rightConcessions: [
      '반대한다. 남용이 반복된다면 자유보다 최소한의 질서가 먼저다.',
      '반대한다. 실패의 비용이 다른 사람에게 전가된다면 사전 기준이 필요하다.',
      '반대한다. 공공장소의 불편이 커진다면 자율도 조정되어야 한다.'
    ],
    balancedLeftChoices: [
      '피해 가능성이 크다면 사전 규칙을 먼저 세운다.',
      '새로운 시도보다 피해 예방 장치를 먼저 마련한다.',
      '공공장소에서는 모두가 예측할 수 있는 규칙을 우선한다.'
    ],
    balancedRightChoices: [
      '실제 피해가 확인되기 전까지는 자유로운 선택을 넓게 둔다.',
      '새로운 시도를 허용하고 문제가 생기면 사후에 조정한다.',
      '개인이 책임질 수 있는 범위라면 자율을 먼저 존중한다.'
    ]
  }
];

function phase1Question(copy: AxisCopy, order: 1 | 2): QuestionDefinition {
  const phase = copy.phase1[order - 1];
  return {
    id: `Q_1_${copy.axis}_${order}`,
    locale: 'ko-KR',
    axis: copy.axis,
    phase: 1,
    branchCondition: 'COMMON',
    commonOrder: order,
    prompt: phase.prompt,
    choices: {
      A: phase.leftChoice,
      B: phase.rightChoice
    },
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
  return {
    id: `Q_2_${target}_${order}`,
    locale: 'ko-KR',
    axis: copy.axis,
    phase: 2,
    branchCondition: target,
    branchOrder: order,
    prompt: (isLeft ? copy.leftBranch : copy.rightBranch)[order - 1],
    choices: {
      A: (isLeft ? copy.leftPrinciples : copy.rightPrinciples)[order - 1],
      B: (isLeft ? copy.leftConcessions : copy.rightConcessions)[order - 1]
    },
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
  return {
    id: `Q_2_${copy.compact}_BAL_${order}`,
    locale: 'ko-KR',
    axis: copy.axis,
    phase: 2,
    branchCondition: 'BALANCED',
    branchOrder: order,
    prompt: copy.balanced[order - 1],
    choices: {
      A: copy.balancedLeftChoices[order - 1],
      B: copy.balancedRightChoices[order - 1]
    },
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

export const questionsById = new Map(questions.map((question) => [question.id, question]));
