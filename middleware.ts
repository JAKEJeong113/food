import { NextRequest, NextResponse } from "next/server";

// 쿠키 이름을 lib/auth.ts에서 가져오지 않고 여기 그대로 적어둔다. 미들웨어는
// Edge 런타임에서 실행되는데, lib/auth.ts는 better-sqlite3(Node 전용 네이티브
// 모듈)를 쓰는 lib/db.ts를 불러오기 때문에 Edge 번들에 넣으면 빌드가 깨진다.
// 여기서는 "쿠키가 있는지"만 값싸게 확인해 UX상 빠르게 리다이렉트하고,
// 실제 세션 유효성 검증은 각 페이지/서버(Node 런타임)에서 다시 한다.
const SESSION_COOKIE_NAME = "session_token";

// 로그인 안 한 사람만 볼 화면 — 이미 로그인했으면 홈으로 돌려보낸다.
const AUTH_PAGES = ["/login", "/signup"];

// 로그인 여부와 무관하게 항상 보여야 하는 화면 (약관 등).
const ALWAYS_PUBLIC_PATHS = ["/privacy"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ALWAYS_PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const hasToken = Boolean(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (!hasToken && !isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (hasToken && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
