import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  createSession,
  verifyPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";

export const runtime = "nodejs";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요." },
      { status: 400 }
    );
  }

  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.password_hash, u.name, u.household_id, h.name AS household_name, h.invite_code
       FROM user u
       JOIN household h ON h.id = u.household_id
       WHERE u.email = ?`
    )
    .get(email) as
    | {
        id: number;
        password_hash: string;
        name: string;
        household_id: number;
        household_name: string;
        invite_code: string;
      }
    | undefined;

  // 존재하지 않는 이메일과 틀린 비밀번호를 같은 메시지로 응답해 계정 존재 여부가
  // 노출되지 않게 한다.
  if (!row || !verifyPassword(password, row.password_hash)) {
    return NextResponse.json(
      { error: "이메일 또는 비밀번호가 올바르지 않아요." },
      { status: 401 }
    );
  }

  const { token } = createSession(row.id);

  const res = NextResponse.json({
    token,
    user: {
      id: row.id,
      email,
      name: row.name,
      householdId: row.household_id,
      householdName: row.household_name,
      inviteCode: row.invite_code,
    },
  });

  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return res;
}
