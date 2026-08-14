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

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.maxTime) params.set("maxTime", String(filters.maxTime));
    if (filters.kidFriendly) params.set("kidFriendly", "1");
    if (filters.noShopping) params.set("noShopping", "1");
    if (filters.cuisine) params.set("cuisine", filters.cuisine);
    if (filters.spicy) params.set("spicy", "1");
    if (filters.diet) params.set("diet", "1");
    if (filters.babyFood) params.set("babyFood", "1");
    if (filters.fried) params.set("cookingMethod", "튀김");

    setLoading(true);
    fetch(`/api/recipes/recommend?${params.toString()}`)
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setRecommendations(data.recommendations);
      })
      .finally(() => setLoading(false));
  }, [filters, router]);

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
          {recommendations.map((r) => {
            const isOpen = expanded === r.recipeId;
            return (
              <div
                key={r.recipeId}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
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

                <button
                  onClick={() => setExpanded(isOpen ? null : r.recipeId)}
                  className="mt-3 text-xs text-fresh-600 font-medium"
                >
                  {isOpen ? "레시피 접기 ▲" : "레시피 보기 ▼"}
                </button>

                {isOpen && (
                  <p className="mt-2 text-sm text-gray-600 border-t pt-2">{r.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
