import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "naengpa.db");

declare global {
  // eslint-disable-next-line no-var
  var __naengpaDb: Database.Database | undefined;
}

function initialize(db: Database.Database) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(
    path.join(process.cwd(), "database", "schema.sql"),
    "utf-8"
  );
  db.exec(schema);

  const alreadySeeded = db
    .prepare("SELECT COUNT(*) AS count FROM ingredient_master")
    .get() as { count: number };

  if (alreadySeeded.count === 0) {
    const seed = fs.readFileSync(
      path.join(process.cwd(), "database", "ingredients.sql"),
      "utf-8"
    );
    db.exec(seed);
  }
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
