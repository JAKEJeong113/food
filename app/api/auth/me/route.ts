import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getRequestUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = getRequestUser(req);
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const db = getDb();
  const household = db
    .prepare("SELECT invite_code FROM household WHERE id = ?")
    .get(user.householdId) as { invite_code: string };

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      householdId: user.householdId,
      householdName: user.householdName,
      inviteCode: household.invite_code,
    },
  });
}
