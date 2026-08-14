"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Recommendation {
  recipeId: number;
  title: string;
  description: string;
  servings: number;
  cookTimeMinutes: number;
  kidFriendly: boolean;
  spicyLevel: number;
  cuisineType: string;
  cookingMethod: string;
  isDiet: boolean;
  isBabyFood: boolean;
  score: number;
  matchRate: number;
  missing: string[];
  reason: string;
}

interface DeductionItem {
  ingredientId: number;
  name: string;
  unit: string;
  currentQuantity: number;
  afterQuantity: number;
  deducted: number;
}

interface Filters {
  maxTime?: number;
  kidFriendly: boolean;
  noShopping: boolean;
  cuisine?: string; // undefined = 전체
  spicy: boolean;
  diet: boolean;
  babyFood: boolean;
  fried: boolean;
}

const CUISINE_OPTIONS = ["전체", "한식", "중식", "양식"];

const BOOLEAN_CHIPS: { key: keyof Filters; label: string }[] = [
  { key: "kidFriendly", label: "아이와 함께" },
  { key: "noShopping", label: "추가 장보기 없음" },
  { key: "spicy", label: "매운맛" },
  { key: "diet", label: "다이어트식" },
  { key: "babyFood", label: "유아식" },
  { key: "fried", label: "튀김" },
];

const DEFAULT_FILTERS: Filters = {
  kidFriendly: false,
  noShopping: false,
  cuisine: undefined,
  spicy: false,
  diet: false,
  babyFood: false,
  fried: false,
};

export default function RecipesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  function fetchRecommendations() {
    const params = new URLSearchParams();
    if (filters.maxTime) params.set("maxTime", String(filters.maxTime));
    if (filters.kidFriendly) params.set("kidFriendly", "1");
    if (filters.noShopping) params.set("noShopping", "1");
    if (filters.cuisine) params.set("cuisine", filters.cuisine);
    if (filters.spicy) params.set("spicy", "1");
    if (filters.diet) params.set("diet", "1");
    if (filters.babyFood) params.set("babyFood", "1");
    if (filters.fried) params.set("cookingMethod", "튀김");

    return fetch(`/api/recipes/recommend?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setRecommendations(data.recommendations);
      });
  }

  // 필터가 바뀔 때만 목록 전체를 로딩 화면으로 바꾼다.
  useEffect(() => {
    setLoading(true);
    fetchRecommendations().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // "이걸로 먹을래" 반영 후에는 재고 반영분만 조용히 새로고침한다. 여기서
  // loading을 건드리면 카드 전체가 로딩 문구로 바뀌면서 언마운트돼, 방금
  // 보여준 "반영했어요!" 메시지가 뜨자마자 사라져 버린다.
  function reloadSilently() {
    fetchRecommendations();
  }

  function toggleBoolean(key: keyof Filters) {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function selectCuisine(option: string) {
    setFilters((prev) => ({ ...prev, cuisine: option === "전체" ? undefined : option }));
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-bold text-gray-900">오늘의 추천</h1>

      <div className="mt-4 flex gap-2 flex-wrap">
        {CUISINE_OPTIONS.map((option) => {
          const active = (filters.cuisine ?? "전체") === option;
          return (
            <button
              key={option}
              onClick={() => selectCuisine(option)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                active
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, maxTime: prev.maxTime === 20 ? undefined : 20 }))}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
            filters.maxTime === 20
              ? "bg-fresh-600 text-white border-fresh-600"
              : "bg-white text-gray-600 border-gray-200"
          }`}
        >
          20분 이내
        </button>
        {BOOLEAN_CHIPS.map((chip) => (
          <button
            key={chip.key}
            onClick={() => toggleBoolean(chip.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              filters[chip.key]
                ? "bg-fresh-600 text-white border-fresh-600"
                : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : recommendations.length === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-400">
          조건에 맞는 요리가 없어요. 필터를 바꿔보세요.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {recommendations.map((r) => (
            <RecipeCard
              key={r.recipeId}
              recipe={r}
              expanded={expanded === r.recipeId}
              onToggleExpand={() => setExpanded(expanded === r.recipeId ? null : r.recipeId)}
              onCooked={reloadSilently}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type CookStage = "idle" | "loading" | "ready" | "saving" | "done";

function RecipeCard({
  recipe: r,
  expanded,
  onToggleExpand,
  onCooked,
}: {
  recipe: Recommendation;
  expanded: boolean;
  onToggleExpand: () => void;
  onCooked: () => void;
}) {
  const [cookStage, setCookStage] = useState<CookStage>("idle");
  const [deductionItems, setDeductionItems] = useState<DeductionItem[]>([]);

  async function startCooking() {
    setCookStage("loading");
    const res = await fetch(`/api/recipes/${r.recipeId}/deduction-preview`);
    if (!res.ok) {
      setCookStage("idle");
      return;
    }
    const data = await res.json();
    setDeductionItems(data.items);
    setCookStage("ready");
  }

  async function confirmCooking() {
    setCookStage("saving");
    const res = await fetch(`/api/recipes/${r.recipeId}/cook`, { method: "POST" });
    if (!res.ok) {
      setCookStage("ready");
      return;
    }
    setCookStage("done");
    onCooked();
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-gray-900">{r.title}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            재료 보유율 {r.matchRate}% · ⏱ {r.cookTimeMinutes}분 · {r.servings}인분
            {r.kidFriendly ? " · 👨‍👩‍👧 가족메뉴" : ""}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {r.cuisineType}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {r.cookingMethod}
            </span>
            {r.spicyLevel > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                매운맛 {"🌶".repeat(r.spicyLevel)}
              </span>
            )}
            {r.isDiet && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                다이어트식
              </span>
            )}
            {r.isBabyFood && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                유아식
              </span>
            )}
          </div>
        </div>
        <div className="text-lg font-bold text-fresh-600">{r.score}</div>
      </div>

      <div className="mt-2 text-xs text-gray-500">{r.reason}</div>

      {r.missing.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {r.missing.map((m) => (
            <span
              key={m}
              className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700"
            >
              {m} 없음
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4">
        <button onClick={onToggleExpand} className="text-xs text-fresh-600 font-medium">
          {expanded ? "레시피 접기 ▲" : "레시피 보기 ▼"}
        </button>
        {cookStage === "idle" && (
          <button onClick={startCooking} className="text-xs text-gray-700 font-medium underline">
            이걸로 먹을래
          </button>
        )}
      </div>

      {expanded && (
        <p className="mt-2 text-sm text-gray-600 border-t pt-2">{r.description}</p>
      )}

      {cookStage === "loading" && (
        <p className="mt-3 text-xs text-gray-400 border-t pt-3">재고를 확인하고 있어요...</p>
      )}

      {(cookStage === "ready" || cookStage === "saving") && (
        <div className="mt-3 border-t pt-3">
          {deductionItems.length === 0 ? (
            <p className="text-xs text-gray-500">
              차감할 재고가 없어요. 그래도 조리 기록만 남길까요?
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">사용한 재료를 냉장고에서 반영할까요?</p>
              <div className="flex flex-col gap-1">
                {deductionItems.map((item) => (
                  <div key={item.ingredientId} className="flex justify-between text-xs">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-500">
                      {item.currentQuantity}
                      {item.unit} → {item.afterQuantity}
                      {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setCookStage("idle")}
              disabled={cookStage === "saving"}
              className="flex-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600"
            >
              취소
            </button>
            <button
              onClick={confirmCooking}
              disabled={cookStage === "saving"}
              className="flex-1 rounded-lg bg-fresh-600 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {cookStage === "saving" ? "반영 중..." : "반영하기"}
            </button>
          </div>
        </div>
      )}

      {cookStage === "done" && (
        <p className="mt-3 text-xs text-fresh-700 border-t pt-3">
          🎉 반영했어요! 냉장고 재고가 업데이트됐어요.
        </p>
      )}
    </div>
  );
}
