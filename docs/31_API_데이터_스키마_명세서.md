# 📄 31_API_데이터_스키마_명세서

## 1. 문서 개요

본 문서는 폴다임(Poldigm) MVP에서 프론트엔드와 SvelteKit 서버 API가 주고받는 데이터 계약을 정의합니다. 핵심 원칙은 **클라이언트가 점수와 분기 로직을 알 수 없게 하고, 서버가 응답 기록만으로 다음 문항과 최종 결과를 계산하는 것**입니다.

## 2. 공통 규칙

- 모든 API는 JSON을 사용합니다.
- 클라이언트는 `history`에 사용자가 선택한 문항 ID와 선택지만 보냅니다.
- 서버 응답의 질문 데이터에는 `scoreEffect`, `branchCondition`, 배점 값 등 내부 알고리즘 필드를 포함하지 않습니다.
- 최종 결과 계산과 DB 적재는 `/api/submit-result`에서만 수행합니다.

## 3. 공통 타입

### 3.1. AnswerHistoryItem

```ts
type AnswerHistoryItem = {
  questionId: string;
  choice: 'A' | 'B';
  answeredAt?: string;
};
```

### 3.2. PublicQuestion

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
  progress: {
    current: number;
    total: number;
    label: string;
  };
};
```

## 4. `POST /api/next-question`

누적 응답 기록을 기준으로 다음 문항을 반환합니다.

### Request

```json
{
  "history": [
    {
      "questionId": "Q_1_C_I_1",
      "choice": "A",
      "answeredAt": "2026-06-19T09:00:00.000Z"
    }
  ]
}
```

### Response: 진행 중

```json
{
  "status": "in_progress",
  "question": {
    "id": "Q_1_C_I_2",
    "phase": 1,
    "axis": "C_I",
    "prompt": "국가적 전염병 유행 시, 백신 접종을 의무화해야 할까요?",
    "choices": {
      "A": "집단 면역을 위해 의무화하고 미접종자를 제재해야 한다.",
      "B": "개인의 신체 결정권을 침해할 수 없으므로 자율에 맡긴다."
    },
    "progress": {
      "current": 2,
      "total": 20,
      "label": "Phase 1 (탐색기)"
    }
  }
}
```

### Response: 완료

```json
{
  "status": "completed",
  "nextAction": "submit_result"
}
```

## 5. `POST /api/submit-result`

전체 응답 기록과 봇 검증 정보를 받아 서버에서 점수, 결과 코드, 결과 화면 데이터를 계산합니다.

### Request

```json
{
  "history": [
    {
      "questionId": "Q_1_C_I_1",
      "choice": "A",
      "answeredAt": "2026-06-19T09:00:00.000Z"
    }
  ],
  "turnstileToken": "0.xxxxxx",
  "playTimeSec": 142,
  "deviceType": "Mobile",
  "utmSource": "ig_story"
}
```

### Response

```json
{
  "resultId": "550e8400-e29b-41d4-a716-446655440000",
  "resultCode": "CTMO-S",
  "scores": {
    "C": 80,
    "I": 20,
    "T": 80,
    "P": 20,
    "M": 80,
    "E": 20,
    "O": 80,
    "L": 20
  },
  "resultViewModel": {
    "typeCode": "CTMO",
    "intensityTag": "S",
    "title": "냉철한 시스템 설계자",
    "subtitle": "무너진 규칙을 세우고, 검증된 실력자에게 보상하라.",
    "characterImg": "character_CTMO.png",
    "description": "당신은 사회가 올바르게 굴러가기 위해 강력한 통제와 엄격한 규칙이 필수라고 믿는 철저한 시스템 설계자입니다.",
    "chemistryBest": "ITML",
    "chemistryWorst": "CPEL"
  }
}
```

## 6. 오류 응답

모든 오류 응답은 아래 형태를 사용합니다.

```json
{
  "error": {
    "code": "validation_error",
    "message": "history 형식이 올바르지 않습니다."
  }
}
```

| HTTP Status | code | 발생 조건 |
|---|---|---|
| `400` | `validation_error` | request body 누락, 잘못된 선택지, 알 수 없는 문항 ID |
| `403` | `bot_verification_failed` | Turnstile 검증 실패 |
| `429` | `abuse_suspected` | 비정상적으로 짧은 플레이 시간 또는 반복 제출 탐지 |
| `500` | `server_error` | 서버 내부 오류, Supabase 저장 실패 |

## 7. 서버 전용 `questions.json` 개념 스키마

`questions.json`은 클라이언트 번들에 포함하지 않고 SvelteKit 서버 코드에서만 로드합니다.

```ts
type QuestionDefinition = {
  id: string;
  axis: 'C_I' | 'T_P' | 'M_E' | 'O_L';
  phase: 1 | 2;
  branchCondition: 'COMMON' | 'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L' | 'BALANCED';
  prompt: string;
  choices: {
    A: string;
    B: string;
  };
  scoreEffect: {
    A?: Partial<Record<'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L', number>>;
    B?: Partial<Record<'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L', number>>;
  };
};
```

### 예시

```json
{
  "id": "Q_1_C_I_1",
  "axis": "C_I",
  "phase": 1,
  "branchCondition": "COMMON",
  "prompt": "흉악범의 신상정보 공개 범위를 어떻게 해야 할까요?",
  "choices": {
    "A": "인권보다 공공의 알 권리와 안전이 우선이다.",
    "B": "범죄자라도 헌법상 개인의 인권은 보호되어야 한다."
  },
  "scoreEffect": {
    "A": { "C": 20 },
    "B": { "I": 20 }
  }
}
```

## 8. 결과 매핑 데이터 계약

결과 매핑은 `11_결과지_텍스트_맵핑_문서`의 구조를 기준으로 서버 또는 서버 전용 JSON에서 관리합니다.

```ts
type ResultMapping = {
  type_code: string;
  title: string;
  subtitle: string;
  character_img: string;
  desc_S: string;
  desc_M: string;
  chemistry_best: string;
  chemistry_worst: string;
};
```

프론트엔드는 API가 반환한 `resultViewModel`만 렌더링하며, 전체 결과 매핑 테이블을 직접 보유하지 않습니다.
