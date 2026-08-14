import { getDb } from "./db";

export interface IngredientRow {
  id: number;
  name_ko: string;
  name_en: string | null;
  category: string;
  default_unit: string;
  storage_type: string;
  default_shelf_life_days: number | null;
  is_basic_seasoning: number;
  aliases: string;
}

/**
 * Vision AI가 반환한 재료명을 ingredient_master와 매칭한다.
 * 정확히 일치하거나 aliases에 포함되면 기존 재료로 취급하고,
 * 없으면 새 재료를 '기타' 카테고리로 등록한다 (AI가 아는 재료명이 DB에 아직 없을 수 있으므로).
 */
export function normalizeIngredientName(
  rawName: string,
  fallbackUnit = "개"
): IngredientRow {
  const db = getDb();
  const trimmed = rawName.trim();

  const rows = db.prepare("SELECT * FROM ingredient_master").all() as IngredientRow[];

  const exact = rows.find((r) => r.name_ko === trimmed);
  if (exact) return exact;

  const lower = trimmed.toLowerCase();
  const aliasMatch = rows.find((r) => {
    const aliases: string[] = JSON.parse(r.aliases || "[]");
    return aliases.some((a) => a.toLowerCase() === lower);
  });
  if (aliasMatch) return aliasMatch;

  const insert = db
    .prepare(
      `INSERT INTO ingredient_master
        (name_ko, name_en, category, default_unit, storage_type, default_shelf_life_days, is_basic_seasoning, aliases)
       VALUES (?, NULL, '기타', ?, '냉장', NULL, 0, '[]')`
    )
    .run(trimmed, fallbackUnit);

  return db
    .prepare("SELECT * FROM ingredient_master WHERE id = ?")
    .get(insert.lastInsertRowid) as IngredientRow;
}
