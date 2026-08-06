"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clapperboard, User2, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { username, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Usuário ou senha incorretos.");
      return;
    }
    router.push("/week");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-spot bg-no-repeat">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Clapperboard className="w-5 h-5 text-gold" />
          </div>
          <p className="font-mono text-gold text-xs tracking-wide3 uppercase mb-2">
            Sessão das 20h
          </p>
          <h1 className="font-display text-6xl tracking-wide leading-none">CLUBE DO FILME</h1>
          <p className="text-paperalt/50 mt-2 font-mono text-sm">entre com sua sessão</p>
        </div>

        <form onSubmit={handleSubmit} className="ficha p-6 flex flex-col gap-4">
          <div>
            <label className="field-label">
              <User2 className="w-3.5 h-3.5" /> Usuário
            </label>
            <input
              type="text"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input text-lg"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-dark text-sm font-mono">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-1 !text-sm !py-3">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-6 text-paperalt/50 text-sm font-mono">
          Ainda não tem carteirinha?{" "}
          <Link href="/signup" className="text-gold underline underline-offset-4">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
