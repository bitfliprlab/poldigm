# 📄 32_DB스키마_및_RLS정책서

## 1. 문서 개요

본 문서는 폴다임(Poldigm) 서비스의 데이터베이스(Supabase / PostgreSQL) 구조와 보안 정책을 정의합니다. 무인증(비로그인) 기반 서비스의 특성상 악의적인 매크로나 데이터 크롤링을 원천 차단하기 위해, **행 수준 보안(RLS, Row Level Security)** 정책을 엄격하게 적용하여 오직 '검증된 데이터의 적재(Insert)'만 허용하도록 설계되었습니다.

## 2. 데이터베이스 테이블 스키마 (Table Schema)

데이터베이스는 사용자 통계 분석 및 추후 트렌드 리포트 발행을 목적으로 단일 테이블(`test_results`)로 가볍게 구성됩니다.

### 테이블명: `test_results`

|**컬럼명 (Column)**|**데이터 타입**|**제약 조건 (Constraints)**|**설명 (Description)**|
|---|---|---|---|
|`id`|`uuid`|Primary Key, Default `uuid_generate_v4()`|레코드 고유 식별자|
|`created_at`|`timestamptz`|Default `now()`|테스트 완료 및 데이터 저장 시각|
|`result_code`|`varchar(10)`|Not Null|최종 도출된 성향 코드 및 태그 (예: `CTMO-S`)|
|`score_c`|`int2`|Not Null, Check `(0~100)`|C (공동체) 누적 점수|
|`score_i`|`int2`|Not Null, Check `(0~100)`|I (개인) 누적 점수|
|`score_t`|`int2`|Not Null, Check `(0~100)`|T (전통) 누적 점수|
|`score_p`|`int2`|Not Null, Check `(0~100)`|P (진보) 누적 점수|
|`score_m`|`int2`|Not Null, Check `(0~100)`|M (능력) 누적 점수|
|`score_e`|`int2`|Not Null, Check `(0~100)`|E (평등) 누적 점수|
|`score_o`|`int2`|Not Null, Check `(0~100)`|O (질서) 누적 점수|
|`score_l`|`int2`|Not Null, Check `(0~100)`|L (자유) 누적 점수|
|`play_time_sec`|`int2`|Nullable|1번 문항부터 완료까지 걸린 총 소요 시간(초). (어뷰징/봇 판단용 지표)|
|`device_type`|`varchar(20)`|Nullable|접속 기기 환경 (예: `Mobile`, `Desktop`, `Tablet`)|
|`utm_source`|`varchar(50)`|Nullable|유입 경로 (예: `ig_story`, `x_link`, `kakao`)|

## 3. RLS (Row Level Security) 보안 정책 설정

Supabase의 핵심 보안 기능인 RLS를 활성화하여, 외부에서 API 키(`anon key`)를 탈취하더라도 기존 데이터를 조회하거나 훼손할 수 없도록 원천 차단합니다.

### 3.1. 보안 정책 SQL 스크립트

아래 SQL 문을 Supabase SQL Editor에서 실행하여 테이블 생성 및 권한을 설정합니다.

SQL

```
-- 1. 테이블 생성
CREATE TABLE test_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  result_code varchar(10) NOT NULL,
  score_c int2 NOT NULL CHECK (score_c >= 0 AND score_c <= 100),
  score_i int2 NOT NULL CHECK (score_i >= 0 AND score_i <= 100),
  score_t int2 NOT NULL CHECK (score_t >= 0 AND score_t <= 100),
  score_p int2 NOT NULL CHECK (score_p >= 0 AND score_p <= 100),
  score_m int2 NOT NULL CHECK (score_m >= 0 AND score_m <= 100),
  score_e int2 NOT NULL CHECK (score_e >= 0 AND score_e <= 100),
  score_o int2 NOT NULL CHECK (score_o >= 0 AND score_o <= 100),
  score_l int2 NOT NULL CHECK (score_l >= 0 AND score_l <= 100),
  play_time_sec int2,
  device_type varchar(20),
  utm_source varchar(50)
);

-- 2. RLS(행 수준 보안) 강제 활성화
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 3. 익명 사용자(anon)의 데이터 적재(INSERT)만 허용하는 정책
CREATE POLICY "Allow Insert for anonymous users" 
ON test_results 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. 익명 사용자(anon)의 데이터 조회(SELECT) 원천 차단 정책
-- (RLS를 활성화하면 기본적으로 차단되지만, 명시적 관리를 위해 기재)
-- 익명 유저에 대한 SELECT, UPDATE, DELETE 권한은 절대 부여하지 않습니다.

-- 5. 관리자(Service Role)의 전체 권한(CRUD) 허용 정책 (어드민 대시보드용)
CREATE POLICY "Allow Full Access for Service Role" 
ON test_results 
TO service_role 
USING (true) 
WITH CHECK (true);
```

## 4. 데이터 플로우 및 무결성 검증 (백엔드 로직)

클라이언트(브라우저)가 Supabase로 직접 데이터를 `INSERT`하게 두지 않고, 반드시 **Cloudflare Edge Server**를 거쳐 검증된 데이터만 DB에 적재합니다.

1. **Turnstile 검증 통과:** 프론트엔드에서 넘어온 봇 검증 토큰이 유효한지 Cloudflare Server에서 1차 확인합니다.
    
2. **시간 검증 로직 (Anti-Macro):** `play_time_sec`가 비정상적으로 짧은 경우(예: 3초 이내에 20문항 완료), 해당 요청을 어뷰징으로 간주하여 DB `INSERT` 과정을 생략(Skip)하고 클라이언트에는 더미 결과를 반환합니다.
    
3. **점수 정합성 확인:** `score_c + score_i`의 합이 설정된 가중치 로직의 최대치(예: 100점)를 초과하는 등 데이터 변조가 의심될 경우 DB 저장을 차단합니다.
    
4. **최종 적재:** 모든 검증을 통과한 순수 유저의 데이터만 Supabase `test_results` 테이블에 안전하게 `INSERT` 됩니다.