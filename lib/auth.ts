import crypto from "crypto";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";
import { getDb } from "./db";

const SESSION_COOKIE = "session_token";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30일

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateInviteCode(): string {
  // 헷갈리기 쉬운 0/O, 1/I 제외한 6자리 코드
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[crypto.randomInt(alphabet.length)];
  }
  return code;
}

export interface AuthUser {
  id: number;
  householdId: number;
  householdName: string;
  email: string;
  name: string;
}

export function createSession(userId: number): { token: string; expiresAt: string } {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  db.prepare(
    "INSERT INTO session (token, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, userId, expiresAt);

  return { token, expiresAt };
}

export function destroySession(token: string): void {
  const db = getDb();
  db.prepare("DELETE FROM session WHERE token = ?").run(token);
}

export function getUserByToken(token: string | null): AuthUser | null {
  if (!token) return null;

  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.household_id, h.name AS household_name, u.email, u.name, s.expires_at
       FROM session s
       JOIN user u ON u.id = s.user_id
       JOIN household h ON h.id = u.household_id
       WHERE s.token = ?`
    )
    .get(token) as
    | {
        id: number;
        household_id: number;
        household_name: string;
        email: string;
        name: string;
        expires_at: string;
      }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    destroySession(token);
    return null;
  }

  return {
    id: row.id,
    householdId: row.household_id,
    householdName: row.household_name,
    email: row.email,
    name: row.name,
  };
}

/** 웹(쿠키)과 안드로이드(Authorization: Bearer 헤더) 양쪽에서 토큰을 읽는다. */
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length);
  }
  return req.cookies.get(SESSION_COOKIE)?.value ?? null;
}

export function getRequestUser(req: NextRequest): AuthUser | null {
  return getUserByToken(getTokenFromRequest(req));
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
