import type { ResultMapping } from './types';

const baseMappings: Omit<ResultMapping, 'locale' | 'character_img'>[] = [
  {
    type_code: 'CTMO',
    title: '공동체의 원칙 설계자',
    subtitle: '안정, 성과, 질서를 하나의 운영 원칙으로 묶습니다.',
    desc_S:
      '당신은 공동체가 흔들리지 않으려면 분명한 기준과 책임 있는 실행이 필요하다고 봅니다. 높은 성과와 예측 가능한 질서를 중시하며, 위기 앞에서는 개인의 불편보다 모두의 안전을 먼저 계산합니다.',
    desc_M:
      '당신은 안정적인 공동체를 중시하지만 규칙이 지나치게 강해지는 순간도 경계합니다. 원칙을 세우되 예외와 설명이 함께 있어야 오래 작동한다고 보는 편입니다.',
    chemistry_best: 'ITEL',
    chemistry_worst: 'IPEL'
  },
  {
    type_code: 'CTML',
    title: '절제된 자율 수호자',
    subtitle: '오래된 기준을 존중하되 선택의 공간을 남깁니다.',
    desc_S:
      '당신은 검증된 전통과 개인의 책임 있는 자유를 함께 믿습니다. 공동체의 기준은 필요하지만, 스스로 선택하고 감당할 수 있는 영역까지 지나치게 통제해서는 안 된다고 봅니다.',
    desc_M:
      '당신은 안정과 자유 사이의 현실적인 접점을 찾습니다. 관습을 존중하면서도 각자의 삶에 맞는 선택권을 남기려는 균형 감각이 강합니다.',
    chemistry_best: 'ITMO',
    chemistry_worst: 'CPEL'
  },
  {
    type_code: 'CTEO',
    title: '질서 있는 돌봄 관리자',
    subtitle: '전통의 안정감 위에서 격차를 줄이는 방식을 찾습니다.',
    desc_S:
      '당신은 공동체가 오래 버티려면 안정된 규칙과 기본적인 보호가 함께 필요하다고 봅니다. 질서와 절차를 통해 약한 사람을 보호하는 방식에 신뢰를 둡니다.',
    desc_M:
      '당신은 질서가 필요하다고 보지만, 그 질서가 누군가를 배제하는 순간에는 조정이 필요하다고 느낍니다. 느리더라도 모두가 받아들일 수 있는 복지와 규칙을 선호합니다.',
    chemistry_best: 'ITEL',
    chemistry_worst: 'IPML'
  },
  {
    type_code: 'CTEL',
    title: '온건한 공동체 조율자',
    subtitle: '익숙한 규칙과 서로를 돌보는 마음을 함께 놓습니다.',
    desc_S:
      '당신은 안정된 관습과 상호 배려가 공동체를 지탱한다고 봅니다. 규칙은 필요하지만 경쟁보다 생활의 기반을 함께 지키는 데 더 큰 의미를 두는 사람입니다.',
    desc_M:
      '당신은 전통과 평등 사이에서 차분한 조율을 추구합니다. 변화가 필요할 때도 공동체가 납득할 수 있는 언어와 속도를 중요하게 여깁니다.',
    chemistry_best: 'IPEL',
    chemistry_worst: 'IPMO'
  },
  {
    type_code: 'CPMO',
    title: '공공 혁신 추진가',
    subtitle: '더 나은 사회를 강한 실행력으로 밀어붙입니다.',
    desc_S:
      '당신은 공동체 문제를 해결하기 위해 빠른 변화와 강한 공공 실행이 필요하다고 봅니다. 낡은 기준을 바꾸고, 성과가 나는 방식으로 제도를 움직이는 데 익숙합니다.',
    desc_M:
      '당신은 변화와 실행을 중시하지만, 강한 개입이 현실에서 부작용을 만들 수 있다는 점도 알고 있습니다. 추진력과 조정력 사이의 균형을 찾으려 합니다.',
    chemistry_best: 'IPML',
    chemistry_worst: 'ITEL'
  },
  {
    type_code: 'CPML',
    title: '네트워크형 변화 기획자',
    subtitle: '공동의 목표를 향해 각자의 역량을 연결합니다.',
    desc_S:
      '당신은 사회 변화가 필요하다고 보며, 그 변화는 개인의 능력과 자율적인 참여가 만날 때 더 강해진다고 믿습니다. 새로운 실험과 협업을 적극적으로 받아들입니다.',
    desc_M:
      '당신은 진보적 변화를 지지하지만 모든 해답을 중앙에서 정하는 방식에는 신중합니다. 각자의 역량을 살리는 느슨한 연결을 선호합니다.',
    chemistry_best: 'ITML',
    chemistry_worst: 'CTEO'
  },
  {
    type_code: 'CPEO',
    title: '제도 개혁 분석가',
    subtitle: '불공정한 구조를 질서 있게 고쳐 나갑니다.',
    desc_S:
      '당신은 격차와 배제를 줄이기 위해 강한 제도 개혁이 필요하다고 봅니다. 변화는 감정적 구호가 아니라 구체적인 규칙과 집행으로 완성된다고 믿습니다.',
    desc_M:
      '당신은 평등한 기회를 넓히려 하지만, 제도가 지나치게 복잡해지거나 통제가 과해지는 상황은 경계합니다. 개혁의 목표와 절차를 함께 봅니다.',
    chemistry_best: 'CTEL',
    chemistry_worst: 'ITMO'
  },
  {
    type_code: 'CPEL',
    title: '광장의 평등 연대자',
    subtitle: '더 자유롭고 덜 배제되는 공동체를 상상합니다.',
    desc_S:
      '당신은 공동체가 진정으로 건강하려면 다양한 삶이 동등하게 존중되어야 한다고 봅니다. 격차를 줄이고 자유로운 표현을 넓히는 변화에 강하게 끌립니다.',
    desc_M:
      '당신은 평등과 자유를 함께 중시하지만, 변화의 속도와 현실적 설계도 놓치지 않으려 합니다. 배려와 자율이 함께 작동하는 사회를 선호합니다.',
    chemistry_best: 'CTML',
    chemistry_worst: 'CTMO'
  },
  {
    type_code: 'ITMO',
    title: '개인의 책임 전략가',
    subtitle: '각자의 능력과 질서 있는 경쟁을 신뢰합니다.',
    desc_S:
      '당신은 개인이 책임 있게 선택하고 성과로 인정받는 사회가 강하다고 봅니다. 전통적 안정감과 명확한 질서가 그 경쟁을 지탱한다고 믿는 성향입니다.',
    desc_M:
      '당신은 능력과 책임을 중시하지만, 경쟁이 모든 문제를 해결한다고 보지는 않습니다. 최소한의 보호와 예외적 조정도 필요하다고 느낍니다.',
    chemistry_best: 'CPML',
    chemistry_worst: 'CPEO'
  },
  {
    type_code: 'ITML',
    title: '고전적 자유 장인',
    subtitle: '작은 규칙, 큰 책임, 조용한 자율을 선호합니다.',
    desc_S:
      '당신은 개인의 능력과 자유가 사회를 움직이는 핵심 동력이라고 봅니다. 검증된 관습을 존중하지만, 국가나 조직이 개인의 선택을 과하게 대신하는 것은 경계합니다.',
    desc_M:
      '당신은 자율과 책임을 중시하면서도 공동체의 최소한의 안전망을 부정하지 않습니다. 느슨하지만 예의 있는 사회를 선호하는 현실적인 편입니다.',
    chemistry_best: 'CTML',
    chemistry_worst: 'CPMO'
  },
  {
    type_code: 'ITEO',
    title: '조용한 안정 중재자',
    subtitle: '개인의 존엄과 오래된 안정감을 함께 살핍니다.',
    desc_S:
      '당신은 개인의 삶을 존중하면서도 사회가 갑자기 흔들리지 않도록 안정된 질서가 필요하다고 봅니다. 보호와 절차를 통해 갈등을 줄이는 데 강점이 있습니다.',
    desc_M:
      '당신은 개인의 권리, 전통의 안정감, 기본 보호 사이에서 신중하게 균형을 잡습니다. 과격한 변화보다 납득 가능한 조정을 선호합니다.',
    chemistry_best: 'CTEO',
    chemistry_worst: 'CPML'
  },
  {
    type_code: 'ITEL',
    title: '생활권 중심 자유주의자',
    subtitle: '가까운 관계와 작은 공동체 안의 자유를 믿습니다.',
    desc_S:
      '당신은 큰 제도보다 개인과 가까운 관계의 자율을 더 신뢰합니다. 서로 다른 삶을 존중하되, 오래된 예의와 최소한의 보호가 함께 있어야 한다고 봅니다.',
    desc_M:
      '당신은 자유로운 삶을 선호하지만 차가운 방임에는 거리를 둡니다. 작은 공동체 안에서 서로 돌볼 수 있는 여지를 중요하게 생각합니다.',
    chemistry_best: 'CTEL',
    chemistry_worst: 'CPMO'
  },
  {
    type_code: 'IPMO',
    title: '실험적 효율 개척자',
    subtitle: '새로운 방식과 빠른 성과로 판을 바꿉니다.',
    desc_S:
      '당신은 개인의 자유로운 실험과 성과 중심의 보상이 혁신을 만든다고 봅니다. 기존 관습에 얽매이기보다, 빠르게 시도하고 책임지는 방식을 선호합니다.',
    desc_M:
      '당신은 혁신과 능력주의를 좋아하지만, 실험의 비용이 약한 사람에게 전가되는 상황은 경계합니다. 속도와 책임의 균형을 찾으려 합니다.',
    chemistry_best: 'CPMO',
    chemistry_worst: 'CTEL'
  },
  {
    type_code: 'IPML',
    title: '자유 실험 메이커',
    subtitle: '각자의 역량으로 새로운 판을 직접 만듭니다.',
    desc_S:
      '당신은 누구나 자신의 방식으로 시도하고 성과를 만들 수 있어야 한다고 봅니다. 변화, 자율, 경쟁을 긍정하며 제도는 그 실험을 방해하지 않아야 한다고 믿습니다.',
    desc_M:
      '당신은 자유로운 실험을 선호하지만, 실패의 충격을 완전히 개인에게만 맡기는 방식에는 신중합니다. 최소한의 안전망이 실험을 더 넓힌다고 봅니다.',
    chemistry_best: 'CPML',
    chemistry_worst: 'CTEO'
  },
  {
    type_code: 'IPEO',
    title: '유연한 공정 설계자',
    subtitle: '자유로운 선택과 출발선 보정을 함께 설계합니다.',
    desc_S:
      '당신은 개인의 선택권을 넓히면서도 불리한 출발 조건은 제도로 보정해야 한다고 봅니다. 자유와 평등을 대립보다 설계의 문제로 바라보는 유형입니다.',
    desc_M:
      '당신은 공정한 기회를 중요하게 여기지만, 지나친 개입이 자율을 약하게 만들 수 있다는 점도 의식합니다. 유연한 보정과 투명한 기준을 선호합니다.',
    chemistry_best: 'CPEO',
    chemistry_worst: 'CTMO'
  },
  {
    type_code: 'IPEL',
    title: '자유로운 평등 개척자',
    subtitle: '덜 억압하고 더 넓게 포용하는 사회를 향합니다.',
    desc_S:
      '당신은 개인의 자유와 사회적 평등이 함께 확장되어야 한다고 봅니다. 낡은 규칙을 의심하고, 다양한 삶이 스스로의 방식으로 존중받는 환경을 강하게 선호합니다.',
    desc_M:
      '당신은 자유와 평등을 중시하지만, 현실의 속도와 충돌도 함께 고려합니다. 이상을 잃지 않으면서 실행 가능한 변화의 길을 찾으려 합니다.',
    chemistry_best: 'CPEL',
    chemistry_worst: 'CTMO'
  }
];

export const resultMappings: ResultMapping[] = baseMappings.map((mapping) => ({
  ...mapping,
  locale: 'ko-KR',
  character_img: `character_${mapping.type_code}.png`
}));

export const resultMappingsByCode = new Map(
  resultMappings.map((mapping) => [mapping.type_code, mapping])
);
