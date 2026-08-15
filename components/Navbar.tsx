'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Mock data user (Bisa diganti dengan data dari context/state/auth)
  const user = {
    name: 'test',
    role: 'Buyer',
    avatarLetter: 'T',
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* BAGIAN KIRI: Logo & Navigasi */}
        <div className="flex items-center gap-10">
          {/* Logo Jastip dengan Icon Kubus Hijau */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              className="w-7 h-7 text-green-400 group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <span className="font-black text-xl text-slate-900 tracking-tight">
              Jastip
            </span>
          </Link>

          {/* Navigasi Menu Kiri */}
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link
              href="/"
              className={`transition-colors ${
                isActive('/')
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/request"
              className={`transition-colors ${
                isActive('/request')
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Request
            </Link>
          </nav>
        </div>

        {/* BAGIAN KANAN: User Profile & Log Out */}
        <div className="flex items-center gap-4">
          <div className="text-right leading-tight">
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-400 font-medium">{user.role}</p>
          </div>

          {/* Klik Photo Profile untuk berpindah ke halaman edit profile */}
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-emerald-100/70 text-slate-800 font-medium text-base flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
            title="Edit Profile"
          >
            {user.avatarLetter}
          </Link>

          <button
            onClick={() => alert('Log Out berhasil!')}
            className="px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-100 border border-slate-900 rounded-full transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>

      </div>
    </header>
  );
}