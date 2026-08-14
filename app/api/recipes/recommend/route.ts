import { NextRequest, NextResponse } from "next/server";
import { recommendRecipes } from "@/lib/scoring";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const maxTime = searchParams.get("maxTime");
  const kidFriendlyOnly = searchParams.get("kidFriendly") === "1";
  const noShopping = searchParams.get("noShopping") === "1";

  const recommendations = recommendRecipes({
    maxTime: maxTime ? Number(maxTime) : undefined,
    kidFriendlyOnly,
    noShopping,
  });

  return NextResponse.json({ recommendations });
}
