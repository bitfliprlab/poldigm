# 📄 31_API_데이터_스키마_명세서

## 1. 문서 개요

본 문서는 폴다임(Poldigm) MVP에서 프론트엔드와 SvelteKit 서버 API가 주고받는 데이터 계약을 정의합니다. 핵심 원칙은 **클라이언트가 점수와 분기 로직을 알 수 없게 하고, 서버가 응답 기록만으로 다음 문항과 최종 결과를 계산하는 것**입니다.

## 2. 공통 규칙

- 모든 API는 JSON을 사용합니다.
- 클라이언트는 `history`에 사용자가 선택한 문항 ID와 선택지만 보냅니다.
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

질문 풀은 `src/lib/server/data/questions.ko-KR.json` 또는 `src/lib/server/questions.ts` 같은 서버 전용 경로에서 관리합니다. 클라이언트 번들에 포함하지 않고 SvelteKit 서버 코드에서만 로드합니다. 다국어 확장 시 로케일별 질문 파일을 추가하되, MVP API에는 locale 선택 기능을 노출하지 않습니다.

```ts
type QuestionDefinition = {
  id: string;
  locale: 'ko-KR';
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
  "locale": "ko-KR",
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

## 9. 결과 매핑 데이터 계약

결과 매핑은 `11_결과지_텍스트_맵핑_문서`의 구조를 기준으로 서버 또는 서버 전용 JSON에서 관리합니다. MVP 파일명은 `result-mappings.ko-KR.json`을 기본으로 합니다.

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
