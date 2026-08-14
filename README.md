# 냉파AI (naengpa-ai)

냉장고를 찍으면, 오늘 먹을 게 보인다.

레시피 검색이 아니라 **자동으로 유지되는 냉장고 재고**를 핵심 가치로 삼는
가정용 AI 식재료 관리 서비스의 프로토타입입니다. 이 저장소는 핵심 루프
(사진 촬영 → AI 재료 인식 → 메뉴 추천) 하나만 빠르게 검증하기 위한 3화면
MVP를 담고 있습니다.

## 화면

- `/login`, `/signup` — 로그인/회원가입. 가입 시 새 가구를 만들거나 초대코드로
  기존 가구에 합류한다. 로그인하지 않으면 미들웨어가 자동으로 `/login`으로 보낸다.
- `/` — 홈. 재료 등록 전에는 촬영 유도, 등록 후에는 오늘의 추천 Top 3.
- `/camera` — 냉장고 사진 업로드 → AI 인식 결과 확인/수정 → 냉장고에 반영.
- `/recipes` — 요리종류(전체/한식/중식/양식) + 상세 필터(20분 이내 / 아이와 함께 /
  추가 장보기 없음 / 매운맛 / 다이어트식 / 유아식 / 튀김) + 전체 추천 목록.

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

## 인증 / 가구(household)

이메일+비밀번호로 가입하며, 가입 시 두 가지 중 하나를 선택한다.

- **새 가구 만들기** — 가구 이름을 입력하면 6자리 초대코드가 발급된다.
- **초대코드로 합류** — 가족이 알려준 초대코드를 입력하면 같은 가구에 들어가
  냉장고 재고를 공유한다.

세션은 서버에 발급한 랜덤 토큰(`session` 테이블)으로 관리하며, 웹은 httpOnly
쿠키로, 안드로이드 앱은 `Authorization: Bearer <token>` 헤더로 전달한다
(`lib/auth.ts`의 `getRequestUser`가 둘 다 처리). `inventory`는 `household_id`로
스코핑되어 같은 가구 구성원끼리만 재고를 보고 수정할 수 있다.
`/api/inventory`, `/api/fridge/analyze`, `/api/recipes/recommend`는 모두
로그인이 필요하다.

## 데이터 모델

- `database/schema.sql` — 테이블 정의 (`household`, `user`, `session`,
  `ingredient_master`, `inventory`, `recipe`, `recipe_ingredient`)
- `database/ingredients.sql` — 재료 마스터 + 기본양념 + 레시피 시드 데이터 (13종)

기본양념(간장, 고추장, 소금 등)은 `is_basic_seasoning = 1`로 표시되며,
재고 수량을 추적하지 않고 항상 보유한 것으로 간주해 추천 점수 계산에서 제외합니다.

각 레시피는 `cuisine_type`(한식/중식/양식), `cooking_method`(볶음/찜/구이/튀김/조림/
국물/부침/무침), `spicy_level`(0~3, 매운맛), `is_diet`(다이어트식), `is_baby_food`
(유아식) 태그를 갖고 있어 `/recipes` 화면과 API(`/api/recipes/recommend`)에서
필터로 사용합니다.

## 추천 알고리즘

`lib/scoring.ts` — 재료 일치율(60%) + 소비기한 임박 보너스(25%) + 조리시간(15%)
가중합으로 점수를 계산합니다. 사용자 선호/과거 이력 기반 개인화는 다음 단계입니다.

## Android 앱

`android/` — 이 백엔드를 그대로 호출하는 Kotlin + Jetpack Compose 네이티브
클라이언트. 화면 구성과 기술 스택은 `android/README.md` 참고.

## 다음 단계 (범위 밖)

- "이걸로 먹을래" 선택 후 재고 자동 차감 + 조리 이력
- 장보기 리스트 생성 및 공유
- 영수증 인식, 커머스 연동
- 비밀번호 재설정, 소셜 로그인(카카오 등)
