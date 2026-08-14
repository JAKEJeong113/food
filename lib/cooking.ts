import { getDb } from "./db";
import { parseLeadingQuantity } from "./quantityParsing";

export interface DeductionItem {
  ingredientId: number;
  name: string;
  unit: string;
  currentQuantity: number;
  afterQuantity: number;
  deducted: number;
}

interface RecipeIngredientRow {
  ingredient_id: number;
  quantity_text: string;
  name_ko: string;
}

interface InventoryRow {
  quantity: number;
  unit: string;
}

/**
 * 이 레시피를 만들었을 때 재고에서 얼마나 줄어들지 계산한다. 기본양념은
 * 애초에 재고로 관리하지 않으므로 제외되고, 지금 집에 없는 재료(재고 행이
 * 없음)는 차감할 게 없으니 건너뛴다.
 */
export function computeDeductionPreview(
  householdId: number,
  recipeId: number
): DeductionItem[] {
  const db = getDb();

  const recipeIngredients = db
    .prepare(
      `SELECT ri.ingredient_id, ri.quantity_text, im.name_ko
       FROM recipe_ingredient ri
       JOIN ingredient_master im ON im.id = ri.ingredient_id
       WHERE ri.recipe_id = ? AND im.is_basic_seasoning = 0`
    )
    .all(recipeId) as RecipeIngredientRow[];

  const findInventory = db.prepare(
    "SELECT quantity, unit FROM inventory WHERE household_id = ? AND ingredient_id = ?"
  );

  const items: DeductionItem[] = [];

  for (const ri of recipeIngredients) {
    const inv = findInventory.get(householdId, ri.ingredient_id) as
      | InventoryRow
      | undefined;
    if (!inv) continue;

    const amount = parseLeadingQuantity(ri.quantity_text);
    if (amount === null) continue;

    const after = Math.max(0, Math.round((inv.quantity - amount) * 100) / 100);

    items.push({
      ingredientId: ri.ingredient_id,
      name: ri.name_ko,
      unit: inv.unit,
      currentQuantity: inv.quantity,
      afterQuantity: after,
      deducted: Math.round((inv.quantity - after) * 100) / 100,
    });
  }

  return items;
}

/** 미리보기와 같은 계산을 실제로 재고에 반영하고, 조리 이력을 한 줄 남긴다. */
export function applyDeduction(householdId: number, recipeId: number): DeductionItem[] {
  const db = getDb();
  const items = computeDeductionPreview(householdId, recipeId);

  const update = db.prepare(
    `UPDATE inventory SET quantity = ?, updated_at = datetime('now')
     WHERE household_id = ? AND ingredient_id = ?`
  );
  const insertHistory = db.prepare(
    "INSERT INTO cooking_history (household_id, recipe_id) VALUES (?, ?)"
  );

  const tx = db.transaction(() => {
    for (const item of items) {
      update.run(item.afterQuantity, householdId, item.ingredientId);
    }
    insertHistory.run(householdId, recipeId);
  });

  tx();

  return items;
}
