"use client";

import { useEffect, useState } from "react";

interface Recommendation {
  recipeId: number;
  title: string;
  description: string;
  servings: number;
  cookTimeMinutes: number;
  kidFriendly: boolean;
  spicyLevel: number;
  score: number;
  matchRate: number;
  missing: string[];
  reason: string;
}

interface Filters {
  maxTime?: number;
  kidFriendly: boolean;
  noShopping: boolean;
}

const FILTER_CHIPS: { key: keyof Filters; label: string; value: unknown }[] = [
  { key: "maxTime", label: "20분 이내", value: 20 },
  { key: "kidFriendly", label: "아이와 함께", value: true },
  { key: "noShopping", label: "추가 장보기 없음", value: true },
];

export default function RecipesPage() {
  const [filters, setFilters] = useState<Filters>({
    kidFriendly: false,
    noShopping: false,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.maxTime) params.set("maxTime", String(filters.maxTime));
    if (filters.kidFriendly) params.set("kidFriendly", "1");
    if (filters.noShopping) params.set("noShopping", "1");

    setLoading(true);
    fetch(`/api/recipes/recommend?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.recommendations))
      .finally(() => setLoading(false));
  }, [filters]);

  function toggleChip(key: keyof Filters, value: unknown) {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? (key === "maxTime" ? undefined : false) : value,
    }));
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-bold text-gray-900">오늘의 추천</h1>

      <div className="mt-4 flex gap-2 flex-wrap">
        {FILTER_CHIPS.map((chip) => {
          const active = filters[chip.key] === chip.value;
          return (
            <button
              key={chip.key}
              onClick={() => toggleChip(chip.key, chip.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                active
                  ? "bg-fresh-600 text-white border-fresh-600"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
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
