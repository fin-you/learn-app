'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Mock data user
  const user = {
    name: 'Ahmad',
    role: 'Buyer',
    email: 'ahmad@example.com',
    avatarLetter: 'A',
  };

  // Helper untuk mengecek halaman yang sedang aktif
  const isActive = (path: string) => pathname === path;

  return (
    <header className="w-full bg-white border-b border-slate-100 px-6 py-3.5 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* BAGIAN KIRI: Logo & Navigasi */}
        <div className="flex items-center gap-8">
          {/* Logo Jastip */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              J
            </div>
            <span className="font-extrabold text-lg text-slate-950 tracking-tight">
              Jastip
            </span>
          </Link>

          {/* Navigasi Menu Kiri */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors ${
                isActive('/') 
                  ? 'text-slate-950 font-bold border-b-2 border-brand-green pb-0.5' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/request"
              className={`transition-colors ${
                isActive('/request') 
                  ? 'text-slate-950 font-bold border-b-2 border-brand-green pb-0.5' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Request
            </Link>

            <Link
              href="/confirmation"
              className={`transition-colors ${
                isActive('/confirmation') 
                  ? 'text-slate-950 font-bold border-b-2 border-brand-green pb-0.5' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Konfirmasi Harga
            </Link>

          </nav>
        </div>

        {/* BAGIAN KANAN: User Profile & Log Out */}
        <div className="flex items-center gap-4">
          <div className="text-right leading-tight hidden sm:block">
            <p className="text-sm font-bold text-slate-950">{user.name}</p>
            <p className="text-xs text-slate-400 font-medium">{user.role}</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center border border-slate-300">
            {user.avatarLetter}
          </div>

          <button
            onClick={() => alert('Log Out berhasil!')}
            className="px-4 py-1.5 text-xs font-semibold text-slate-800 hover:text-slate-950 bg-white border border-slate-300 rounded-full hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          >
            Log Out
          </button>
        </div>

      </div>
    </header>
  );
}