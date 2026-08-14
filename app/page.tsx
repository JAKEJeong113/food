import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { recommendRecipes } from "@/lib/scoring";
import { getUserByToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import LogoutButton from "./logout-button";

export const dynamic = "force-dynamic";

function InventoryCount(householdId: number) {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT COUNT(*) AS count FROM inventory inv
       JOIN ingredient_master im ON im.id = inv.ingredient_id
       WHERE im.is_basic_seasoning = 0 AND inv.household_id = ?`
    )
    .get(householdId) as { count: number };
  return row.count;
}

export default function HomePage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value ?? null;
  const user = getUserByToken(token);
  if (!user) {
    redirect("/login");
  }

  const itemCount = InventoryCount(user.householdId);
  const allRecommendations = itemCount > 0 ? recommendRecipes(user.householdId) : [];
  const recommendations = allRecommendations.slice(0, 3);

  return (
    <div className="px-5 pt-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">오늘 뭐 먹지?</h1>
          <p className="text-sm text-gray-500 mt-1">
            냉장고를 찍으면, 오늘 먹을 게 보여요.
          </p>
        </div>
        <div className="text-right pt-1">
          <p className="text-xs text-gray-400">{user.householdName}</p>
          <LogoutButton />
        </div>
      </div>

      <Link
        href="/camera"
        className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-fresh-600 text-white py-4 font-semibold shadow-sm active:scale-[0.99] transition"
      >
        📷 냉장고 찍기
      </Link>

      {itemCount === 0 ? (
        <div className="mt-10 text-center text-gray-400 text-sm">
          아직 등록된 재료가 없어요.
          <br />
          냉장고를 찍으면 재료를 자동으로 인식해드려요.
        </div>
      ) : (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold text-gray-800">
              오늘 만들 수 있는 요리 {allRecommendations.length}개
            </h2>
            <Link href="/recipes" className="text-xs text-fresh-600 font-medium">
              전체보기 →
            </Link>
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {recommendations.map((r, idx) => (
              <div
                key={r.recipeId}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <span>{["🥇", "🥈", "🥉"][idx]}</span>
                  {r.title}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  재료 보유율 {r.matchRate}% · ⏱ {r.cookTimeMinutes}분
                  {r.kidFriendly ? " · 👨‍👩‍👧 가족메뉴" : ""}
                </div>
                <div className="mt-1 text-xs text-gray-400">{r.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
