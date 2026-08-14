"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "로그인에 실패했어요.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("로그인 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-5 pt-16">
      <h1 className="text-2xl font-bold text-gray-900">냉파AI</h1>
      <p className="text-sm text-gray-500 mt-1">우리 집 냉장고에 로그인하세요.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-2xl bg-fresh-600 text-white py-4 font-semibold disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        아직 계정이 없나요?{" "}
        <Link href="/signup" className="text-fresh-600 font-medium">
          회원가입
        </Link>
      </p>
    </div>
  );
}
