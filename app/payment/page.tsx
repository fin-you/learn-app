'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

type OrderStatus = 'diproses' | 'dikirim' | 'sampai';

export default function PaymentPage() {
  const [bankAccount, setBankAccount] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State alur pembayaran & status
  const [isPaid, setIsPaid] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('diproses');

  const totalPayment = 311500; // IDR

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmitPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!bankAccount || !proofFile) {
      alert('Mohon lengkapi nomor rekening dan bukti transfer terlebih dahulu.');
      return;
    }
    setIsPaid(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              {isPaid ? 'Status & Lacak Pesanan' : 'Form Pembayaran Buyer'}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {isPaid 
                ? 'Pantau progres barang titipan Anda secara real-time.' 
                : 'Selesaikan pembayaran untuk memproses pesanan Anda.'}
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-brand-green transition-colors">
            ← Kembali ke Dashboard
          </Link>
        </div>

        {!isPaid ? (
          /* FASE 1: FORM PEMBAYARAN */
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            
            {/* Informasi Rekening Tujuan Seller */}
            <div className="p-5 bg-brand-green-light border border-emerald-200 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Rekening Bank Tujuan (Seller)</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-extrabold text-slate-950">BCA - 8820 1923 881</p>
                  <p className="text-xs text-slate-600">a.n. Budi Santoso (Jastip Seller)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total Transfer</p>
                  <p className="text-xl font-extrabold text-brand-green">Rp 311.500</p>
                </div>
              </div>
            </div>

            {/* Input Nomor Rekening Buyer */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Nomor Rekening Bank Pengirim (Buyer) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Mandiri - 1370012345678 a.n Ahmad"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Unggah Bukti Transaksi */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Unggah Bukti Transfer / Transaksi <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-green-light file:text-brand-green cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1"
              />
              {previewUrl && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
                  <img
                    src={previewUrl}
                    alt="Bukti Transfer"
                    className="w-20 h-20 object-cover rounded-xl border border-slate-300 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Bukti Transfer Terlampir</p>
                    <p className="text-xs text-slate-500 mt-0.5">{proofFile?.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol Submit Pembayaran */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-4 bg-brand-green hover:opacity-90 font-bold rounded-2xl text-white transition-all shadow-lg active:scale-95 cursor-pointer text-lg tracking-tight"
              >
                Kirim Bukti Pembayaran
              </button>
            </div>
          </form>
        ) : (
          /* FASE 2: TRACKING STATUS PESANAN */
          <div className="space-y-8">
            
            {/* Banner Sukses Pembayaran */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950">Bukti Pembayaran Berhasil Dikirim!</h3>
                <p className="text-xs text-slate-600">Nomor Rekening: <span className="font-semibold text-slate-800">{bankAccount}</span></p>
              </div>
            </div>

            {/* TIMELINE STATUS PESANAN */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-950">Lacak Status Pesanan</h2>

              <div className="grid grid-cols-3 gap-3 relative">
                
                {/* Step 1: Pesanan Diproses */}
                <div
                  onClick={() => setCurrentStatus('diproses')}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    currentStatus === 'diproses'
                      ? 'bg-brand-green-light border-brand-green text-brand-green shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-2xl mb-1">📦</div>
                  <p className="text-xs font-bold uppercase tracking-wider">1. Diproses</p>
                  <p className="text-[11px] mt-0.5">Pesanan Diproses</p>
                </div>

                {/* Step 2: Pesanan Dikirim */}
                <div
                  onClick={() => setCurrentStatus('dikirim')}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    currentStatus === 'dikirim'
                      ? 'bg-brand-green-light border-brand-green text-brand-green shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-2xl mb-1">🛫</div>
                  <p className="text-xs font-bold uppercase tracking-wider">2. Dikirim</p>
                  <p className="text-[11px] mt-0.5">Pesanan Dikirim</p>
                </div>

                {/* Step 3: Pesanan Sampai Rumah */}
                <div
                  onClick={() => setCurrentStatus('sampai')}
                  className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                    currentStatus === 'sampai'
                      ? 'bg-brand-green-light border-brand-green text-brand-green shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-2xl mb-1">🏠</div>
                  <p className="text-xs font-bold uppercase tracking-wider">3. Selesai</p>
                  <p className="text-[11px] mt-0.5">Sampai Rumah</p>
                </div>

              </div>
            </div>

            {/* Rincian Keterangan Status saat ini */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detail Status Terakhir</p>
              {currentStatus === 'diproses' && (
                <div>
                  <h4 className="text-base font-bold text-slate-900">Pesanan Sedang Diproses Seller</h4>
                  <p className="text-sm text-slate-600 mt-0.5">Seller telah mengonfirmasi pembayaran Anda dan sedang membeli barang titipan Anda di luar negeri.</p>
                </div>
              )}
              {currentStatus === 'dikirim' && (
                <div>
                  <h4 className="text-base font-bold text-slate-900">Pesanan Dalam Pengiriman</h4>
                  <p className="text-sm text-slate-600 mt-0.5">Barang sedang dalam perjalanan menuju alamat rumah Anda via kurir ekspedisi. Resi: <span className="font-mono font-bold text-slate-800">JNE-JP-8829102</span></p>
                </div>
              )}
              {currentStatus === 'sampai' && (
                <div>
                  <h4 className="text-base font-bold text-brand-green">Pesanan Telah Sampai di Rumah</h4>
                  <p className="text-sm text-slate-600 mt-0.5">Barang telah berhasil diterima. Terima kasih telah menggunakan layanan Jastip!</p>
                </div>
              )}
            </div>

            {/* Tombol kembali ke Dashboard */}
            <div className="pt-2">
              <Link
                href="/"
                className="block w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-center rounded-xl text-sm transition-all"
              >
                Kembali ke Dashboard Utama
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}