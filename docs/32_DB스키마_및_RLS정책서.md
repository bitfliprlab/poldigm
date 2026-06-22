# 📄 32_DB스키마_및_RLS정책서

## 1. 문서 개요

본 문서는 폴다임(Poldigm) 서비스의 데이터베이스(Supabase / PostgreSQL) 구조와 보안 정책을 정의합니다. 무인증(비로그인) 기반 서비스의 특성상 악의적인 매크로나 데이터 크롤링을 차단하기 위해, 클라이언트의 Supabase 직접 접근을 금지하고 **SvelteKit 서버 API에서 검증된 데이터만 적재**하도록 설계합니다. RLS(Row Level Security)는 실수나 키 노출에 대비한 추가 방어 계층으로 유지합니다.

## 2. 데이터베이스 테이블 스키마 (Table Schema)

데이터베이스는 사용자 통계 분석 및 추후 트렌드 리포트 발행을 목적으로 단일 테이블(`test_results`)로 가볍게 구성됩니다. 문항 풀과 결과 매핑은 DB에 저장하지 않고 SvelteKit 서버 전용 TS 모듈로 관리합니다.

### 테이블명: `test_results`

|**컬럼명 (Column)**|**데이터 타입**|**제약 조건 (Constraints)**|**설명 (Description)**|
|---|---|---|---|
|`id`|`uuid`|Primary Key, Default `gen_random_uuid()`|레코드 고유 식별자|
|`created_at`|`timestamptz`|Default `now()`|테스트 완료 및 데이터 저장 시각|
|`locale`|`varchar(10)`|Not Null, Default `'ko-KR'`|결과 산출에 사용된 콘텐츠 로케일. MVP 기본값은 `ko-KR`|
|`result_code`|`varchar(10)`|Not Null, Check `^[CI][TP][ME][OL]-(S\|M)$`|최종 도출된 성향 코드 및 태그 (예: `CTMO-S`)|
|`score_c`|`int2`|Not Null, Check `(0~100)`|C (공동체) 누적 점수|
|`score_i`|`int2`|Not Null, Check `(0~100)`|I (개인) 누적 점수|
|`score_t`|`int2`|Not Null, Check `(0~100)`|T (전통) 누적 점수|
|`score_p`|`int2`|Not Null, Check `(0~100)`|P (진보) 누적 점수|
|`score_m`|`int2`|Not Null, Check `(0~100)`|M (성과) 누적 점수|
|`score_e`|`int2`|Not Null, Check `(0~100)`|E (평등) 누적 점수|
|`score_o`|`int2`|Not Null, Check `(0~100)`|O (질서) 누적 점수|
|`score_l`|`int2`|Not Null, Check `(0~100)`|L (자유) 누적 점수|
|`play_time_sec`|`int`|Nullable|1번 문항부터 완료까지 걸린 총 소요 시간(초). (어뷰징/봇 판단용 지표)|
|`device_type`|`varchar(20)`|Nullable|접속 기기 환경 (예: `Mobile`, `Desktop`, `Tablet`)|
|`utm_source`|`varchar(50)`|Nullable|유입 경로 (예: `ig_story`, `x_link`, `kakao`)|
|`country_code`|`char(2)`|Nullable|Cloudflare 요청 메타데이터에서 파생한 접속 국가 코드 (예: `KR`, `US`)|

축별 점수는 개별 점수 `0~100` 범위와 함께, 대립 축 합계가 `100`을 초과하지 않도록 제약합니다. 예: `score_c + score_i <= 100`.

닉네임은 결과 화면 개인화를 위한 선택 입력값이지만, MVP에서는 `test_results` 테이블에 저장하지 않습니다. IP 주소 원문, 도시, 상세 위치도 저장하지 않습니다.

## 3. RLS (Row Level Security) 보안 정책 설정

Supabase의 핵심 보안 기능인 RLS를 활성화하여, 외부에서 클라이언트용 API 키가 노출되더라도 기존 데이터를 조회하거나 훼손할 수 없도록 차단합니다. MVP 기본 방침은 브라우저에서 Supabase를 직접 호출하지 않고, Cloudflare Pages Functions에서 실행되는 SvelteKit 서버 API만 Supabase에 접근하는 것입니다.

SvelteKit 서버 API는 `SUPABASE_SERVICE_ROLE_KEY`를 서버 환경변수로만 보관합니다. Service Role Key는 강력한 서버 권한이므로 클라이언트 번들, 로그, 응답 payload에 절대 노출하지 않습니다. RLS는 anon/client 접근을 차단하는 방어 계층이며, 서버 권한 사용 시에는 서버 API의 입력 검증이 1차 보안 경계입니다.

### 3.1. 보안 정책 SQL 스크립트

아래 SQL 문을 Supabase SQL Editor에서 실행하여 테이블 생성 및 권한을 설정합니다.

SQL

```
-- 0. UUID 생성 함수 활성화
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. 테이블 생성
CREATE TABLE test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  locale varchar(10) NOT NULL DEFAULT 'ko-KR',
  result_code varchar(10) NOT NULL CHECK (result_code ~ '^[CI][TP][ME][OL]-(S|M)$'),
  score_c int2 NOT NULL CHECK (score_c >= 0 AND score_c <= 100),
  score_i int2 NOT NULL CHECK (score_i >= 0 AND score_i <= 100),
  score_t int2 NOT NULL CHECK (score_t >= 0 AND score_t <= 100),
  score_p int2 NOT NULL CHECK (score_p >= 0 AND score_p <= 100),
  score_m int2 NOT NULL CHECK (score_m >= 0 AND score_m <= 100),
  score_e int2 NOT NULL CHECK (score_e >= 0 AND score_e <= 100),
  score_o int2 NOT NULL CHECK (score_o >= 0 AND score_o <= 100),
  score_l int2 NOT NULL CHECK (score_l >= 0 AND score_l <= 100),
  play_time_sec int,
  device_type varchar(20),
  utm_source varchar(50),
  country_code char(2),
  CHECK (score_c + score_i <= 100),
  CHECK (score_t + score_p <= 100),
  CHECK (score_m + score_e <= 100),
  CHECK (score_o + score_l <= 100)
);

-- 2. RLS(행 수준 보안) 강제 활성화
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 3. 클라이언트(anon)의 직접 접근은 허용하지 않음
-- RLS를 활성화하면 별도 정책이 없는 anon 요청은 기본적으로 차단됩니다.
-- MVP에서는 브라우저가 Supabase에 직접 INSERT/SELECT/UPDATE/DELETE 하지 않습니다.

-- 4. 서버(Service Role)의 전체 권한(CRUD) 허용 정책
-- SvelteKit 서버 API는 Cloudflare Pages 환경변수에 저장된 Service Role Key로만 DB에 접근합니다.
-- Supabase service role은 서버 전용 권한이므로 클라이언트에 노출하지 않습니다.
CREATE POLICY "Allow Full Access for Service Role" 
ON test_results 
TO service_role 
USING (true) 
WITH CHECK (true);
```

## 4. 데이터 플로우 및 무결성 검증 (백엔드 로직)

클라이언트(브라우저)가 Supabase로 직접 데이터를 `INSERT`하게 두지 않고, 반드시 **Cloudflare Pages Functions에서 실행되는 SvelteKit 서버 API**를 거쳐 검증된 데이터만 DB에 적재합니다.

1. **Turnstile 검증 통과:** 프론트엔드에서 넘어온 봇 검증 토큰이 유효한지 Cloudflare Server에서 1차 확인합니다.
    
2. **시간 검증 로직 (Anti-Macro):** `play_time_sec < 20`인 경우, 해당 요청을 어뷰징으로 간주하여 DB `INSERT`를 수행하지 않고 API는 `429 abuse_suspected` 오류를 반환합니다. 이 기준은 `31_API_데이터_스키마_명세서`와 `33_로컬_MVP_구현_계획서`의 `playTimeSec < 20` 기준과 동일하게 유지합니다.
    
3. **국가 코드 파생:** 접속 국가 코드는 클라이언트 요청값이 아니라 Cloudflare 요청 메타데이터에서 서버가 파생하며, 없거나 신뢰할 수 없는 경우 `null`로 저장합니다. IP 주소 원문은 저장하지 않습니다.
    
4. **점수 정합성 확인:** `result_code` 형식, 개별 점수 범위, 대립 축 합계(`score_c + score_i`, `score_t + score_p`, `score_m + score_e`, `score_o + score_l`)가 설정된 가중치 로직의 최대치(100점)를 초과하지 않는지 확인합니다. 변조가 의심될 경우 DB 저장을 차단합니다.
    
5. **최종 적재:** 모든 검증을 통과한 순수 유저의 데이터만 서버 권한으로 Supabase `test_results` 테이블에 안전하게 `INSERT` 됩니다.

## 5. 현재 구현 반영

로컬 MVP에서는 Supabase를 사용하지 않습니다. 현재 결과 저장은 `src/lib/server/storage/mock-results.ts`의 메모리 Map으로 대체되어 있습니다.

| 항목 | 로컬 MVP | 실제 MVP |
|---|---|---|
| 결과 저장 | 메모리 mock 저장소 | Supabase `test_results` |
| 결과 ID | `crypto.randomUUID()` | 동일 |
| 결과 조회 | mock Map 조회 | Supabase 조회 adapter |
| RLS | 미적용 | 본 문서 정책 적용 |
| Service Role Key | 불필요 | 서버 환경변수로만 보관 |

따라서 현재 로컬 MVP 검증은 DB/RLS 동작 검증이 아니라 API 계약과 저장 adapter 경계 검증입니다. 실제 MVP 전환 시 `mock-results.ts`를 Supabase adapter로 교체하고 RLS/권한 테스트를 별도로 수행합니다.
