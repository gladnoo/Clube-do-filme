"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Clapperboard,
  Calendar,
  ListPlus,
  LibraryBig,
  Trophy,
  CircleUserRound,
  LogOut,
  Plus,
} from "lucide-react";

const TABS = [
  { href: "/week", label: "Semana", short: "Semana", Icon: Calendar },
  { href: "/queue", label: "Fila", short: "Fila", Icon: ListPlus },
  { href: "/history", label: "Histórico", short: "Hist.", Icon: LibraryBig },
  { href: "/ranking", label: "Ranking", short: "Ranking", Icon: Trophy },
  { href: "/profile", label: "Perfil", short: "Perfil", Icon: CircleUserRound },
];

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initial = session?.user?.name?.slice(0, 1)?.toUpperCase() ?? "?";

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {/* Topo — desktop */}
      <header className="hidden md:flex items-center justify-between px-8 h-16 border-b border-white/[0.06] sticky top-0 bg-bg/90 backdrop-blur-md z-40">
        <Link href="/week" className="flex items-center gap-2 font-display text-2xl tracking-wide2">
          <Clapperboard className="w-5 h-5 text-gold" />
          CLUBE DO FILME
        </Link>

        <nav className="flex items-center gap-1 bg-bgalt border border-white/[0.06] rounded-full p-1">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              data-active={isActive(tab.href)}
              className="tab-pill flex items-center gap-1.5"
            >
              <tab.Icon className="w-3.5 h-3.5" />
              {tab.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/add"
            aria-label="Adicionar filme"
            className="w-9 h-9 rounded-full bg-red hover:bg-red-dark transition-colors flex items-center justify-center text-paper shadow-pop"
          >
            <Plus className="w-4 h-4" />
          </Link>
          <span className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-display text-sm">
            {initial}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sair"
            className="text-paperalt/40 hover:text-red-light transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Cabeçalho simples — mobile */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-white/[0.06] sticky top-0 bg-bg/90 backdrop-blur-md z-40">
        <span className="flex items-center gap-1.5 font-display text-xl tracking-wide2">
          <Clapperboard className="w-4 h-4 text-gold" />
          CLUBE DO FILME
        </span>
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-display text-xs">
            {initial}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            aria-label="Sair"
            className="text-paperalt/40"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Botão flutuante de adicionar — mobile */}
      <Link
        href="/add"
        aria-label="Adicionar filme"
        className="md:hidden fixed right-4 bottom-[76px] z-40 w-14 h-14 rounded-full bg-red hover:bg-red-dark transition-colors flex items-center justify-center text-paper shadow-pop"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* Barra inferior — mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bgalt/95 backdrop-blur-md border-t border-white/[0.06] flex z-40 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            data-active={isActive(tab.href)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 font-mono text-[10px] uppercase tracking-wide2 text-paperalt/50 data-[active=true]:text-gold"
          >
            <tab.Icon className="w-4 h-4" />
            {tab.short}
          </Link>
        ))}
      </nav>
    </>
  );
}
