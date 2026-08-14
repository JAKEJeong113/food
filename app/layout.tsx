import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./bottom-nav";

export const metadata: Metadata = {
  title: "냉파AI — 냉장고를 찍으면, 오늘 먹을 게 보인다",
  description: "우리 집 냉장고를 자동으로 관리하고 오늘 만들 수 있는 요리를 추천합니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <main className="min-h-screen pb-20">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
