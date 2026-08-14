# 냉파AI (naengpa-ai)

냉장고를 찍으면, 오늘 먹을 게 보인다.

레시피 검색이 아니라 **자동으로 유지되는 냉장고 재고**를 핵심 가치로 삼는
가정용 AI 식재료 관리 서비스의 프로토타입입니다. 이 저장소는 핵심 루프
(사진 촬영 → AI 재료 인식 → 메뉴 추천) 하나만 빠르게 검증하기 위한 3화면
MVP를 담고 있습니다.

## 화면

- `/` — 홈. 재료 등록 전에는 촬영 유도, 등록 후에는 오늘의 추천 Top 3.
- `/camera` — 냉장고 사진 업로드 → AI 인식 결과 확인/수정 → 냉장고에 반영.
- `/recipes` — 필터(20분 이내 / 아이와 함께 / 추가 장보기 없음) + 전체 추천 목록.

## 기술 스택

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- SQLite (`better-sqlite3`) — `data/naengpa.db`, 최초 실행 시 자동 생성/시드
- Claude Vision (`@anthropic-ai/sdk`) — `ANTHROPIC_API_KEY` 미설정 시 mock 데이터로 자동 대체

## 시작하기

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 설정 시 실제 Vision 인식 사용
npm run dev
```

## 데이터 모델

- `database/schema.sql` — 테이블 정의 (`ingredient_master`, `inventory`, `recipe`, `recipe_ingredient`)
- `database/ingredients.sql` — 재료 마스터 + 기본양념 + 레시피 시드 데이터

기본양념(간장, 고추장, 소금 등)은 `is_basic_seasoning = 1`로 표시되며,
재고 수량을 추적하지 않고 항상 보유한 것으로 간주해 추천 점수 계산에서 제외합니다.

## 추천 알고리즘

`lib/scoring.ts` — 재료 일치율(60%) + 소비기한 임박 보너스(25%) + 조리시간(15%)
가중합으로 점수를 계산합니다. 사용자 선호/과거 이력 기반 개인화는 다음 단계입니다.

## 다음 단계 (범위 밖)

- 회원가입/가구(household) 공유
- "이걸로 먹을래" 선택 후 재고 자동 차감 + 조리 이력
- 장보기 리스트 생성 및 공유
- 영수증 인식, 커머스 연동
