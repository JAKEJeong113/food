import { NextRequest, NextResponse } from "next/server";
import { analyzeFridgeImage } from "@/lib/vision";
import { normalizeIngredientName } from "@/lib/normalizer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { image, mediaType } = body as { image?: string; mediaType?: string };

  if (!image || !mediaType) {
    return NextResponse.json(
      { error: "image, mediaType 값이 필요합니다." },
      { status: 400 }
    );
  }

  const { items, usedMock } = await analyzeFridgeImage(image, mediaType);

  const normalized = items.map((item) => {
    const ingredient = normalizeIngredientName(item.name, item.unit);
    return {
      ingredientId: ingredient.id,
      name: ingredient.name_ko,
      quantity: item.quantity,
      unit: item.unit || ingredient.default_unit,
      confidence: item.confidence,
      storageType: ingredient.storage_type,
      defaultShelfLifeDays: ingredient.default_shelf_life_days,
    };
  });

  return NextResponse.json({ items: normalized, usedMock });
}
