import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

interface InventoryItemInput {
  ingredientId: number;
  quantity: number;
  unit: string;
  defaultShelfLifeDays?: number | null;
}

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT inv.id, inv.quantity, inv.unit, inv.expiry_date, inv.storage_location,
              im.id AS ingredient_id, im.name_ko, im.category, im.storage_type, im.is_basic_seasoning
       FROM inventory inv
       JOIN ingredient_master im ON im.id = inv.ingredient_id
       ORDER BY inv.expiry_date IS NULL, inv.expiry_date ASC`
    )
    .all();

  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items } = body as { items: InventoryItemInput[] };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items 배열이 필요합니다." }, { status: 400 });
  }

  const db = getDb();
  const today = new Date();

  const findExisting = db.prepare(
    "SELECT id FROM inventory WHERE ingredient_id = ?"
  );
  const insert = db.prepare(
    `INSERT INTO inventory (ingredient_id, quantity, unit, purchase_date, expiry_date, storage_location)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const update = db.prepare(
    `UPDATE inventory SET quantity = ?, unit = ?, expiry_date = ?, updated_at = datetime('now')
     WHERE id = ?`
  );

  const tx = db.transaction((rows: InventoryItemInput[]) => {
    for (const row of rows) {
      const purchaseDate = today.toISOString().slice(0, 10);
      let expiryDate: string | null = null;
      if (row.defaultShelfLifeDays) {
        const expiry = new Date(today);
        expiry.setDate(expiry.getDate() + row.defaultShelfLifeDays);
        expiryDate = expiry.toISOString().slice(0, 10);
      }

      const existing = findExisting.get(row.ingredientId) as { id: number } | undefined;
      if (existing) {
        update.run(row.quantity, row.unit, expiryDate, existing.id);
      } else {
        insert.run(row.ingredientId, row.quantity, row.unit, purchaseDate, expiryDate, "냉장");
      }
    }
  });

  tx(items);

  return NextResponse.json({ ok: true });
}
