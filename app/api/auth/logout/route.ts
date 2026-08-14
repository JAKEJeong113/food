import { NextRequest, NextResponse } from "next/server";
import { destroySession, getTokenFromRequest, SESSION_COOKIE_NAME } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (token) {
    destroySession(token);
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
