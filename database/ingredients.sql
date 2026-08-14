-- 재료 마스터 + 레시피 시드 데이터 (프로토타입 검증용)

-- 1) 일반 식재료
INSERT OR IGNORE INTO ingredient_master (name_ko, name_en, category, default_unit, storage_type, default_shelf_life_days, is_basic_seasoning, aliases) VALUES
('계란', 'egg', '유제품/계란', '개', '냉장', 21, 0, '["달걀","란","egg"]'),
('두부', 'tofu', '콩가공품', '모', '냉장', 7, 0, '["연두부","순두부","tofu"]'),
('우유', 'milk', '유제품', 'L', '냉장', 7, 0, '["milk","흰우유","저지방우유"]'),
('김치', 'kimchi', '채소가공품', '통', '냉장', 30, 0, '["배추김치","묵은지","kimchi"]'),
('양파', 'onion', '채소', '개', '실온', 14, 0, '["onion"]'),
('애호박', 'zucchini', '채소', '개', '냉장', 5, 0, '["호박","zucchini","courgette"]'),
('대파', 'green onion', '채소', '단', '냉장', 10, 0, '["파","scallion","green onion"]'),
('햄', 'ham', '육가공품', '팩', '냉장', 14, 0, '["스팸","ham","런천미트"]'),
('삼겹살', 'pork belly', '육류', 'g', '냉장', 3, 0, '["돼지삼겹살","pork belly","냉동삼겹","삼겹"]'),
('돼지고기', 'pork', '육류', 'g', '냉장', 3, 0, '["돼지고기","pork","목살","앞다리살"]'),
('팽이버섯', 'enoki mushroom', '채소/버섯', '봉', '냉장', 7, 0, '["팽이","enoki"]'),
('만두', 'dumpling', '냉동식품', '봉', '냉동', 60, 0, '["냉동만두","dumpling","군만두"]'),
('새우', 'shrimp', '냉동식품', 'g', '냉동', 60, 0, '["냉동새우","shrimp","칵테일새우"]'),
('김가루', 'dried laver flakes', '건어물', 'g', '실온', 180, 0, '["조미김가루","김","laver"]'),
('토마토', 'tomato', '채소', '개', '냉장', 7, 0, '["tomato","방울토마토"]'),
('감자', 'potato', '채소', '개', '실온', 21, 0, '["potato","감자알"]'),
('파스타면', 'pasta', '건면', 'g', '실온', 365, 0, '["스파게티","파스타","pasta","spaghetti"]');

-- 2) 기본양념 (수량 관리 없이 보유 여부만 관리)
INSERT OR IGNORE INTO ingredient_master (name_ko, name_en, category, default_unit, storage_type, default_shelf_life_days, is_basic_seasoning, aliases) VALUES
('간장', 'soy sauce', '기본양념', '-', '실온', NULL, 1, '["soy sauce","진간장","양조간장"]'),
('고추장', 'gochujang', '기본양념', '-', '실온', NULL, 1, '["gochujang"]'),
('된장', 'doenjang', '기본양념', '-', '실온', NULL, 1, '["doenjang"]'),
('참기름', 'sesame oil', '기본양념', '-', '실온', NULL, 1, '["sesame oil"]'),
('고춧가루', 'red pepper flakes', '기본양념', '-', '실온', NULL, 1, '["고추가루","red pepper flakes"]'),
('식용유', 'cooking oil', '기본양념', '-', '실온', NULL, 1, '["cooking oil","콩기름"]'),
('설탕', 'sugar', '기본양념', '-', '실온', NULL, 1, '["sugar"]'),
('소금', 'salt', '기본양념', '-', '실온', NULL, 1, '["salt"]'),
('후추', 'pepper', '기본양념', '-', '실온', NULL, 1, '["후춧가루","pepper"]'),
('다진마늘', 'minced garlic', '기본양념', '-', '냉장', NULL, 1, '["마늘","다진 마늘","minced garlic"]'),
('식초', 'vinegar', '기본양념', '-', '실온', NULL, 1, '["vinegar"]');

-- 3) 레시피
-- ON CONFLICT(title) DO UPDATE: 이미 존재하는 DB(data/naengpa.db)에 이 파일이
-- 다시 실행돼도(서버 재시작 시 항상 실행됨) 예전에 ALTER TABLE 기본값으로 채워진
-- 태그가 여기 적힌 실제 값으로 갱신된다. INSERT OR IGNORE만 쓰면 title이 이미
-- 있는 기존 레시피의 새 컬럼(cuisine_type 등)이 계속 기본값에 머무르게 된다.
INSERT INTO recipe
  (title, description, servings, cook_time_minutes, difficulty, kid_friendly, spicy_level, cuisine_type, cooking_method, is_diet, is_baby_food)
VALUES
('삼겹살 간장덮밥', '삼겹살을 간장 양념에 볶아 밥 위에 올리는 덮밥', 4, 18, '쉬움', 1, 0, '한식', '볶음', 0, 0),
('두부계란전', '두부와 계란을 부쳐 만드는 간단한 전', 2, 12, '쉬움', 1, 0, '한식', '부침', 1, 1),
('김치찌개', '묵은지와 돼지고기로 끓이는 대표 가정식', 4, 25, '보통', 0, 2, '한식', '국물', 0, 0),
('애호박계란전', '애호박과 계란으로 만드는 아삭한 전', 2, 12, '쉬움', 1, 0, '한식', '부침', 1, 1),
('두부계란덮밥', '두부와 계란을 간장 소스에 올린 간단 덮밥', 2, 10, '쉬움', 1, 0, '한식', '볶음', 1, 1),
('계란찜', '뚝배기 없이도 만드는 폭신한 계란찜', 2, 15, '쉬움', 1, 0, '한식', '찜', 1, 1),
('스팸김치볶음밥', '햄과 김치로 볶는 든든한 볶음밥', 2, 15, '쉬움', 1, 1, '한식', '볶음', 0, 0),
('새우볶음밥', '냉동새우로 만드는 담백한 볶음밥', 2, 15, '쉬움', 1, 0, '중식', '볶음', 0, 0),
('군만두', '냉동만두를 노릇하게 구운 간편식', 2, 10, '쉬움', 1, 0, '중식', '구이', 0, 0),
('토마토 계란볶음', '토마토와 계란만으로 만드는 중국 가정식 볶음', 2, 12, '쉬움', 1, 0, '중식', '볶음', 1, 1),
('감자튀김', '겉바속촉 수제 감자튀김', 2, 20, '보통', 1, 0, '양식', '튀김', 0, 0),
('토마토 파스타', '토마토와 양파로 만드는 담백한 파스타', 2, 20, '쉬움', 1, 0, '양식', '볶음', 0, 0),
('제육볶음', '고추장 양념에 매콤하게 볶는 돼지고기 요리', 3, 20, '보통', 0, 2, '한식', '볶음', 0, 0)
ON CONFLICT(title) DO UPDATE SET
  description = excluded.description,
  servings = excluded.servings,
  cook_time_minutes = excluded.cook_time_minutes,
  difficulty = excluded.difficulty,
  kid_friendly = excluded.kid_friendly,
  spicy_level = excluded.spicy_level,
  cuisine_type = excluded.cuisine_type,
  cooking_method = excluded.cooking_method,
  is_diet = excluded.is_diet,
  is_baby_food = excluded.is_baby_food;

-- 4) 레시피 재료 (필수 재료 + 선택 재료 + 기본양념)
INSERT OR IGNORE INTO recipe_ingredient (recipe_id, ingredient_id, quantity_text, required)
SELECT r.id, i.id, x.quantity_text, x.required
FROM (
  SELECT '삼겹살 간장덮밥' AS recipe_title, '삼겹살' AS ingredient_name, '300g' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '양파' AS ingredient_name, '1개' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '계란' AS ingredient_name, '2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '대파' AS ingredient_name, '1/3대' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '간장' AS ingredient_name, '2T' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '설탕' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '다진마늘' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '삼겹살 간장덮밥' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란전' AS recipe_title, '두부' AS ingredient_name, '1/2모' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란전' AS recipe_title, '계란' AS ingredient_name, '2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란전' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란전' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '김치찌개' AS recipe_title, '김치' AS ingredient_name, '300g' AS quantity_text, 1 AS required
  UNION ALL SELECT '김치찌개' AS recipe_title, '돼지고기' AS ingredient_name, '200g' AS quantity_text, 1 AS required
  UNION ALL SELECT '김치찌개' AS recipe_title, '고춧가루' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '김치찌개' AS recipe_title, '다진마늘' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '김치찌개' AS recipe_title, '두부' AS ingredient_name, '1/2모' AS quantity_text, 0 AS required
  UNION ALL SELECT '김치찌개' AS recipe_title, '대파' AS ingredient_name, '1/2대' AS quantity_text, 0 AS required
  UNION ALL SELECT '애호박계란전' AS recipe_title, '애호박' AS ingredient_name, '1개' AS quantity_text, 1 AS required
  UNION ALL SELECT '애호박계란전' AS recipe_title, '계란' AS ingredient_name, '1개' AS quantity_text, 1 AS required
  UNION ALL SELECT '애호박계란전' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '애호박계란전' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란덮밥' AS recipe_title, '두부' AS ingredient_name, '1모' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란덮밥' AS recipe_title, '계란' AS ingredient_name, '2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란덮밥' AS recipe_title, '간장' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란덮밥' AS recipe_title, '참기름' AS ingredient_name, '1작은술' AS quantity_text, 1 AS required
  UNION ALL SELECT '두부계란덮밥' AS recipe_title, '김가루' AS ingredient_name, '약간' AS quantity_text, 0 AS required
  UNION ALL SELECT '계란찜' AS recipe_title, '계란' AS ingredient_name, '4개' AS quantity_text, 1 AS required
  UNION ALL SELECT '계란찜' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '계란찜' AS recipe_title, '참기름' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '스팸김치볶음밥' AS recipe_title, '햄' AS ingredient_name, '1팩' AS quantity_text, 1 AS required
  UNION ALL SELECT '스팸김치볶음밥' AS recipe_title, '김치' AS ingredient_name, '200g' AS quantity_text, 1 AS required
  UNION ALL SELECT '스팸김치볶음밥' AS recipe_title, '계란' AS ingredient_name, '1개' AS quantity_text, 1 AS required
  UNION ALL SELECT '스팸김치볶음밥' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '스팸김치볶음밥' AS recipe_title, '간장' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '새우볶음밥' AS recipe_title, '새우' AS ingredient_name, '150g' AS quantity_text, 1 AS required
  UNION ALL SELECT '새우볶음밥' AS recipe_title, '계란' AS ingredient_name, '2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '새우볶음밥' AS recipe_title, '대파' AS ingredient_name, '1/4대' AS quantity_text, 1 AS required
  UNION ALL SELECT '새우볶음밥' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '새우볶음밥' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '새우볶음밥' AS recipe_title, '후추' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '군만두' AS recipe_title, '만두' AS ingredient_name, '1봉' AS quantity_text, 1 AS required
  UNION ALL SELECT '군만두' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 계란볶음' AS recipe_title, '토마토' AS ingredient_name, '2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 계란볶음' AS recipe_title, '계란' AS ingredient_name, '3개' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 계란볶음' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 계란볶음' AS recipe_title, '설탕' AS ingredient_name, '1t' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 계란볶음' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '감자튀김' AS recipe_title, '감자' AS ingredient_name, '3개' AS quantity_text, 1 AS required
  UNION ALL SELECT '감자튀김' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '감자튀김' AS recipe_title, '식용유' AS ingredient_name, '넉넉히' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 파스타' AS recipe_title, '파스타면' AS ingredient_name, '200g' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 파스타' AS recipe_title, '토마토' AS ingredient_name, '2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 파스타' AS recipe_title, '양파' AS ingredient_name, '1/2개' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 파스타' AS recipe_title, '소금' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 파스타' AS recipe_title, '후추' AS ingredient_name, '약간' AS quantity_text, 1 AS required
  UNION ALL SELECT '토마토 파스타' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '돼지고기' AS ingredient_name, '300g' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '양파' AS ingredient_name, '1개' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '대파' AS ingredient_name, '1/2대' AS quantity_text, 0 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '고추장' AS ingredient_name, '2T' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '고춧가루' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '다진마늘' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '설탕' AS ingredient_name, '1T' AS quantity_text, 1 AS required
  UNION ALL SELECT '제육볶음' AS recipe_title, '식용유' AS ingredient_name, '1T' AS quantity_text, 1 AS required
) AS x
JOIN recipe r ON r.title = x.recipe_title
JOIN ingredient_master i ON i.name_ko = x.ingredient_name;

-- 5) 확장 재료 (일반 식재료) - 레시피 확장을 위해 추가
INSERT OR IGNORE INTO ingredient_master (name_ko, name_en, category, default_unit, storage_type, default_shelf_life_days, is_basic_seasoning, aliases) VALUES
('소고기', 'beef', '육류', 'g', '냉장', 3, 0, '["beef","불고기감","국거리","등심"]'),
('닭고기', 'chicken', '육류', 'g', '냉장', 3, 0, '["chicken","닭다리살","닭가슴살"]'),
('어묵', 'fish cake', '가공식품', 'g', '냉장', 10, 0, '["오뎅","fish cake","사각어묵"]'),
('콩나물', 'bean sprouts', '채소', '봉', '냉장', 5, 0, '["bean sprouts"]'),
('시금치', 'spinach', '채소', '단', '냉장', 5, 0, '["spinach"]'),
('당근', 'carrot', '채소', '개', '냉장', 14, 0, '["carrot"]'),
('깻잎', 'perilla leaf', '채소', '팩', '냉장', 7, 0, '["perilla leaf","깻잎순"]'),
('미역', 'seaweed', '건어물', 'g', '실온', 365, 0, '["건미역","seaweed"]'),
('무', 'radish', '채소', '개', '실온', 14, 0, '["radish","무우"]'),
('배추', 'napa cabbage', '채소', '포기', '냉장', 10, 0, '["napa cabbage"]'),
('오이', 'cucumber', '채소', '개', '냉장', 7, 0, '["cucumber"]'),
('느타리버섯', 'oyster mushroom', '채소/버섯', '봉', '냉장', 7, 0, '["oyster mushroom","버섯"]'),
('멸치', 'dried anchovy', '건어물', 'g', '실온', 180, 0, '["다시멸치","anchovy"]'),
('소면', 'thin wheat noodles', '건면', 'g', '실온', 365, 0, '["국수","somyeon"]'),
('우동면', 'udon noodles', '면류', '봉', '냉장', 10, 0, '["udon"]'),
('치즈', 'sliced cheese', '유제품', '장', '냉장', 14, 0, '["슬라이스치즈","cheese"]'),
('베이컨', 'bacon', '육가공품', '팩', '냉장', 10, 0, '["bacon"]'),
('소세지', 'sausage', '육가공품', '팩', '냉장', 14, 0, '["비엔나소세지","sausage"]'),
('식빵', 'bread', '빵류', '봉', '실온', 5, 0, '["토스트식빵","bread"]'),
('양배추', 'cabbage', '채소', '통', '냉장', 14, 0, '["cabbage"]'),
('부추', 'garlic chives', '채소', '단', '냉장', 7, 0, '["chives","garlic chives"]'),
('당면', 'glass noodles', '건면', 'g', '실온', 365, 0, '["잡채면","glass noodles"]'),
('오징어', 'squid', '냉동식품', '마리', '냉동', 60, 0, '["냉동오징어","squid"]'),
('가지', 'eggplant', '채소', '개', '냉장', 7, 0, '["eggplant"]');

-- 6) 확장 재료 (기본양념/기본재료) - 수량 관리 없이 보유 여부만 관리
INSERT OR IGNORE INTO ingredient_master (name_ko, name_en, category, default_unit, storage_type, default_shelf_life_days, is_basic_seasoning, aliases) VALUES
('밀가루', 'flour', '기본재료', '-', '실온', NULL, 1, '["flour","부침가루"]'),
('빵가루', 'breadcrumbs', '기본재료', '-', '실온', NULL, 1, '["breadcrumb","panko"]'),
('카레가루', 'curry powder', '기본재료', '-', '실온', NULL, 1, '["curry powder","카레"]'),
('마요네즈', 'mayonnaise', '기본재료', '-', '냉장', NULL, 1, '["mayo","mayonnaise"]'),
('케찹', 'ketchup', '기본재료', '-', '냉장', NULL, 1, '["ketchup"]');

-- 7) 확장 레시피 - 한국 가정식 위주 50개 추가
-- ON CONFLICT(title) DO UPDATE: 3)과 동일한 이유로, 재시드 시 값이 갱신되게 한다.
INSERT INTO recipe
  (title, description, servings, cook_time_minutes, difficulty, kid_friendly, spicy_level, cuisine_type, cooking_method, is_diet, is_baby_food)
VALUES
('소고기무국', '소고기와 무를 넣고 맑게 끓인 국', 4, 20, '쉬움', 1, 0, '한식', '국물', 1, 1),
('콩나물국', '콩나물을 아삭하게 끓인 맑은 국', 4, 15, '쉬움', 1, 0, '한식', '국물', 1, 1),
('시금치나물', '데친 시금치를 조물조물 무친 밑반찬', 2, 10, '쉬움', 1, 0, '한식', '무침', 1, 1),
('어묵볶음', '어묵과 양파를 간장 양념에 볶은 밑반찬', 3, 15, '쉬움', 1, 0, '한식', '볶음', 0, 0),
('콩나물무침', '콩나물을 매콤하게 무친 밑반찬', 3, 10, '쉬움', 0, 1, '한식', '무침', 1, 0),
('감자조림', '감자를 간장에 졸인 밑반찬', 3, 20, '쉬움', 1, 0, '한식', '조림', 0, 1),
('어묵국', '어묵과 무로 시원하게 끓인 국', 4, 15, '쉬움', 1, 0, '한식', '국물', 1, 0),
('된장찌개', '두부와 애호박을 넣은 구수한 된장찌개', 3, 20, '보통', 0, 1, '한식', '국물', 1, 0),
('계란말이', '당근을 넣고 돌돌 말아 부친 계란말이', 2, 15, '쉬움', 1, 0, '한식', '부침', 0, 1),
('미역국', '소고기와 미역을 넣고 끓인 생일상 단골 국', 4, 25, '보통', 1, 0, '한식', '국물', 1, 1),
('닭볶음탕', '매콤한 양념에 닭과 감자를 조린 요리', 4, 35, '보통', 0, 2, '한식', '조림', 0, 0),
('오이무침', '새콤달콤하게 무친 오이 반찬', 2, 10, '쉬움', 1, 1, '한식', '무침', 1, 0),
('무생채', '무를 채썰어 새콤하게 무친 반찬', 3, 15, '쉬움', 0, 1, '한식', '무침', 1, 0),
('배추전', '배추잎에 밀가루 옷을 입혀 부친 전', 2, 15, '쉬움', 1, 0, '한식', '부침', 0, 1),
('깻잎전', '깻잎에 계란옷을 입혀 부친 향긋한 전', 2, 15, '보통', 1, 0, '한식', '부침', 0, 0),
('애호박볶음', '애호박을 부드럽게 볶은 밑반찬', 2, 12, '쉬움', 1, 0, '한식', '볶음', 1, 1),
('소불고기', '소고기를 달큰한 간장 양념에 볶은 불고기', 4, 20, '보통', 1, 0, '한식', '볶음', 0, 0),
('닭갈비', '매콤한 고추장 양념에 볶은 닭갈비', 3, 30, '보통', 0, 2, '한식', '볶음', 0, 0),
('두부조림', '두부를 매콤 짭짤하게 졸인 밑반찬', 2, 20, '쉬움', 1, 1, '한식', '조림', 1, 1),
('감자채볶음', '감자를 채썰어 아삭하게 볶은 밑반찬', 2, 15, '쉬움', 1, 0, '한식', '볶음', 1, 1),
('애호박된장국', '애호박을 넣어 구수하게 끓인 된장국', 3, 15, '쉬움', 0, 0, '한식', '국물', 1, 0),
('시금치된장국', '시금치를 넣어 끓인 구수한 된장국', 3, 15, '쉬움', 0, 0, '한식', '국물', 1, 0),
('부추전', '부추를 넣어 바삭하게 부친 전', 2, 15, '쉬움', 1, 0, '한식', '부침', 0, 0),
('콩나물볶음', '콩나물을 참기름에 볶은 고소한 반찬', 2, 12, '쉬움', 1, 0, '한식', '볶음', 1, 1),
('새우튀김', '새우에 튀김옷을 입혀 바삭하게 튀긴 요리', 2, 20, '보통', 1, 0, '한식', '튀김', 0, 0),
('계란덮밥', '계란을 간장 소스에 부드럽게 익힌 덮밥', 1, 10, '쉬움', 1, 0, '일식', '볶음', 0, 1),
('소세지야채볶음', '소세지와 채소를 케찹 소스에 볶은 반찬', 2, 15, '쉬움', 1, 0, '한식', '볶음', 0, 0),
('스크램블에그', '부드럽게 익힌 계란 스크램블', 1, 8, '쉬움', 1, 0, '양식', '볶음', 0, 1),
('프렌치토스트', '식빵을 계란물에 적셔 구운 브런치 메뉴', 2, 12, '쉬움', 1, 0, '양식', '부침', 0, 0),
('오야코동', '닭고기와 계란을 간장 소스로 익힌 덮밥', 2, 20, '보통', 1, 0, '일식', '볶음', 0, 0),
('우동볶음', '우동면과 어묵을 간장에 볶은 요리', 2, 15, '쉬움', 1, 0, '일식', '볶음', 0, 0),
('소면비빔국수', '삶은 소면을 매콤새콤하게 비빈 국수', 2, 15, '쉬움', 1, 2, '한식', '무침', 0, 0),
('잔치국수', '멸치육수 대신 간장으로 낸 국물국수', 2, 20, '쉬움', 1, 0, '한식', '국물', 0, 0),
('감자샐러드', '삶은 감자를 마요네즈로 버무린 샐러드', 3, 20, '보통', 1, 0, '양식', '무침', 0, 1),
('계란치즈토스트', '식빵에 계란과 치즈를 올려 구운 토스트', 1, 10, '쉬움', 1, 0, '양식', '구이', 0, 0),
('베이컨계란볶음밥', '베이컨과 계란을 넣어 볶은 볶음밥', 2, 15, '쉬움', 1, 0, '양식', '볶음', 0, 0),
('카레라이스', '감자와 당근을 넣고 끓인 카레', 4, 30, '쉬움', 1, 0, '일식', '조림', 0, 0),
('돈가스', '돼지고기에 튀김옷을 입혀 바삭하게 튀긴 돈가스', 2, 25, '보통', 1, 0, '일식', '튀김', 0, 0),
('오므라이스', '계란지단으로 볶음밥을 감싼 오므라이스', 2, 20, '쉬움', 1, 0, '양식', '볶음', 0, 0),
('잡채', '당면과 채소, 소고기를 볶아 무친 명절 단골 요리', 4, 30, '보통', 1, 0, '한식', '볶음', 0, 0),
('두부김치', '볶은 김치와 삶은 두부를 함께 먹는 요리', 3, 20, '보통', 0, 1, '한식', '볶음', 0, 0),
('오징어볶음', '오징어를 매콤한 양념에 볶은 요리', 3, 20, '보통', 0, 2, '한식', '볶음', 0, 0),
('순두부찌개', '두부와 김치, 돼지고기로 얼큰하게 끓인 찌개', 3, 20, '보통', 0, 2, '한식', '국물', 0, 0),
('멸치볶음', '멸치를 간장에 달달 볶은 밑반찬', 4, 10, '쉬움', 1, 0, '한식', '볶음', 1, 0),
('콩나물밥', '콩나물을 얹어 지은 밥에 양념장을 곁들인 요리', 3, 30, '쉬움', 1, 0, '한식', '찜', 1, 1),
('배추된장국', '배추를 넣어 구수하게 끓인 된장국', 3, 15, '쉬움', 0, 0, '한식', '국물', 1, 0),
('무나물', '무를 나물처럼 볶아 익힌 밑반찬', 3, 15, '쉬움', 1, 0, '한식', '무침', 1, 1),
('느타리버섯볶음', '느타리버섯을 참기름에 볶은 밑반찬', 2, 12, '쉬움', 1, 0, '한식', '볶음', 1, 1),
('계란국', '계란을 풀어 끓인 담백한 국', 3, 10, '쉬움', 1, 0, '한식', '국물', 1, 1),
('가지볶음', '가지를 간장 양념에 부드럽게 볶은 밑반찬', 2, 15, '쉬움', 1, 0, '한식', '볶음', 1, 0)
ON CONFLICT(title) DO UPDATE SET
  description = excluded.description,
  servings = excluded.servings,
  cook_time_minutes = excluded.cook_time_minutes,
  difficulty = excluded.difficulty,
  kid_friendly = excluded.kid_friendly,
  spicy_level = excluded.spicy_level,
  cuisine_type = excluded.cuisine_type,
  cooking_method = excluded.cooking_method,
  is_diet = excluded.is_diet,
  is_baby_food = excluded.is_baby_food;

-- 8) 확장 레시피 재료
INSERT OR IGNORE INTO recipe_ingredient (recipe_id, ingredient_id, quantity_text, required)
SELECT r.id, i.id, x.quantity_text, x.required
FROM (
  SELECT '소고기무국' AS recipe_title, '소고기' AS ingredient_name, '150g' AS quantity_text, 1 AS required
  UNION ALL SELECT '소고기무국', '무', '1/4개', 1
  UNION ALL SELECT '소고기무국', '대파', '1/3대', 1
  UNION ALL SELECT '소고기무국', '다진마늘', '1t', 1
  UNION ALL SELECT '소고기무국', '참기름', '1t', 1
  UNION ALL SELECT '소고기무국', '소금', '약간', 1
  UNION ALL SELECT '소고기무국', '간장', '1T', 1
  UNION ALL SELECT '콩나물국', '콩나물', '1봉', 1
  UNION ALL SELECT '콩나물국', '대파', '1/3대', 1
  UNION ALL SELECT '콩나물국', '다진마늘', '1t', 1
  UNION ALL SELECT '콩나물국', '소금', '약간', 1
  UNION ALL SELECT '시금치나물', '시금치', '1단', 1
  UNION ALL SELECT '시금치나물', '다진마늘', '1t', 1
  UNION ALL SELECT '시금치나물', '참기름', '1T', 1
  UNION ALL SELECT '시금치나물', '소금', '약간', 1
  UNION ALL SELECT '어묵볶음', '어묵', '200g', 1
  UNION ALL SELECT '어묵볶음', '양파', '1/2개', 1
  UNION ALL SELECT '어묵볶음', '대파', '1/4대', 0
  UNION ALL SELECT '어묵볶음', '간장', '1T', 1
  UNION ALL SELECT '어묵볶음', '설탕', '1t', 1
  UNION ALL SELECT '어묵볶음', '식용유', '1T', 1
  UNION ALL SELECT '콩나물무침', '콩나물', '1봉', 1
  UNION ALL SELECT '콩나물무침', '다진마늘', '1t', 1
  UNION ALL SELECT '콩나물무침', '참기름', '1T', 1
  UNION ALL SELECT '콩나물무침', '소금', '약간', 1
  UNION ALL SELECT '콩나물무침', '고춧가루', '1t', 0
  UNION ALL SELECT '감자조림', '감자', '3개', 1
  UNION ALL SELECT '감자조림', '간장', '2T', 1
  UNION ALL SELECT '감자조림', '설탕', '1T', 1
  UNION ALL SELECT '감자조림', '식용유', '1T', 1
  UNION ALL SELECT '감자조림', '다진마늘', '1t', 1
  UNION ALL SELECT '어묵국', '어묵', '200g', 1
  UNION ALL SELECT '어묵국', '무', '1/4개', 1
  UNION ALL SELECT '어묵국', '대파', '1/3대', 1
  UNION ALL SELECT '어묵국', '다진마늘', '1t', 0
  UNION ALL SELECT '어묵국', '소금', '약간', 1
  UNION ALL SELECT '된장찌개', '된장', '2T', 1
  UNION ALL SELECT '된장찌개', '두부', '1/2모', 1
  UNION ALL SELECT '된장찌개', '애호박', '1/2개', 1
  UNION ALL SELECT '된장찌개', '양파', '1/4개', 1
  UNION ALL SELECT '된장찌개', '감자', '1/2개', 0
  UNION ALL SELECT '된장찌개', '다진마늘', '1t', 1
  UNION ALL SELECT '계란말이', '계란', '4개', 1
  UNION ALL SELECT '계란말이', '당근', '1/4개', 1
  UNION ALL SELECT '계란말이', '대파', '1/4대', 0
  UNION ALL SELECT '계란말이', '소금', '약간', 1
  UNION ALL SELECT '계란말이', '식용유', '1T', 1
  UNION ALL SELECT '미역국', '미역', '20g', 1
  UNION ALL SELECT '미역국', '소고기', '100g', 1
  UNION ALL SELECT '미역국', '다진마늘', '1t', 1
  UNION ALL SELECT '미역국', '참기름', '1T', 1
  UNION ALL SELECT '미역국', '간장', '1T', 1
  UNION ALL SELECT '닭볶음탕', '닭고기', '600g', 1
  UNION ALL SELECT '닭볶음탕', '감자', '2개', 1
  UNION ALL SELECT '닭볶음탕', '당근', '1/2개', 1
  UNION ALL SELECT '닭볶음탕', '양파', '1개', 1
  UNION ALL SELECT '닭볶음탕', '고추장', '2T', 1
  UNION ALL SELECT '닭볶음탕', '고춧가루', '1T', 1
  UNION ALL SELECT '닭볶음탕', '간장', '1T', 1
  UNION ALL SELECT '닭볶음탕', '설탕', '1T', 1
  UNION ALL SELECT '닭볶음탕', '다진마늘', '1T', 1
  UNION ALL SELECT '오이무침', '오이', '2개', 1
  UNION ALL SELECT '오이무침', '고춧가루', '1t', 1
  UNION ALL SELECT '오이무침', '식초', '1T', 1
  UNION ALL SELECT '오이무침', '설탕', '1t', 1
  UNION ALL SELECT '오이무침', '다진마늘', '1t', 0
  UNION ALL SELECT '오이무침', '소금', '약간', 1
  UNION ALL SELECT '무생채', '무', '1/2개', 1
  UNION ALL SELECT '무생채', '고춧가루', '1T', 1
  UNION ALL SELECT '무생채', '식초', '1T', 1
  UNION ALL SELECT '무생채', '설탕', '1T', 1
  UNION ALL SELECT '무생채', '다진마늘', '1t', 1
  UNION ALL SELECT '무생채', '소금', '약간', 1
  UNION ALL SELECT '배추전', '배추', '4장', 1
  UNION ALL SELECT '배추전', '밀가루', '1/2컵', 1
  UNION ALL SELECT '배추전', '소금', '약간', 1
  UNION ALL SELECT '배추전', '식용유', '1T', 1
  UNION ALL SELECT '깻잎전', '깻잎', '10장', 1
  UNION ALL SELECT '깻잎전', '밀가루', '3T', 1
  UNION ALL SELECT '깻잎전', '계란', '1개', 1
  UNION ALL SELECT '깻잎전', '식용유', '1T', 1
  UNION ALL SELECT '애호박볶음', '애호박', '1개', 1
  UNION ALL SELECT '애호박볶음', '양파', '1/4개', 0
  UNION ALL SELECT '애호박볶음', '다진마늘', '1t', 1
  UNION ALL SELECT '애호박볶음', '소금', '약간', 1
  UNION ALL SELECT '애호박볶음', '식용유', '1T', 1
  UNION ALL SELECT '소불고기', '소고기', '400g', 1
  UNION ALL SELECT '소불고기', '양파', '1개', 1
  UNION ALL SELECT '소불고기', '대파', '1/2대', 1
  UNION ALL SELECT '소불고기', '당근', '1/4개', 0
  UNION ALL SELECT '소불고기', '간장', '3T', 1
  UNION ALL SELECT '소불고기', '설탕', '1T', 1
  UNION ALL SELECT '소불고기', '다진마늘', '1T', 1
  UNION ALL SELECT '소불고기', '참기름', '1T', 1
  UNION ALL SELECT '닭갈비', '닭고기', '500g', 1
  UNION ALL SELECT '닭갈비', '양배추', '1/4통', 1
  UNION ALL SELECT '닭갈비', '양파', '1개', 1
  UNION ALL SELECT '닭갈비', '대파', '1/2대', 0
  UNION ALL SELECT '닭갈비', '고추장', '2T', 1
  UNION ALL SELECT '닭갈비', '고춧가루', '1T', 1
  UNION ALL SELECT '닭갈비', '간장', '1T', 1
  UNION ALL SELECT '닭갈비', '설탕', '1T', 1
  UNION ALL SELECT '닭갈비', '다진마늘', '1T', 1
  UNION ALL SELECT '두부조림', '두부', '1모', 1
  UNION ALL SELECT '두부조림', '간장', '2T', 1
  UNION ALL SELECT '두부조림', '설탕', '1t', 1
  UNION ALL SELECT '두부조림', '다진마늘', '1t', 1
  UNION ALL SELECT '두부조림', '고춧가루', '1t', 0
  UNION ALL SELECT '두부조림', '식용유', '1T', 1
  UNION ALL SELECT '감자채볶음', '감자', '2개', 1
  UNION ALL SELECT '감자채볶음', '당근', '1/4개', 0
  UNION ALL SELECT '감자채볶음', '양파', '1/4개', 0
  UNION ALL SELECT '감자채볶음', '소금', '약간', 1
  UNION ALL SELECT '감자채볶음', '식용유', '1T', 1
  UNION ALL SELECT '애호박된장국', '애호박', '1/2개', 1
  UNION ALL SELECT '애호박된장국', '된장', '1.5T', 1
  UNION ALL SELECT '애호박된장국', '두부', '1/4모', 0
  UNION ALL SELECT '애호박된장국', '다진마늘', '1t', 1
  UNION ALL SELECT '애호박된장국', '대파', '1/4대', 0
  UNION ALL SELECT '시금치된장국', '시금치', '1/2단', 1
  UNION ALL SELECT '시금치된장국', '된장', '1.5T', 1
  UNION ALL SELECT '시금치된장국', '다진마늘', '1t', 1
  UNION ALL SELECT '시금치된장국', '대파', '1/4대', 0
  UNION ALL SELECT '부추전', '부추', '1단', 1
  UNION ALL SELECT '부추전', '밀가루', '1컵', 1
  UNION ALL SELECT '부추전', '계란', '1개', 0
  UNION ALL SELECT '부추전', '식용유', '1T', 1
  UNION ALL SELECT '콩나물볶음', '콩나물', '1봉', 1
  UNION ALL SELECT '콩나물볶음', '대파', '1/4대', 0
  UNION ALL SELECT '콩나물볶음', '다진마늘', '1t', 1
  UNION ALL SELECT '콩나물볶음', '참기름', '1t', 1
  UNION ALL SELECT '콩나물볶음', '소금', '약간', 1
  UNION ALL SELECT '새우튀김', '새우', '200g', 1
  UNION ALL SELECT '새우튀김', '밀가루', '1/2컵', 1
  UNION ALL SELECT '새우튀김', '빵가루', '1컵', 1
  UNION ALL SELECT '새우튀김', '계란', '1개', 1
  UNION ALL SELECT '새우튀김', '식용유', '넉넉히', 1
  UNION ALL SELECT '계란덮밥', '계란', '2개', 1
  UNION ALL SELECT '계란덮밥', '대파', '1/4대', 0
  UNION ALL SELECT '계란덮밥', '간장', '1T', 1
  UNION ALL SELECT '계란덮밥', '참기름', '1t', 1
  UNION ALL SELECT '계란덮밥', '식용유', '1t', 1
  UNION ALL SELECT '소세지야채볶음', '소세지', '200g', 1
  UNION ALL SELECT '소세지야채볶음', '양파', '1/2개', 1
  UNION ALL SELECT '소세지야채볶음', '당근', '1/4개', 1
  UNION ALL SELECT '소세지야채볶음', '케찹', '2T', 1
  UNION ALL SELECT '소세지야채볶음', '식용유', '1T', 1
  UNION ALL SELECT '스크램블에그', '계란', '3개', 1
  UNION ALL SELECT '스크램블에그', '우유', '2T', 1
  UNION ALL SELECT '스크램블에그', '소금', '약간', 1
  UNION ALL SELECT '스크램블에그', '식용유', '1t', 1
  UNION ALL SELECT '프렌치토스트', '식빵', '4장', 1
  UNION ALL SELECT '프렌치토스트', '계란', '2개', 1
  UNION ALL SELECT '프렌치토스트', '우유', '3T', 1
  UNION ALL SELECT '프렌치토스트', '설탕', '1T', 1
  UNION ALL SELECT '프렌치토스트', '식용유', '1T', 1
  UNION ALL SELECT '오야코동', '닭고기', '300g', 1
  UNION ALL SELECT '오야코동', '양파', '1/2개', 1
  UNION ALL SELECT '오야코동', '계란', '2개', 1
  UNION ALL SELECT '오야코동', '대파', '1/4대', 0
  UNION ALL SELECT '오야코동', '간장', '2T', 1
  UNION ALL SELECT '오야코동', '설탕', '1T', 1
  UNION ALL SELECT '우동볶음', '우동면', '1봉', 1
  UNION ALL SELECT '우동볶음', '어묵', '100g', 1
  UNION ALL SELECT '우동볶음', '양배추', '1/8통', 1
  UNION ALL SELECT '우동볶음', '당근', '1/4개', 0
  UNION ALL SELECT '우동볶음', '간장', '1T', 1
  UNION ALL SELECT '우동볶음', '식용유', '1T', 1
  UNION ALL SELECT '소면비빔국수', '소면', '200g', 1
  UNION ALL SELECT '소면비빔국수', '오이', '1/2개', 1
  UNION ALL SELECT '소면비빔국수', '고추장', '1T', 1
  UNION ALL SELECT '소면비빔국수', '식초', '1T', 1
  UNION ALL SELECT '소면비빔국수', '설탕', '1T', 1
  UNION ALL SELECT '소면비빔국수', '다진마늘', '1t', 0
  UNION ALL SELECT '소면비빔국수', '참기름', '1t', 1
  UNION ALL SELECT '잔치국수', '소면', '200g', 1
  UNION ALL SELECT '잔치국수', '애호박', '1/4개', 1
  UNION ALL SELECT '잔치국수', '대파', '1/4대', 0
  UNION ALL SELECT '잔치국수', '간장', '1T', 1
  UNION ALL SELECT '잔치국수', '다진마늘', '1t', 0
  UNION ALL SELECT '감자샐러드', '감자', '3개', 1
  UNION ALL SELECT '감자샐러드', '계란', '2개', 1
  UNION ALL SELECT '감자샐러드', '당근', '1/4개', 0
  UNION ALL SELECT '감자샐러드', '마요네즈', '3T', 1
  UNION ALL SELECT '감자샐러드', '소금', '약간', 1
  UNION ALL SELECT '계란치즈토스트', '식빵', '2장', 1
  UNION ALL SELECT '계란치즈토스트', '계란', '1개', 1
  UNION ALL SELECT '계란치즈토스트', '치즈', '1장', 1
  UNION ALL SELECT '계란치즈토스트', '식용유', '1t', 1
  UNION ALL SELECT '베이컨계란볶음밥', '베이컨', '100g', 1
  UNION ALL SELECT '베이컨계란볶음밥', '계란', '2개', 1
  UNION ALL SELECT '베이컨계란볶음밥', '양파', '1/4개', 0
  UNION ALL SELECT '베이컨계란볶음밥', '대파', '1/4대', 0
  UNION ALL SELECT '베이컨계란볶음밥', '식용유', '1T', 1
  UNION ALL SELECT '베이컨계란볶음밥', '소금', '약간', 1
  UNION ALL SELECT '카레라이스', '감자', '2개', 1
  UNION ALL SELECT '카레라이스', '당근', '1개', 1
  UNION ALL SELECT '카레라이스', '양파', '1개', 1
  UNION ALL SELECT '카레라이스', '돼지고기', '200g', 0
  UNION ALL SELECT '카레라이스', '카레가루', '1/2박스', 1
  UNION ALL SELECT '카레라이스', '식용유', '1T', 1
  UNION ALL SELECT '돈가스', '돼지고기', '300g', 1
  UNION ALL SELECT '돈가스', '밀가루', '1/2컵', 1
  UNION ALL SELECT '돈가스', '빵가루', '1컵', 1
  UNION ALL SELECT '돈가스', '계란', '1개', 1
  UNION ALL SELECT '돈가스', '식용유', '넉넉히', 1
  UNION ALL SELECT '돈가스', '소금', '약간', 1
  UNION ALL SELECT '오므라이스', '계란', '3개', 1
  UNION ALL SELECT '오므라이스', '햄', '1/2팩', 1
  UNION ALL SELECT '오므라이스', '양파', '1/4개', 1
  UNION ALL SELECT '오므라이스', '당근', '1/4개', 0
  UNION ALL SELECT '오므라이스', '케찹', '3T', 1
  UNION ALL SELECT '오므라이스', '식용유', '1T', 1
  UNION ALL SELECT '잡채', '당면', '200g', 1
  UNION ALL SELECT '잡채', '소고기', '100g', 0
  UNION ALL SELECT '잡채', '양파', '1/2개', 1
  UNION ALL SELECT '잡채', '당근', '1/4개', 1
  UNION ALL SELECT '잡채', '시금치', '1/2단', 0
  UNION ALL SELECT '잡채', '대파', '1/4대', 0
  UNION ALL SELECT '잡채', '간장', '3T', 1
  UNION ALL SELECT '잡채', '설탕', '1T', 1
  UNION ALL SELECT '잡채', '참기름', '1T', 1
  UNION ALL SELECT '두부김치', '두부', '1모', 1
  UNION ALL SELECT '두부김치', '김치', '300g', 1
  UNION ALL SELECT '두부김치', '돼지고기', '100g', 0
  UNION ALL SELECT '두부김치', '식용유', '1T', 1
  UNION ALL SELECT '두부김치', '참기름', '1t', 1
  UNION ALL SELECT '오징어볶음', '오징어', '1마리', 1
  UNION ALL SELECT '오징어볶음', '양파', '1/2개', 1
  UNION ALL SELECT '오징어볶음', '당근', '1/4개', 0
  UNION ALL SELECT '오징어볶음', '대파', '1/4대', 0
  UNION ALL SELECT '오징어볶음', '고추장', '1T', 1
  UNION ALL SELECT '오징어볶음', '고춧가루', '1T', 1
  UNION ALL SELECT '오징어볶음', '간장', '1T', 1
  UNION ALL SELECT '오징어볶음', '설탕', '1t', 1
  UNION ALL SELECT '오징어볶음', '다진마늘', '1t', 1
  UNION ALL SELECT '오징어볶음', '식용유', '1T', 1
  UNION ALL SELECT '순두부찌개', '두부', '1모', 1
  UNION ALL SELECT '순두부찌개', '돼지고기', '100g', 0
  UNION ALL SELECT '순두부찌개', '김치', '100g', 0
  UNION ALL SELECT '순두부찌개', '고춧가루', '1T', 1
  UNION ALL SELECT '순두부찌개', '다진마늘', '1t', 1
  UNION ALL SELECT '순두부찌개', '계란', '1개', 0
  UNION ALL SELECT '순두부찌개', '참기름', '1t', 1
  UNION ALL SELECT '멸치볶음', '멸치', '100g', 1
  UNION ALL SELECT '멸치볶음', '식용유', '1T', 1
  UNION ALL SELECT '멸치볶음', '설탕', '1T', 1
  UNION ALL SELECT '멸치볶음', '간장', '1T', 1
  UNION ALL SELECT '멸치볶음', '다진마늘', '1t', 0
  UNION ALL SELECT '콩나물밥', '콩나물', '1봉', 1
  UNION ALL SELECT '콩나물밥', '간장', '2T', 1
  UNION ALL SELECT '콩나물밥', '참기름', '1t', 1
  UNION ALL SELECT '콩나물밥', '대파', '1/4대', 0
  UNION ALL SELECT '배추된장국', '배추', '3장', 1
  UNION ALL SELECT '배추된장국', '된장', '1.5T', 1
  UNION ALL SELECT '배추된장국', '다진마늘', '1t', 1
  UNION ALL SELECT '배추된장국', '대파', '1/4대', 0
  UNION ALL SELECT '무나물', '무', '1/2개', 1
  UNION ALL SELECT '무나물', '다진마늘', '1t', 1
  UNION ALL SELECT '무나물', '참기름', '1T', 1
  UNION ALL SELECT '무나물', '소금', '약간', 1
  UNION ALL SELECT '무나물', '식용유', '1t', 0
  UNION ALL SELECT '느타리버섯볶음', '느타리버섯', '1봉', 1
  UNION ALL SELECT '느타리버섯볶음', '대파', '1/4대', 0
  UNION ALL SELECT '느타리버섯볶음', '다진마늘', '1t', 1
  UNION ALL SELECT '느타리버섯볶음', '참기름', '1t', 1
  UNION ALL SELECT '느타리버섯볶음', '소금', '약간', 1
  UNION ALL SELECT '계란국', '계란', '2개', 1
  UNION ALL SELECT '계란국', '대파', '1/4대', 1
  UNION ALL SELECT '계란국', '다진마늘', '1t', 0
  UNION ALL SELECT '계란국', '소금', '약간', 1
  UNION ALL SELECT '가지볶음', '가지', '2개', 1
  UNION ALL SELECT '가지볶음', '양파', '1/4개', 0
  UNION ALL SELECT '가지볶음', '다진마늘', '1t', 1
  UNION ALL SELECT '가지볶음', '간장', '1T', 1
  UNION ALL SELECT '가지볶음', '식용유', '1T', 1
) AS x
JOIN recipe r ON r.title = x.recipe_title
JOIN ingredient_master i ON i.name_ko = x.ingredient_name;
