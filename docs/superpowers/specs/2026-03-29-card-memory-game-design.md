# Card Memory Game — Design Spec

## Overview

포커카드(트럼프카드) 기반 기억력 향상 카드 짝맞추기 게임. iPhone/iPad에서 PWA로 사용하며, GitHub Pages에 호스팅한다.

## Tech Stack

- **Framework:** Vite + React + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (카드 3D 플립)
- **PWA:** vite-plugin-pwa (오프라인, 홈 화면 추가)
- **Hosting:** GitHub Pages (GitHub Actions 자동 배포)
- **Storage:** localStorage (기록 저장)

## Game Rules

### Matching Rule

같은 색상 + 같은 숫자/문자의 카드 2장을 찾으면 매칭 성공.

- 빨강: 하트(♥) + 다이아(♦)
- 검정: 스페이드(♠) + 클로버(♣)
- 예: 하트A + 다이아A = 매칭 성공, 하트A + 스페이드A = 실패

### Card Deck

포커카드 13종: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K. 레벨에 따라 필요한 수만큼 랜덤 선택하여 쌍을 구성한다.

### Interaction

- 카드 탭 → 뒤집기 (최대 2장 동시)
- 매칭 성공 → 카드 앞면 유지 + 성공 효과
- 매칭 실패 → 1초 후 다시 뒤집힘
- 이미 뒤집힌/매칭된 카드 탭은 무시

## Level System

점진적 레벨 방식. 클리어 시 다음 레벨 해금.

| Level | Cards | Pairs | Grid |
|-------|-------|-------|------|
| 1     | 8     | 4     | 2×4  |
| 2     | 12    | 6     | 3×4  |
| 3     | 16    | 8     | 4×4  |
| 4     | 20    | 10    | 4×5  |
| 5     | 24    | 12    | 4×6  |

- 클리어 조건: 모든 쌍 매칭 완료
- 다음 레벨은 현재 레벨 클리어 후 해금

## Scoring System

### Star Rating (per level)

최소 시도 횟수 = 쌍 수 (예: 레벨 1은 4쌍 → 최소 4번).

- 3 stars: 최소 시도 횟수 × 1.5 이내
- 2 stars: 최소 시도 횟수 × 2 이내
- 1 star: 그 이상

### In-Game Display

- 시도 횟수 (실시간)
- 경과 시간 (실시간)

### Records (localStorage)

- 레벨별 최고 기록 (최소 시도 횟수, 최단 시간)
- 레벨별 획득 별 수
- 해금된 최고 레벨

## Screens

### 1. Main Screen (Level Select)

- 게임 타이틀
- 레벨 선택 버튼 목록
  - 해금된 레벨: 선택 가능 + 별점 표시
  - 잠긴 레벨: 비활성화 (잠금 아이콘)

### 2. Game Screen

- 상단 HUD: 레벨 번호, 시도 횟수, 경과 시간, 홈 버튼
- 카드 그리드: 레벨에 맞는 그리드 배치

### 3. Clear Modal

- 별점 (1~3)
- 시도 횟수
- 완료 시간
- "다시하기" 버튼
- "다음 레벨" 버튼 (마지막 레벨이 아닌 경우)

## Visual Style — Classic Casino

- **카드 앞면:** 흰색 배경, 포커카드 숫자/무늬 (빨강: ♥♦, 검정: ♠♣)
- **카드 뒷면:** 짙은 초록 배경 + 금색 테두리 + 중앙 패턴
- **배경:** 짙은 초록 그라데이션 (카지노 테이블 느낌)
- **플립 애니메이션:** Framer Motion 3D flip, 0.4초

## Responsive Layout

- **iPhone:** 세로 모드 기준, 카드가 화면 너비에 맞게 자동 조절
- **iPad:** 더 넓은 그리드, 카드 크기 확대
- 카드 간 간격과 크기는 뷰포트 기준 자동 계산 (CSS Grid + vw/vh 단위)

## Architecture

```
src/
  components/
    Card.tsx          — 개별 카드 (앞/뒤 렌더링 + 플립 애니메이션)
    CardGrid.tsx      — 카드 그리드 레이아웃
    GameHUD.tsx       — 상단 정보바 (레벨, 시도, 시간)
    LevelSelect.tsx   — 레벨 선택 화면
    ClearModal.tsx    — 클리어 결과 모달
  hooks/
    useGameLogic.ts   — 게임 상태 관리 (카드 뒤집기, 매칭 판정, 레벨 클리어)
    useTimer.ts       — 경과 시간 타이머
    useLocalStorage.ts — 기록 저장/불러오기
  utils/
    deck.ts           — 카드 덱 생성, 셔플, 쌍 선택 로직
    scoring.ts        — 별점 계산
  types/
    game.ts           — 타입 정의 (Card, Level, GameState, Record)
  App.tsx             — 화면 전환 (메인 ↔ 게임)
  main.tsx            — 엔트리포인트
```

### State Flow

1. 레벨 선택 → `deck.ts`에서 해당 레벨의 카드 쌍 생성 & 셔플
2. 카드 탭 → `useGameLogic`에서 뒤집기 상태 관리
3. 2장 뒤집히면 → 매칭 판정 (색상 + 숫자 비교)
4. 모든 쌍 완료 → 별점 계산 → 기록 저장 → 클리어 모달 표시

## Deployment

- `vite.config.ts`에 `base` 경로 설정 (GitHub Pages 리포지토리명)
- GitHub Actions: `main` branch push 시 자동 빌드 → `gh-pages` branch 배포
- PWA manifest + service worker로 오프라인 지원
