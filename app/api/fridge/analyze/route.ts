import { NextRequest, NextResponse } from "next/server";
import { analyzeFridgeImage } from "@/lib/vision";
import { normalizeIngredientName } from "@/lib/normalizer";
import { getRequestUser } from "@/lib/auth";

export const runtime = "nodejs";

// base64로 인코딩된 이미지 문자열 최대 길이. 원본 바이트 기준 약 8MB에 해당하는
// 여유치(base64는 원본의 약 4/3배)로, 냉장고 사진 한 장이면 충분히 넉넉하다.
// 인증 없이 비용이 드는 Vision AI 호출을 막는 것과 별개로, 과도하게 큰 요청이
// 서버 메모리를 잡아먹는 것 자체를 막기 위한 방어선이다.
const MAX_BASE64_LENGTH = 11_000_000;

export async function POST(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const body = await req.json();
  const { image, mediaType } = body as { image?: string; mediaType?: string };

  if (!image || !mediaType) {
    return NextResponse.json(
      { error: "image, mediaType 값이 필요합니다." },
      { status: 400 }
    );
  }

  if (image.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { error: "이미지 용량이 너무 커요. 더 작은 사진으로 다시 시도해주세요." },
      { status: 413 }
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
