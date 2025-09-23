import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { cn } from '../../utils/cn';

export function RootLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container-xl grid min-h-screen grid-rows-[auto,1fr] tablet:grid-rows-[auto,1fr] desktop:grid-rows-1 desktop:grid-cols-[280px,1fr]">
      {/* Top bar for small screens */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-surface px-4 py-3 desktop:hidden">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-medium">Admin Agentes</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
          className="rounded-md p-2 hover:bg-white/5"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/70 desktop:bg-surface desktop:backdrop-blur-none desktop:static desktop:translate-x-0 desktop:opacity-100',
          'fixed inset-y-0 left-0 z-30 w-[80%] max-w-[300px] -translate-x-full opacity-0 transition-all duration-300 desktop:w-auto',
          open && 'translate-x-0 opacity-100'
        )}
      >
        <div className="hidden desktop:flex items-center gap-2 px-4 h-16 border-b border-white/5">
          <Logo className="h-6 w-6" />
          <span className="text-sm font-medium">Admin Agentes</span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <NavItem to="/" label="Início" icon={<HomeIcon className="h-5 w-5" />} onClick={() => setOpen(false)} end />
          <NavItem to="/projetos" label="Projetos" icon={<FolderIcon className="h-5 w-5" />} onClick={() => setOpen(false)} />
          <NavItem to="/agente" label="Agente" icon={<BotIcon className="h-5 w-5" />} onClick={() => setOpen(false)} />
        </nav>
      </aside>

      {/* Scrim for mobile when drawer open */}
      {open && (
        <button
          aria-label="Fechar menu"
          className="fixed inset-0 z-20 bg-black/40 desktop:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="bg-background desktop:rounded-l-xl border-l border-white/5">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label, icon, onClick, end }: { to: string; label: string; icon: React.ReactNode; onClick?: () => void; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
          'text-white/70 hover:text-white hover:bg-white/5',
          isActive && 'bg-white/10 text-white'
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2l3.5 6 6 3.5-6 3.5L12 22l-3.5-6L2 11.5 8.5 8 12 2z" fill="#3B82F6" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 6.5h6l2 2H21a1 1 0 0 1 1 1V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="4" y="6" width="16" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      <path d="M12 6V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

