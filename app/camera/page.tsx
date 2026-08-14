"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewItem {
  ingredientId: number;
  name: string;
  quantity: number;
  unit: string;
  confidence: number;
  defaultShelfLifeDays: number | null;
}

type Stage = "idle" | "analyzing" | "reviewing" | "saving";

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [header, base64] = result.split(",");
      const mediaType = header.match(/data:(.*);base64/)?.[1] ?? file.type;
      resolve({ base64, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CameraPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [usedMock, setUsedMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setStage("analyzing");
    setPreview(URL.createObjectURL(file));

    try {
      const { base64, mediaType } = await fileToBase64(file);
      const res = await fetch("/api/fridge/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mediaType }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) throw new Error("재료 인식에 실패했어요.");

      const data = await res.json();
      setItems(data.items);
      setUsedMock(data.usedMock);
      setStage("reviewing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했어요.");
      setStage("idle");
    }
  }

  function updateQuantity(idx: number, delta: number) {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    );
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function confirmAll() {
    setStage("saving");
    try {
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity,
            unit: item.unit,
            defaultShelfLifeDays: item.defaultShelfLifeDays,
          })),
        }),
      });
      router.push("/recipes");
    } catch {
      setError("냉장고에 반영하는 중 오류가 발생했어요.");
      setStage("reviewing");
    }
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="text-xl font-bold text-gray-900">냉장고 찍기</h1>

      {stage === "idle" && (
        <div className="mt-6">
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed border-fresh-500 bg-fresh-50 py-12 text-center text-fresh-700 font-medium"
          >
            📷 탭해서 냉장고 사진 찍기 / 업로드
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
      )}

      {stage === "analyzing" && (
        <div className="mt-8 text-center">
          {preview && (
            <img src={preview} alt="냉장고 사진" className="rounded-xl mx-auto max-h-64 object-cover" />
          )}
          <p className="mt-4 text-gray-500 text-sm animate-pulse">재료를 인식하고 있어요...</p>
        </div>
      )}

      {(stage === "reviewing" || stage === "saving") && (
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            {items.length}가지 재료를 찾았어요.
            {usedMock && (
              <span className="block text-xs text-amber-600 mt-1">
                (ANTHROPIC_API_KEY 미설정 — 예시 데이터입니다)
              </span>
            )}
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {items.map((item, idx) => (
              <div
                key={item.ingredientId + "-" + idx}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  {item.confidence < 0.85 && (
                    <div className="text-[11px] text-amber-600">확인이 필요해요</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(idx, -1)}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600"
                  >
                    −
                  </button>
                  <span className="w-14 text-center text-sm">
                    {item.quantity}
                    {item.unit}
                  </span>
                  <button
                    onClick={() => updateQuantity(idx, 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(idx)}
                    className="ml-1 text-gray-300 text-sm"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <button
            onClick={confirmAll}
            disabled={stage === "saving" || items.length === 0}
            className="mt-6 w-full rounded-2xl bg-fresh-600 text-white py-4 font-semibold disabled:opacity-50"
          >
            {stage === "saving" ? "반영 중..." : "모두 냉장고에 추가"}
          </button>
        </div>
      )}
    </div>
  );
}
