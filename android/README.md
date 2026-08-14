# 냉파AI Android (네이티브)

Kotlin + Jetpack Compose로 만든 냉파AI 네이티브 안드로이드 클라이언트입니다.
DB/추천 로직/Vision AI 연동은 모두 저장소 루트의 Next.js 백엔드(`/api/*`)가
그대로 담당하고, 이 앱은 그 API를 호출하는 얇은 클라이언트입니다.

## 사전 준비

- Android Studio (Koala 이상 권장), JDK 17
- 저장소 루트에서 백엔드 실행: `npm install && npm run dev` (기본 포트 3000)

이 프로젝트는 **Android SDK가 설치된 환경(Android Studio)에서 열어야** 빌드/실행이
됩니다. 지금 이 코드는 Android SDK 다운로드가 막힌 샌드박스에서 작성되어
`./gradlew` 빌드로 직접 검증하지 못했습니다 — Gradle Kotlin DSL 문법과 각 파일의
중괄호 짝은 스크립트로 확인했지만, Android Studio에서 처음 열었을 때 사소한
API 시그니처 오류가 나올 수 있습니다. 열어보시고 에러가 있으면 알려주세요.

## 실행 방법

1. Android Studio에서 `android/` 폴더를 프로젝트로 엽니다 (Gradle sync 자동 진행).
2. 에뮬레이터를 쓴다면 기본 설정 그대로 실행하면 됩니다 — `10.0.2.2:3000`이
   에뮬레이터 기준 호스트 PC의 `localhost:3000`을 가리키도록 이미 설정되어
   있습니다 (`gradle.properties`의 `API_BASE_URL`).
3. 실기기로 테스트하려면 PC와 같은 Wi-Fi에 연결한 뒤:
   ```bash
   ./gradlew installDebug -PAPI_BASE_URL=http://<PC의 LAN IP>:3000/
   ```
4. 카메라 권한을 요청하므로 에뮬레이터는 가상 카메라(웹캠 전달 또는 저장된
   이미지)가 설정되어 있어야 사진 촬영이 동작합니다.

## 구조

```
app/src/main/java/com/naengpa/app/
├─ MainActivity.kt
├─ data/Models.kt              # 백엔드 JSON과 1:1 매칭되는 데이터 클래스
├─ network/ApiService.kt       # Retrofit 인터페이스 (analyze / inventory / recommend)
├─ network/NetworkModule.kt    # OkHttp + kotlinx.serialization 설정
└─ ui/
   ├─ NaengpaApp.kt            # 하단 네비게이션 + NavHost (Home/Camera/Recipes)
   ├─ theme/                   # 웹 버전과 동일한 fresh green 팔레트
   └─ screens/
      ├─ home/                 # 오늘의 추천 Top 3
      ├─ camera/                # 촬영 → 인식 결과 확인/수정 → 반영
      └─ recipes/               # 필터 + 전체 추천 리스트
```

웹 프로토타입(`app/`, 저장소 루트)의 3화면(홈/촬영/요리)과 1:1 대응하도록
설계했습니다. 로직(재료 정규화, 추천 스코어링)은 여전히 백엔드에만 있고,
앱은 카메라로 찍은 사진을 JPEG로 리사이즈(최대 1280px)한 뒤 base64로 인코딩해
그대로 `/api/fridge/analyze`에 넘깁니다.

## 다음 단계 (커머스 연동까지 가는 길)

사용자가 밝힌 최종 목표는 **재고 연동 + 커머스 구매 기능**입니다. 지금 구조에서
거기까지 가려면 대략 이런 순서가 필요합니다.

1. **백엔드를 실제로 배포** — 지금은 로컬 SQLite + `npm run dev`뿐이라 앱이
   개발자 PC에서만 동작합니다. Render 등에 배포하고 PostgreSQL로 옮기는 작업이
   먼저입니다 (웹 프로토타입 README의 로드맵과 동일).
2. **로그인/가구(household) 개념 도입** — 지금은 전역 단일 재고입니다. 실제
   앱이라면 사용자별 재고가 분리돼야 커머스 연동(주문 이력, 배송지)이 의미가
   있습니다. 카카오 로그인이 국내 서비스에 적합합니다.
3. **"이걸로 먹을래" → 재고 자동 차감 + 조리 이력** — 지금 웹/앱 모두 범위
   밖으로 뺐던 기능. 커머스 연동의 트리거(부족한 재료 파악)가 여기서 나옵니다.
4. **장보기 리스트 → 커머스 연동** — 쿠팡/컬리 등은 공식 오픈 커머스 API가
   제한적이므로, 처음에는 "장보기 리스트 → 상품 검색 딥링크" 정도로 시작하고
   추후 제휴/Affiliate API가 확보되면 장바구니 자동 등록으로 확장하는 것이
   현실적입니다.

이번 커밋은 이 로드맵의 앞단인 "네이티브 앱으로 핵심 루프(촬영→인식→추천)
재현" 단계입니다.
