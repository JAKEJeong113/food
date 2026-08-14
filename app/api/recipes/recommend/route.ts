import { NextRequest, NextResponse } from "next/server";
import { recommendRecipes } from "@/lib/scoring";
import { getRequestUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const maxTime = searchParams.get("maxTime");
  const kidFriendlyOnly = searchParams.get("kidFriendly") === "1";
  const noShopping = searchParams.get("noShopping") === "1";
  const cuisineType = searchParams.get("cuisine") || undefined;
  const cookingMethod = searchParams.get("cookingMethod") || undefined;
  const spicyOnly = searchParams.get("spicy") === "1";
  const dietOnly = searchParams.get("diet") === "1";
  const babyFoodOnly = searchParams.get("babyFood") === "1";

  const recommendations = recommendRecipes(user.householdId, {
    maxTime: maxTime ? Number(maxTime) : undefined,
    kidFriendlyOnly,
    noShopping,
    cuisineType,
    cookingMethod,
    spicyOnly,
    dietOnly,
    babyFoodOnly,
  });

  return NextResponse.json({ recommendations });
}
