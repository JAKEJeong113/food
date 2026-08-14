import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";
import { applyDeduction } from "@/lib/cooking";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { recipeId: string } }
) {
  const user = getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const recipeId = Number(params.recipeId);
  if (!Number.isInteger(recipeId)) {
    return NextResponse.json({ error: "잘못된 레시피 ID예요." }, { status: 400 });
  }

  const items = applyDeduction(user.householdId, recipeId);
  return NextResponse.json({ ok: true, items });
}
