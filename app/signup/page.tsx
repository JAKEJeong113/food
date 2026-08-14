"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

type HouseholdMode = "create" | "join";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<HouseholdMode>("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ householdName: string; inviteCode: string } | null>(
    null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          householdName: mode === "create" ? householdName : undefined,
          inviteCode: mode === "join" ? inviteCode : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "회원가입에 실패했어요.");
        return;
      }

      setSuccess({
        householdName: data.user.householdName,
        inviteCode: data.user.inviteCode,
      });
    } catch {
      setError("회원가입 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="px-5 pt-16 text-center">
        <div className="text-4xl">🎉</div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">
          {success.householdName} 가입 완료!
        </h1>
        {mode === "create" && (
          <div className="mt-4 rounded-xl bg-fresh-50 p-4">
            <p className="text-sm text-gray-600">
              가족에게 이 초대코드를 알려주면 같은 냉장고를 함께 관리할 수 있어요.
            </p>
            <p className="mt-2 text-2xl font-bold tracking-widest text-fresh-700">
              {success.inviteCode}
            </p>
          </div>
        )}
        <button
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          className="mt-8 w-full rounded-2xl bg-fresh-600 text-white py-4 font-semibold"
        >
          시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-16">
      <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
      <p className="text-sm text-gray-500 mt-1">우리 집 냉장고를 함께 관리해요.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
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
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />

        <div className="mt-2 flex rounded-xl bg-gray-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`flex-1 rounded-lg py-2 font-medium ${
              mode === "create" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
            }`}
          >
            새 가구 만들기
          </button>
          <button
            type="button"
            onClick={() => setMode("join")}
            className={`flex-1 rounded-lg py-2 font-medium ${
              mode === "join" ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
            }`}
          >
            초대코드로 합류
          </button>
        </div>

        {mode === "create" ? (
          <input
            type="text"
            placeholder="우리 집 이름 (예: 정상경네 냉장고)"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
          />
        ) : (
          <input
            type="text"
            placeholder="초대코드 6자리"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            required
            maxLength={6}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm tracking-widest uppercase"
          />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-2xl bg-fresh-600 text-white py-4 font-semibold disabled:opacity-50"
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="text-fresh-600 font-medium">
          로그인
        </Link>
      </p>
    </div>
  );
}
