'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const router = useRouter();

  // Mock data barang & rincian harga
  const [itemData] = useState({
    id: 'REQ-001',
    model: 'Matcha Powder Uji Premium 100g',
    merk: 'Ito En',
    kuantitas: 2,
    sellerName: 'Budi (Jasa Titip JP)',
    country: '🇯🇵 Jepang',
    price: 265000,
    fee: 26500,
    shippingFee: 20000,
  });

  const totalDibayar = itemData.price + itemData.fee + itemData.shippingFee;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Handler untuk Pembatalan Request -> Langsung redirect ke Dashboard tanpa notifikasi browser
  const handleCancelRequest = () => {
    // Tambahkan logika update status / panggil API pembatalan di sini jika diperlukan
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#e9ebe6] text-slate-900 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Kembali ke Dashboard
        </Link>

        {/* Card Utama Konfirmasi */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 space-y-6">
          
          {/* Header Card */}
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-bold text-slate-950">Konfirmasi Harga & Pembayaran</h1>
            <p className="text-slate-500 text-sm mt-1">
              Seller telah mengajukan harga. Periksa rincian tagihan di bawah sebelum melakukan konfirmasi.
            </p>
          </div>

          {/* Informasi Barang */}
          <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="w-16 h-16 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-mono text-xs shrink-0">
              IMG
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{itemData.model}</h2>
              <p className="text-sm text-slate-600">Merk: {itemData.merk} • Qty: {itemData.kuantitas}</p>
              <p className="text-xs text-slate-500 mt-1">
                Seller: <span className="font-medium text-slate-700">{itemData.sellerName}</span> ({itemData.country})
              </p>
            </div>
          </div>

          {/* Kartu Estimasi Tagihan */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-base mb-4">Estimasi Tagihan</h3>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Harga Barang</span>
              <span className="font-medium text-slate-800">{formatRupiah(itemData.price)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Fee Jastip (10%)</span>
              <span className="font-medium text-slate-800">{formatRupiah(itemData.fee)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Ongkos Kirim</span>
              <span className="font-medium text-slate-800">{formatRupiah(itemData.shippingFee)}</span>
            </div>

            {/* Garis Putus-Putus */}
            <hr className="border-t-2 border-dashed border-slate-200 my-4" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-600 font-medium text-sm">Total Dibayar</span>
              <span className="text-2xl font-extrabold text-slate-950">
                {formatRupiah(totalDibayar)}
              </span>
            </div>
          </div>

          {/* Tombol Aksi: Cancel Request & Konfirmasi Pembayaran */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelRequest}
              className="w-full sm:w-auto px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-semibold rounded-xl text-sm transition-all active:scale-95 text-center cursor-pointer"
            >
              ✕ Batalkan Request (Harga Tidak Sesuai)
            </button>

            <Link
              href="/payment"
              className="w-full sm:w-auto px-8 py-3 bg-brand-green hover:opacity-90 font-bold text-white rounded-xl text-sm shadow-md transition-all active:scale-95 text-center cursor-pointer block"
            >
              ✓ Konfirmasi & Bayar Sekarang
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}