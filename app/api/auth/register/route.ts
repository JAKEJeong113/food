import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  createSession,
  generateInviteCode,
  hashPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterBody {
  email?: string;
  password?: string;
  name?: string;
  householdName?: string;
  inviteCode?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as RegisterBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const name = body.name?.trim();
  const householdName = body.householdName?.trim();
  const inviteCode = body.inviteCode?.trim().toUpperCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "올바른 이메일을 입력해주세요." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "비밀번호는 8자 이상이어야 해요." },
      { status: 400 }
    );
  }
  if (!name) {
    return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  }
  if (!inviteCode && !householdName) {
    return NextResponse.json(
      { error: "새 가구 이름 또는 초대코드 중 하나가 필요해요." },
      { status: 400 }
    );
  }

  const db = getDb();

  const existing = db.prepare("SELECT id FROM user WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json(
      { error: "이미 가입된 이메일이에요." },
      { status: 409 }
    );
  }

  let householdId: number;

  if (inviteCode) {
    const household = db
      .prepare("SELECT id FROM household WHERE invite_code = ?")
      .get(inviteCode) as { id: number } | undefined;
    if (!household) {
      return NextResponse.json(
        { error: "초대코드를 찾을 수 없어요." },
        { status: 404 }
      );
    }
    householdId = household.id;
  } else {
    let code = generateInviteCode();
    // 극히 낮은 확률의 코드 충돌 방지
    while (db.prepare("SELECT id FROM household WHERE invite_code = ?").get(code)) {
      code = generateInviteCode();
    }
    const result = db
      .prepare("INSERT INTO household (name, invite_code) VALUES (?, ?)")
      .run(householdName, code);
    householdId = Number(result.lastInsertRowid);
  }

  const passwordHash = hashPassword(password);
  const userResult = db
    .prepare(
      "INSERT INTO user (household_id, email, password_hash, name) VALUES (?, ?, ?, ?)"
    )
    .run(householdId, email, passwordHash, name);

  const { token } = createSession(Number(userResult.lastInsertRowid));

  const household = db
    .prepare("SELECT name, invite_code FROM household WHERE id = ?")
    .get(householdId) as { name: string; invite_code: string };

  const res = NextResponse.json({
    token,
    user: {
      id: Number(userResult.lastInsertRowid),
      email,
      name,
      householdId,
      householdName: household.name,
      inviteCode: household.invite_code,
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
