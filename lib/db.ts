import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "naengpa.db");

declare global {
  // eslint-disable-next-line no-var
  var __naengpaDb: Database.Database | undefined;
}

// CREATE TABLE IF NOT EXISTS는 이미 존재하는 테이블에 새 컬럼을 추가해주지 않는다.
// 테이블에 컬럼을 추가할 때마다 여기 목록에도 추가해서, 이전에 생성된
// data/naengpa.db를 지우지 않고도 최신 스키마를 따라잡게 한다.
const COLUMN_MIGRATIONS: Record<string, [string, string][]> = {
  recipe: [
    ["cuisine_type", "TEXT NOT NULL DEFAULT '한식'"],
    ["cooking_method", "TEXT NOT NULL DEFAULT '볶음'"],
    ["is_diet", "INTEGER NOT NULL DEFAULT 0"],
    ["is_baby_food", "INTEGER NOT NULL DEFAULT 0"],
  ],
  inventory: [["household_id", "INTEGER REFERENCES household(id)"]],
};

function migrateColumns(db: Database.Database) {
  for (const [table, migrations] of Object.entries(COLUMN_MIGRATIONS)) {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    const existing = new Set(columns.map((c) => c.name));

    for (const [name, definition] of migrations) {
      if (!existing.has(name)) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
      }
    }
  }
}

function initialize(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(
    path.join(process.cwd(), "database", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);

  migrateColumns(db);

  // ingredient_master/recipe는 UNIQUE 인덱스 기반 INSERT OR IGNORE라 매번 실행해도
  // 안전하다. 이렇게 해야 이미 한 번 시드된 기존 DB에도 새로 추가된 재료/레시피가
  // (data/ 폴더를 지우지 않고) 다음 서버 시작 시 자동으로 반영된다.
  const seed = fs.readFileSync(
    path.join(process.cwd(), "database", "ingredients.sql"),
    "utf-8"
  );
  db.exec(seed);
}

export function getDb(): Database.Database {
  if (!global.__naengpaDb) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const db = new Database(DB_PATH);
    initialize(db);
    global.__naengpaDb = db;
  }
  return global.__naengpaDb;
}
