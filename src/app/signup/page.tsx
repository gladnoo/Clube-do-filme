"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clapperboard, User2, AtSign, KeyRound } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, username, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Não foi possível criar a conta.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { username, password, redirect: false });
    setLoading(false);
    if (signInRes?.error) {
      router.push("/login");
      return;
    }
    router.push("/week");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-spot bg-no-repeat">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-teal/20 border border-teal/40 flex items-center justify-center mx-auto mb-4">
            <Clapperboard className="w-5 h-5 text-teal-light" />
          </div>
          <p className="font-mono text-gold text-xs tracking-wide3 uppercase mb-2">
            Nova carteirinha
          </p>
          <h1 className="font-display text-6xl tracking-wide leading-none">CLUBE DO FILME</h1>
        </div>

        <form onSubmit={handleSubmit} className="ficha p-6 flex flex-col gap-4">
          <div>
            <label className="field-label">
              <User2 className="w-3.5 h-3.5" /> Seu nome
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="field-input text-lg"
            />
          </div>
          <div>
            <label className="field-label">
              <AtSign className="w-3.5 h-3.5" /> Usuário
            </label>
            <input
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="field-input text-lg"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="field-label">
              <KeyRound className="w-3.5 h-3.5" /> Senha
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input text-lg"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-dark text-sm font-mono">{error}</p>}

          <button type="submit" disabled={loading} className="btn-teal mt-1 !text-sm !py-3">
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center mt-6 text-paperalt/50 text-sm font-mono">
          Já tem conta?{" "}
          <Link href="/login" className="text-gold underline underline-offset-4">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
