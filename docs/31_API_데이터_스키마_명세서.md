# 📄 31_API_데이터_스키마_명세서

## 1. 문서 개요

본 문서는 폴다임(Poldigm) MVP에서 프론트엔드와 SvelteKit 서버 API가 주고받는 데이터 계약을 정의합니다. 핵심 원칙은 **클라이언트가 점수와 분기 로직을 알 수 없게 하고, 서버가 응답 기록만으로 다음 문항과 최종 결과를 계산하는 것**입니다.

## 2. 공통 규칙

- 모든 API는 JSON을 사용합니다.
- 클라이언트는 `history`에 사용자가 선택한 문항 ID와 선택지만 보냅니다.
- 서버는 `history`가 실제 분기 규칙상 도달 가능한 순서인지 검증합니다. 중복 문항, 건너뛴 문항, 현재 분기에서 나올 수 없는 문항 ID는 `validation_error`로 처리합니다.
- 서버 응답의 질문 데이터에는 `scoreEffect`, `branchCondition`, 배점 값 등 내부 알고리즘 필드를 포함하지 않습니다.
- 최종 결과 계산과 DB 적재는 `/api/submit-result`에서만 수행합니다.
- 닉네임은 결과 화면과 공유 이미지 개인화를 위한 선택 입력값입니다. MVP에서는 서버로 전송하지 않고 DB에도 저장하지 않습니다.
- 접속 국가 코드는 클라이언트 입력값을 신뢰하지 않고, Cloudflare 요청 메타데이터에서 서버가 파생한 값만 저장합니다. IP 원문은 DB에 저장하지 않습니다.
- MVP는 `ko-KR` 단일 로케일만 지원합니다. API request에서 `locale`은 받지 않으며, 서버는 내부 기본값 `ko-KR`을 결과 저장 시 사용합니다.

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

- `history`가 빈 배열이면 서버는 1번 문항(`phase=1`, `axis=C_I`, `commonOrder=1`)을 반환합니다.
- `history.length`가 20이면 서버는 더 이상 질문을 반환하지 않고 완료 응답을 반환합니다.
- `history.length`가 21 이상이면 `validation_error`로 처리합니다.

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
    "prompt": "오래 이어진 관습과 새로운 생활 방식이 충돌하는 장면입니다.",
    "choices": {
      "A": "검증된 관습은 사회의 안정감을 위해 신중히 바꾸어야 한다.",
      "B": "새로운 생활 방식은 빠르게 인정하고 제도에 반영해야 한다."
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

`history`는 정확히 20개여야 합니다. 20개보다 적거나 많으면 결과를 산출하지 않고 `validation_error`를 반환합니다.
`playTimeSec`는 사용자가 테스트 시작 후 결과 제출까지 걸린 초 단위 시간입니다. 로컬 MVP와 실제 MVP의 1차 abuse 기준은 `playTimeSec < 20`이며, 이 경우 `429 abuse_suspected`를 반환합니다.

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

`nickname`은 request body에 포함하지 않습니다. 결과 이미지에 닉네임을 표시해야 하는 경우 클라이언트의 세션 상태에서만 사용합니다.
`locale`도 request body에 포함하지 않습니다. MVP에서는 서버 기본값 `ko-KR`을 사용합니다.

### Response

```json
{
  "resultId": "550e8400-e29b-41d4-a716-446655440000",
  "resultCode": "CTMO-S",
  "locale": "ko-KR",
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
    "title": "공동체의 원칙 설계자",
    "subtitle": "안정, 성과, 질서를 하나의 운영 원칙으로 묶습니다.",
    "characterImg": "character_CTMO.png",
    "description": "당신은 공동체가 흔들리지 않으려면 분명한 기준과 책임 있는 실행이 필요하다고 봅니다. 높은 성과와 예측 가능한 질서를 중시하며, 위기 앞에서는 개인의 불편보다 모두의 안전을 먼저 계산합니다.",
    "chemistryBest": "ITEL",
    "chemistryWorst": "IPEL"
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
| `400` | `validation_error` | request body 누락, 잘못된 선택지, 알 수 없는 문항 ID, 도달 불가능한 문항 순서, 완료되지 않은/초과된 history |
| `403` | `bot_verification_failed` | Turnstile 검증 실패 |
| `429` | `abuse_suspected` | `playTimeSec < 20`, 비정상적으로 짧은 플레이 시간 또는 반복 제출 탐지 |
| `500` | `server_error` | 서버 내부 오류, Supabase 저장 실패 |

## 7. 선택 닉네임 및 국가 코드 처리

### 7.1. 선택 닉네임

- 닉네임 입력은 선택 사항입니다.
- 닉네임은 결과 화면 문구와 공유 이미지 렌더링에만 사용합니다.
- 닉네임은 `/api/submit-result`로 전송하지 않으며, `test_results` 테이블에도 저장하지 않습니다.
- 사용자가 실명, 연락처, SNS ID 등 식별 가능한 정보를 입력하지 않도록 UI 안내 문구를 제공합니다.

### 7.2. 국가 코드

- 서버는 Cloudflare 요청 메타데이터에서 접속 국가 코드를 파생할 수 있습니다.
- 저장 형식은 ISO 3166-1 alpha-2 형식의 2자리 코드입니다. 예: `KR`, `US`, `JP`.
- 국가 코드가 없거나 신뢰할 수 없는 경우 `null`로 저장합니다.
- IP 주소 원문, 도시, 상세 위치는 DB에 저장하지 않습니다.

## 8. 서버 전용 질문 풀 개념 스키마

질문 풀은 현재 `src/lib/server/data/questions.ko-KR.ts` 서버 전용 모듈에서 관리합니다. 클라이언트 번들에 포함하지 않고 SvelteKit 서버 코드에서만 로드합니다. 다국어 확장 시 로케일별 질문 파일을 추가하되, MVP API에는 locale 선택 기능을 노출하지 않습니다.

```ts
type QuestionDefinition = {
  id: string;
  locale: 'ko-KR';
  axis: 'C_I' | 'T_P' | 'M_E' | 'O_L';
  phase: 1 | 2;
  branchCondition: 'COMMON' | 'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L' | 'BALANCED';
  commonOrder?: 1 | 2;
  branchOrder?: 1 | 2 | 3;
  prompt: string;
  choices: {
    A: string;
    B: string;
  };
  scoreEffect: {
    A?: Partial<Record<'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L', number>>;
    B?: Partial<Record<'C' | 'I' | 'T' | 'P' | 'M' | 'E' | 'O' | 'L', number>>;
  };
  intensityEffect: {
    A: 'principle' | 'concession' | 'neutral';
    B: 'principle' | 'concession' | 'neutral';
  };
};
```

### 필드 규칙

- `commonOrder`는 `phase=1` 문항에만 사용하며, 축별로 반드시 `1`, `2`가 하나씩 존재해야 합니다.
- `branchOrder`는 `phase=2` 문항에만 사용하며, `axis + branchCondition` 조합별로 반드시 `1`, `2`, `3`이 하나씩 존재해야 합니다.
- `branchCondition='COMMON'`은 Phase 1 문항에만 사용합니다.
- `branchCondition='BALANCED'`는 Phase 2 문항에만 사용합니다.
- `scoreEffect`는 점수 계산에만 사용합니다.
- `intensityEffect`는 S/M 강도 태그 계산에만 사용합니다.
- Phase 1 문항과 Phase 2 `BALANCED` 문항의 `intensityEffect`는 양쪽 선택지 모두 `neutral`로 설정합니다.
- Phase 2 한쪽 쏠림 분기에서는 원칙 고수 선택지를 `principle`, 한계 인정 선택지를 `concession`으로 설정합니다.

### 예시

```json
{
  "id": "Q_1_C_I_1",
  "locale": "ko-KR",
  "axis": "C_I",
  "phase": 1,
  "branchCondition": "COMMON",
  "commonOrder": 1,
  "prompt": "공동의 안전과 개인의 사생활이 충돌할 때 더 가까운 기준을 고릅니다.",
  "choices": {
    "A": "공동체의 위험을 줄이는 조치가 먼저 마련되어야 한다.",
    "B": "개인의 동의와 사생활 보호가 먼저 지켜져야 한다."
  },
  "scoreEffect": {
    "A": { "C": 20 },
    "B": { "I": 20 }
  },
  "intensityEffect": {
    "A": "neutral",
    "B": "neutral"
  }
}
```

### Phase 2 한쪽 쏠림 분기 예시

```json
{
  "id": "Q_2_C_1",
  "locale": "ko-KR",
  "axis": "C_I",
  "phase": 2,
  "branchCondition": "C",
  "branchOrder": 1,
  "prompt": "공동 안전을 이유로 개인 정보 일부를 임시로 모아야 하는 상황입니다.",
  "choices": {
    "A": "찬성한다. 위험이 크다면 공동 안전을 위한 최소한의 정보 수집은 필요하다.",
    "B": "반대한다. 안전이 중요해도 사생활 침해의 기준은 좁게 잡아야 한다."
  },
  "scoreEffect": {
    "A": { "C": 20 },
    "B": {}
  },
  "intensityEffect": {
    "A": "principle",
    "B": "concession"
  }
}
```

### Phase 2 BALANCED 분기 예시

```json
{
  "id": "Q_2_CI_BAL_1",
  "locale": "ko-KR",
  "axis": "C_I",
  "phase": 2,
  "branchCondition": "BALANCED",
  "branchOrder": 1,
  "prompt": "재난 상황에서 감염자 동선 공개와 개인 프라이버시 보호가 충돌한다면 무엇을 우선해야 할까요?",
  "choices": {
    "A": "공공 안전을 위해 필요한 범위의 동선 공개는 허용해야 한다.",
    "B": "감염자도 시민이므로 낙인과 사생활 침해를 막는 것이 먼저다."
  },
  "scoreEffect": {
    "A": { "C": 20 },
    "B": { "I": 20 }
  },
  "intensityEffect": {
    "A": "neutral",
    "B": "neutral"
  }
}
```

## 9. 결과 매핑 데이터 계약

결과 매핑은 `11_결과지_텍스트_맵핑_문서`의 구조를 기준으로 서버 전용 모듈에서 관리합니다. 현재 로컬 MVP 파일은 `src/lib/server/data/result-mappings.ko-KR.ts`입니다.

```ts
type ResultMapping = {
  locale: string;
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

## 10. 결과 페이지 서버 Load 계약

`/result/[id]`는 별도 공개 JSON API를 추가하지 않고 SvelteKit의 `+page.server.ts` load를 통해 결과 데이터를 조회할 수 있습니다.

원칙:

- 서버 load는 URL의 `id`로 저장소 adapter를 조회합니다.
- 로컬 MVP에서는 `mock-results.ts`의 `getLocalResult(id)`를 사용합니다.
- 실제 MVP에서 결과 URL 재방문/공유를 지원할 경우 Supabase 조회 adapter로 교체합니다.
- 서버 load가 반환하는 값은 `resultId`, `resultCode`, `scores`, `resultViewModel` 같은 공개 결과 데이터로 제한합니다.
- `scoreEffect`, `branchCondition`, `intensityEffect`, 전체 문항 풀, 전체 결과 매핑 테이블은 load 결과에 포함하지 않습니다.
- 조회 실패 시 `result: null`을 반환하고, 클라이언트는 같은 세션의 `sessionStorage` fallback 또는 테스트 다시 시작 CTA를 처리합니다.

## 11. 현재 구현 상태

2026-06-21 기준 본 API 계약은 아래 파일에 구현되어 있습니다.

| 계약 | 구현 파일 |
|---|---|
| `POST /api/next-question` | `src/routes/api/next-question/+server.ts` |
| `POST /api/submit-result` | `src/routes/api/submit-result/+server.ts` |
| 결과 페이지 서버 load | `src/routes/result/[id]/+page.server.ts` |
| 공개 타입 | `src/lib/shared/types.ts` |
| 서버 데이터 타입 | `src/lib/server/data/types.ts` |
| 결과 ViewModel 조립 | `src/lib/server/algorithm/results.ts` |

검증:

- `tests/algorithm/questions.test.ts`: 다음 문항, 내부 필드 비노출, 중복/도달 불가 이력 검증
- `tests/api/submit-result.test.ts`: 20문항 길이, abuse, local mock Turnstile, mock 저장 검증
- `tests/e2e/local-mvp.e2e.ts`: 실제 브라우저 플로우에서 API 연동 검증
