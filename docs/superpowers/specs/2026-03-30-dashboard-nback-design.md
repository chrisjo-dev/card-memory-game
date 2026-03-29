# Dashboard + Dual N-Back Game — Design Spec

## Overview

기존 카드 메모리 게임에 대시보드와 Dual N-Back 워킹메모리 훈련 게임을 추가한다. 대시보드에서 게임을 선택하는 허브 구조로 전환한다.

## 1. Dashboard

- 앱 타이틀: "Brain Training"
- 게임 카드 2개 세로 나열:
  - **Card Memory** (🃏) — 카드 짝맞추기, 최고 레벨 표시
  - **Dual N-Back** (🧠) — 워킹메모리 훈련, 최고 N 레벨 표시
- 각 카드 탭 → 해당 게임 진입
- 카지노 그린 테마 유지, 금색 포인트
- 게임 내 홈 버튼 → 대시보드 복귀

## 2. Dual N-Back Game Rules

### Basic Concept

3×3 그리드에 포커카드가 하나씩 나타난다. 플레이어는 N번 전 자극과 비교하여 두 가지를 판단한다:
- **위치 매칭**: 카드가 나타난 위치가 N번 전과 같은가?
- **카드 매칭**: 카드의 종류(숫자+색상)가 N번 전과 같은가?

### Stimulus Timing

- 카드 표시: 2초 → 빈 화면: 0.5초 → 다음 카드 (총 2.5초/턴)
- 판단 버튼은 카드가 보이는 2초 동안만 활성

### Judgment

- "Position" 버튼: 위치가 N번 전과 같다고 판단
- "Card" 버튼: 카드가 N번 전과 같다고 판단
- 둘 다 누르거나, 둘 다 안 누르거나, 하나만 누를 수 있음
- 정답/오답은 해당 턴 종료 후 짧은 피드백 (초록/빨강 깜빡임)

### Adaptive Difficulty

- 시작: 1-Back (수동으로 다른 레벨 선택도 가능)
- 라운드 종료 후 위치/카드 각각 정답률 계산
- 둘 다 80% 이상 → N+1 승급
- 둘 중 하나라도 50% 이하 → N-1 하강 (최소 1)
- 그 외 → N 유지

### Stimulus Generation

- 위치 매칭 확률: ~30% (N번 전과 같은 위치)
- 카드 매칭 확률: ~30% (N번 전과 같은 카드)
- 둘 다 매칭: ~10% (자연 발생)
- 나머지: 불일치
- 사용 카드: 기존 포커카드 덱에서 랜덤 선택 (숫자+색상)

### Round Configuration

- 자극 횟수: 20/30/40 중 사용자 선택
- N-Back 레벨: 1~9 (적응형 추천값 하이라이트)

## 3. Screens

### N-Back Setup Screen

- N-Back 레벨 선택 (1~9, 적응형 추천값 하이라이트)
- 자극 횟수 선택 (20/30/40)
- "Start" 버튼

### N-Back Game Screen

- 상단 HUD: 현재 N 레벨, 진행률 (예: 12/30), 홈 버튼
- 중앙: 3×3 그리드 (카드가 한 칸에 나타남)
- 하단: "Position" 버튼 + "Card" 버튼 (크게, 터치 친화적)
- 버튼 누르면 즉시 색상 피드백 (눌림 표시), 턴 종료 후 정답 피드백

### N-Back Result Screen

- 위치 정답률 / 카드 정답률 각각 표시
- 적응형 결과: "N+1 승급!" / "N 유지" / "N-1 하강"
- "다시하기" / "대시보드" 버튼

### Stats View

- 최근 20세션의 N 레벨 추이 그래프 (SVG 라인 차트)
- 위치/카드 각각 평균 정답률
- 최고 도달 N 레벨
- 접근: 대시보드에서 N-Back 카드의 통계 아이콘

## 4. Records (localStorage)

### N-Back Records

- 세션별 기록: { date, nLevel, trialCount, positionAccuracy, cardAccuracy, result }
- 최근 20세션 저장
- 최고 N 레벨
- 현재 적응형 추천 N 레벨

### Card Memory Records

- 기존 유지 (레벨별 최고 기록, 별점)

## 5. Visual Style

- 카지노 그린 테마 통일 (기존과 동일)
- N-Back 그리드: 3×3 셀, 빈 셀은 어두운 초록, 활성 셀에 포커카드 표시
- Position/Card 버튼: 큼직하게, 금색 테두리, 눌렸을 때 시각적 피드백
- 결과 화면: 정답률 바, 승급/하강 애니메이션

## 6. Architecture

```
src/
  components/
    Dashboard.tsx         — 게임 선택 대시보드
  games/
    card-memory/
      components/         — Card, CardGrid, GameHUD, LevelSelect, ClearModal
      hooks/              — useGameLogic, useTimer, useLocalStorage
      utils/              — deck, scoring
      types/              — game types
      CardMemoryGame.tsx  — 카드 매칭 게임 루트
    n-back/
      components/
        NBackGrid.tsx     — 3×3 그리드
        NBackHUD.tsx      — 상단 정보바
        NBackControls.tsx — Position/Card 판단 버튼
        NBackSetup.tsx    — 라운드 설정 화면
        NBackResult.tsx   — 결과 화면
        StatsView.tsx     — 통계/그래프 화면
      hooks/
        useNBackLogic.ts  — 게임 로직
        useNBackRecords.ts — 기록 저장/통계
      utils/
        stimulus.ts       — 자극 시퀀스 생성
      types/
        nback.ts          — 타입 정의
      NBackGame.tsx       — N-Back 게임 루트
  App.tsx                 — dashboard ↔ card-memory ↔ n-back 분기
```

### State Flow (N-Back)

1. 설정 → `stimulus.ts`에서 자극 시퀀스 생성 (위치 + 카드, 매칭 비율 보장)
2. 게임 루프 → `useNBackLogic`이 타이머로 자극 순차 표시
3. 버튼 입력 → 현재 자극과 N번 전 자극 비교 → 즉시 기록
4. 라운드 종료 → 정답률 계산 → 적응형 판정 → 기록 저장

### App Routing

상태 기반 라우팅: `screen` 상태로 `'dashboard' | 'card-memory' | 'n-back'` 분기. React Router 미사용.

## 7. Responsive Layout

- iPhone: 세로 모드 기준, 3×3 그리드와 버튼이 화면에 모두 표시
- iPad: 그리드 크기 확대, 버튼 더 넓게
- 버튼은 터치 타겟 최소 44px 유지
