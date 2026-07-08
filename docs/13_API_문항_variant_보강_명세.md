# 13_API 문항 variant 보강 명세

## 1. 목적

본 문서는 2026-06-22 기준 `/api/next-question`에 추가된 문항 variant 선택 계약과 공개 문항 표시 모델을 정리합니다. 기존 `31_API_데이터_스키마_명세서`의 보강 문서로 사용합니다.

## 2. `/api/next-question` request

기본 request는 기존처럼 `history`를 중심으로 동작합니다. 여기에 선택 입력으로 `questionSeed`를 보낼 수 있습니다.

```json
{
  "history": [
    {
      "questionId": "Q_1_C_I_1",
      "choice": "A",
      "answeredAt": "2026-06-22T09:00:00.000Z"
    }
  ],
  "questionSeed": "session-seed-or-uuid"
}
```

`questionSeed`는 클라이언트 세션에서 생성해 `sessionStorage`에 저장합니다. 서버는 같은 세션에서 덜 사용된 `copyFamily` 후보를 우선하고, 최근 3문항에서 반복된 `scenarioTag`, `toneTag` 후보를 뒤로 미룬 뒤, 전체 사용량과 이 값을 이용해 같은 알고리즘 슬롯 안의 후보 문항 중 하나를 deterministic하게 선택합니다.

`questionSeed`가 없으면 서버는 기본 variant를 반환할 수 있습니다.

## 3. 슬롯과 variant

서버는 먼저 알고리즘 슬롯을 결정하고, 그 다음 슬롯 내부 후보를 선택합니다.

| 단계 | 슬롯 기준 |
|---|---|
| Phase 1 | `axis + commonOrder` |
| Phase 2 단방향 | `axis + branchCondition + branchOrder` |
| Phase 2 BALANCED | `axis + BALANCED + branchOrder` |

현재 후보 풀:

| 구분 | 기본 슬롯 | V2 후보 | V3 후보 | 서버 후보 합계 |
|---|---:|---:|---:|---:|
| Phase 1 | 8 | 8 | 8 | 24 |
| Phase 2 | 36 | 36 | 36 | 108 |
| 합계 | 44 | 44 | 44 | 132 |

현재 API 기준 후보 풀은 44개 알고리즘 슬롯과 132개 후보 문항입니다. 후보 문항은 같은 슬롯 안에서만 교체되며, 슬롯의 `axis`, `phase`, `branchCondition`, `scoreEffect`, `intensityEffect` 계약은 변하지 않습니다.

사용자에게 노출되는 문항 수는 계속 20개입니다.

## 4. 공개 문항 응답 타입

공개 응답에는 `display`가 포함됩니다. 기존 `prompt`, `choices`는 호환용 plain text로 유지합니다. 프론트엔드는 `display`를 우선 렌더링하고, 서버가 내려준 라벨과 강조어를 임의로 재계산하지 않습니다.

```ts
type PublicQuestion = {
  id: string;
  phase: 1 | 2;
  axis: 'C_I' | 'T_P' | 'M_E' | 'O_L';
  prompt: string;
  choices: {
    A: string;
    B: string;
  };
  display: {
    promptLines: [string, string];
    promptHighlights: string[];
    choices: {
      A: QuestionChoiceDisplay;
      B: QuestionChoiceDisplay;
    };
  };
  progress: {
    current: number;
    total: 20;
    label: string;
  };
};

type QuestionChoiceDisplay = {
  label: string;
  body: string;
  highlights: string[];
};
```

`display.highlights`는 HTML 문자열이 아니라 안전한 텍스트 키워드 배열입니다. 클라이언트는 이 배열을 기준으로 `<strong>`을 렌더링합니다.

표시 라벨 정책:

- Phase 1과 `BALANCED` 문항의 선택지 라벨은 `먼저 막기`, `동의 먼저`, `천천히 바꾸기`, `먼저 열어두기`, `기여대로`, `버틸 만큼`, `미리 정하기`, `해보고 고치기`처럼 짧은 행동 기준이어야 합니다.
- Phase 2 단방향 문항의 선택지 라벨은 `그대로 간다`, `한발 물린다`를 사용합니다.
- 라벨은 축 설명이나 점수 힌트가 아니며, `scoreEffect`, `branchCondition`, `intensityEffect`를 추론할 수 있게 쓰면 안 됩니다.

공개 문항 예시:

```json
{
  "id": "Q_1_C_I_1",
  "phase": 1,
  "axis": "C_I",
  "prompt": "아파트 단톡방에서 분실 사고를 막자며 출입 기록 공유를 요구합니다.",
  "choices": {
    "A": "불편해도 반복 피해를 줄이는 확인 절차를 먼저 둔다.",
    "B": "불안해도 개인의 출입 기록은 함부로 공유하지 않는다."
  },
  "display": {
    "promptLines": ["아파트 단톡방에서 분실 사고를 막자며", "출입 기록 공유를 요구합니다."],
    "promptHighlights": ["기록"],
    "choices": {
      "A": {
        "label": "먼저 막기",
        "body": "불편해도 반복 피해를 줄이는 확인 절차를 먼저 둔다.",
        "highlights": ["먼저", "피해", "확인", "절차"]
      },
      "B": {
        "label": "동의 먼저",
        "body": "불안해도 개인의 출입 기록은 함부로 공유하지 않는다.",
        "highlights": ["동의", "먼저", "기록"]
      }
    }
  },
  "progress": {
    "current": 1,
    "total": 20,
    "label": "Phase 1 탐색기"
  }
}
```

## 5. 내부 필드 비노출

다음 값은 계속 서버 전용입니다.

- 전체 문항 후보 목록
- `scoreEffect`
- `branchCondition`
- `intensityEffect`
- `metadata`
- 결과 매핑 전체 테이블

문항 variant ID는 `Q_..._V2`처럼 suffix를 가질 수 있습니다. 서버 검증은 ID 문자열의 완전 일치가 아니라 “도달 가능한 같은 슬롯의 후보인지”를 기준으로 판단합니다.

`metadata.scenarioTag`, `metadata.copyFamily`, `metadata.toneTag`는 후보 선택 품질을 높이기 위한 서버 전용 정보입니다. 클라이언트는 이 값을 이용해 문항을 필터링하거나 추론하지 않습니다.
