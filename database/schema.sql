-- 냉파AI 프로토타입 스키마 (SQLite)

CREATE TABLE IF NOT EXISTS household (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  invite_code TEXT NOT NULL, -- 가족이 회원가입 시 같은 가구에 합류할 때 사용
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER NOT NULL REFERENCES household(id),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  privacy_agreed_at TEXT NOT NULL DEFAULT (datetime('now')), -- 개인정보처리방침 동의 시각
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS session (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

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
  household_id INTEGER REFERENCES household(id),
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
  spicy_level INTEGER NOT NULL DEFAULT 0, -- 0~3, 매운맛 필터에 사용
  cuisine_type TEXT NOT NULL DEFAULT '한식', -- 한식 | 중식 | 양식 | 일식
  cooking_method TEXT NOT NULL DEFAULT '볶음', -- 볶음 | 찜 | 구이 | 튀김 | 조림 | 국물 | 부침 | 무침
  is_diet INTEGER NOT NULL DEFAULT 0, -- 1이면 다이어트식(저칼로리/고단백 위주)
  is_baby_food INTEGER NOT NULL DEFAULT 0 -- 1이면 유아식(자극적이지 않고 부드러움)
);

CREATE TABLE IF NOT EXISTS recipe_ingredient (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL REFERENCES recipe(id),
  ingredient_id INTEGER NOT NULL REFERENCES ingredient_master(id),
  quantity_text TEXT NOT NULL, -- 표시용 (예: "300g", "1/2모")
  required INTEGER NOT NULL DEFAULT 1 -- 0이면 선택 재료
);

CREATE TABLE IF NOT EXISTS cooking_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  household_id INTEGER NOT NULL REFERENCES household(id),
  recipe_id INTEGER NOT NULL REFERENCES recipe(id),
  cooked_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_inventory_ingredient ON inventory(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_inventory_household ON inventory(household_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredient_recipe ON recipe_ingredient(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredient_ingredient ON recipe_ingredient(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_cooking_history_household ON cooking_history(household_id);

-- UNIQUE 인덱스로 별도 생성 (컬럼 인라인 UNIQUE와 달리 기존 테이블에도 나중에
-- 추가로 걸 수 있어, 이미 만들어진 data/naengpa.db에도 재적용 가능하다).
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipe_title ON recipe(title);
CREATE UNIQUE INDEX IF NOT EXISTS idx_recipe_ingredient_unique ON recipe_ingredient(recipe_id, ingredient_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_household_invite_code ON household(invite_code);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_email ON user(email);
CREATE INDEX IF NOT EXISTS idx_session_user ON session(user_id);
