-- 냉파AI 프로토타입 스키마 (SQLite)
-- MVP 단계에서는 단일 가구(단일 사용자)를 가정하고 households/users 테이블은 생략한다.

CREATE TABLE IF NOT EXISTS ingredient_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ko TEXT NOT NULL UNIQUE,
  name_en TEXT,
  category TEXT NOT NULL,          -- 예: 채소, 육류, 유제품/계란, 기본양념, 냉동
  default_unit TEXT NOT NULL,      -- 예: 개, g, 모, 단
  storage_type TEXT NOT NULL,      -- 냉장 | 냉동 | 실온
  default_shelf_life_days INTEGER, -- 기본양념은 NULL (소비기한 관리 안 함)
  is_basic_seasoning INTEGER NOT NULL DEFAULT 0, -- 1이면 재고 수량 대신 보유 여부만 관리
  aliases TEXT NOT NULL DEFAULT '[]' -- JSON 배열. Vision AI/사용자 입력 정규화에 사용
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ingredient_id INTEGER NOT NULL REFERENCES ingredient_master(id),
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  purchase_date TEXT,
  expiry_date TEXT,
  storage_location TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS recipe (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  servings INTEGER NOT NULL DEFAULT 2,
  cook_time_minutes INTEGER NOT NULL,
  difficulty TEXT NOT NULL DEFAULT '쉬움',
  kid_friendly INTEGER NOT NULL DEFAULT 0,
  spicy_level INTEGER NOT NULL DEFAULT 0 -- 0~3
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL REFERENCES recipe(id),
  ingredient_id INTEGER NOT NULL REFERENCES ingredient_master(id),
  quantity_text TEXT NOT NULL, -- 표시용 (예: "300g", "1/2모")
  required INTEGER NOT NULL DEFAULT 1 -- 0이면 선택 재료
);

CREATE INDEX IF NOT EXISTS idx_inventory_ingredient ON inventory(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredient_recipe ON recipe_ingredient(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredient_ingredient ON recipe_ingredient(ingredient_id);
