'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqId = searchParams.get('id') || 'REQ-001';

  // State data barang & rincian harga
  const [itemData, setItemData] = useState({
    id: reqId,
    model: 'Matcha Powder Uji Premium 100g',
    merk: 'Ito En',
    kuantitas: 2,
    sellerName: 'Budi Santoso',
    country: '🇯🇵 Jepang',
    price: 265000,
    fee: 26500,
    shippingFee: 20000,
    photoUrl: undefined as string | undefined,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jastip_buyer_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        const found = parsed.find((item: any) => item.id === reqId);
        if (found) {
          setItemData({
            id: found.id,
            model: found.model,
            merk: found.merk,
            kuantitas: found.kuantitas || 1,
            sellerName: found.sellerName || 'Budi Santoso',
            country: found.country || '🇯🇵 Jepang',
            price: found.price || 265000,
            fee: found.fee || Math.round((found.price || 265000) * 0.1),
            shippingFee: found.shippingFee || 20000,
            photoUrl: found.photoUrl,
          });
        }
      }
    } catch (e) {
      console.error('Error loading request item for confirmation:', e);
    }
  }, [reqId]);

  const totalDibayar = itemData.price + itemData.fee + itemData.shippingFee;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Handler untuk Pembatalan Request -> Mengubah status menjadi 'cancelled' di localStorage
  const handleCancelRequest = () => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin membatalkan request ini karena harga tidak sesuai?');
    if (!isConfirmed) return;

    try {
      const saved = localStorage.getItem('jastip_buyer_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((item: any) => {
          if (item.id === itemData.id) {
            return { ...item, status: 'cancelled' };
          }
          return item;
        });
        localStorage.setItem('jastip_buyer_requests', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Gagal update status pembatalan di localStorage:', e);
    }

    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Tombol Kembali */}
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors gap-2"
        >
          ← Kembali ke Dashboard
        </Link>

        {/* Card Utama Konfirmasi */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 space-y-6">
          
          {/* Header Card */}
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-brand-green text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              ID: {itemData.id}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950">Konfirmasi Penawaran Harga Seller</h1>
            <p className="text-slate-500 text-sm mt-1">
              Seller telah mengajukan harga untuk request Anda. Tinjau rincian tagihan di bawah sebelum melanjutkan konfirmasi pembayaran.
            </p>
          </div>

          {/* Informasi Barang & Foto Produk */}
          <div className="flex items-start gap-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-xs">
              {itemData.photoUrl ? (
                <img src={itemData.photoUrl} alt={itemData.model} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">{itemData.model}</h2>
              <p className="text-sm text-slate-600">Merk: <span className="font-semibold text-slate-800">{itemData.merk}</span> • Jumlah: <span className="font-semibold text-slate-800">{itemData.kuantitas} pcs</span></p>
              <p className="text-xs text-slate-500 mt-1">
                Seller: <span className="font-semibold text-slate-800">{itemData.sellerName}</span> ({itemData.country})
              </p>
            </div>
          </div>

          {/* Kartu Estimasi Tagihan */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-base mb-4">Rincian Penawaran Harga Seller</h3>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Harga Barang</span>
              <span className="font-bold text-slate-900">{formatRupiah(itemData.price)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Fee Jastip (10%)</span>
              <span className="font-bold text-slate-900">{formatRupiah(itemData.fee)}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-600">
              <span>Ongkos Kirim Domestik/Internasional</span>
              <span className="font-bold text-slate-900">{formatRupiah(itemData.shippingFee)}</span>
            </div>

            {/* Garis Putus-Putus */}
            <hr className="border-t-2 border-dashed border-slate-200 my-4" />

            <div className="flex justify-between items-center pt-1">
              <div>
                <span className="text-slate-600 font-medium text-sm block">Total Tagihan Final</span>
                <span className="text-xs text-slate-400">Termasuk barang, fee jastip, & ongkir</span>
              </div>
              <span className="text-2xl md:text-3xl font-extrabold text-brand-green">
                {formatRupiah(totalDibayar)}
              </span>
            </div>
          </div>

          {/* Tombol Aksi: Cancel Request & Konfirmasi Pembayaran */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelRequest}
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold rounded-xl text-sm transition-all active:scale-95 text-center cursor-pointer"
            >
              ✕ Batalkan Request (Harga Tidak Sesuai)
            </button>

            <Link
              href={`/payment?id=${itemData.id}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-green hover:opacity-90 font-bold text-white rounded-xl text-sm shadow-md transition-all active:scale-95 text-center cursor-pointer block"
            >
              ✓ Setujui Harga & Bayar Sekarang
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-10 text-center">Loading konfirmasi...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}