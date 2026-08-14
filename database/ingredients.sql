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
INSERT OR IGNORE INTO recipe
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
('제육볶음', '고추장 양념에 매콤하게 볶는 돼지고기 요리', 3, 20, '보통', 0, 2, '한식', '볶음', 0, 0);

-- 4) 레시피 재료 (필수 재료 + 선택 재료 + 기본양념)
INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity_text, required)
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
