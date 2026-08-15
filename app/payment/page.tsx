'use client';

import { useState, useEffect, ChangeEvent, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PaymentContent() {
  const searchParams = useSearchParams();
  const reqId = searchParams.get('id') || 'REQ-001';

  const [itemData, setItemData] = useState({
    id: reqId,
    model: 'Matcha Powder Uji Premium 100g',
    sellerName: 'Budi Santoso',
    country: '🇯🇵 Jepang',
    price: 265000,
    fee: 26500,
    shippingFee: 20000,
    status: 'accepted',
    photoUrl: undefined as string | undefined,
  });

  const [bankAccount, setBankAccount] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State alur pembayaran
  const [isPaid, setIsPaid] = useState(false);

  // Ambil data barang dari localStorage berdasarkan ID
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
            sellerName: found.sellerName || 'Budi Santoso',
            country: found.country || '🇯🇵 Jepang',
            price: found.price || 265000,
            fee: found.fee || Math.round((found.price || 265000) * 0.1),
            shippingFee: found.shippingFee || 20000,
            status: found.status || 'accepted',
            photoUrl: found.photoUrl,
          });
        }
      }
    } catch (e) {
      console.error('Error loading request item for payment:', e);
    }
  }, [reqId]);

  const totalPayment = itemData.price + itemData.fee + itemData.shippingFee;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler Submit Pembayaran: Mengubah status dari 'accepted' menjadi 'purchased' di localStorage
  const handleSubmitPayment = (e: FormEvent) => {
    e.preventDefault();
    if (!bankAccount || !proofFile) {
      alert('Mohon lengkapi nomor rekening dan unggah bukti transfer terlebih dahulu.');
      return;
    }

    try {
      const saved = localStorage.getItem('jastip_buyer_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((item: any) => {
          if (item.id === itemData.id) {
            // Ubah status dari accepted menjadi purchased
            return { ...item, status: 'purchased' };
          }
          return item;
        });
        localStorage.setItem('jastip_buyer_requests', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Gagal memperbarui status ke purchased di localStorage:', err);
    }

    setIsPaid(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-brand-green text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              ID: {itemData.id}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              {isPaid ? 'Pembayaran Berhasil Diproses' : 'Form Pembayaran Buyer'}
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              {isPaid 
                ? 'Status pesanan Anda telah diperbarui menjadi Purchased (Sedang Diproses Seller).' 
                : 'Selesaikan pembayaran transfer bank untuk memproses pembelian barang titipan Anda.'}
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-brand-green transition-colors">
            ← Kembali ke Dashboard
          </Link>
        </div>

        {!isPaid ? (
          /* FASE 1: FORM PEMBAYARAN */
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            
            {/* Informasi Barang & Rekening Tujuan Seller */}
            <div className="p-5 bg-brand-green-light/70 border border-emerald-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-4 border-b border-emerald-200/80 pb-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  {itemData.photoUrl ? (
                    <img src={itemData.photoUrl} alt={itemData.model} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="grow flex justify-between items-start">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">Barang Titipan</p>
                    <p className="text-base font-bold text-slate-950">{itemData.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-semibold">Seller Tujuan</p>
                    <p className="text-sm font-bold text-slate-900">{itemData.sellerName} ({itemData.country})</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <div>
                  <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Rekening Bank Tujuan (Seller)</p>
                  <p className="text-lg font-extrabold text-slate-950">BCA - 8820 1923 881</p>
                  <p className="text-xs text-slate-600">a.n. {itemData.sellerName} (Jastip Seller)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold">Total Tagihan Final</p>
                  <p className="text-2xl font-black text-brand-green">{formatRupiah(totalPayment)}</p>
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
                placeholder="Contoh: BCA - 5220 1234 56 a.n Budi / Mandiri - 1370012345678"
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

            {/* Keterangan Perubahan Status */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
              <p className="font-bold">✓ Konfirmasi Pembayaran & Pembaruan Status:</p>
              <p>
                Setelah Anda mengirim bukti pembayaran, status barang ini akan otomatis diperbarui dari <strong>Accepted</strong> menjadi <strong>Purchased</strong> di sistem dan siap dibelikan oleh seller di negara tujuan.
              </p>
            </div>

            {/* Tombol Submit Pembayaran */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-4 bg-brand-green hover:opacity-90 font-bold rounded-2xl text-white transition-all shadow-lg active:scale-95 cursor-pointer text-lg tracking-tight"
              >
                Kirim Bukti Pembayaran & Ubah Status ke Purchased
              </button>
            </div>
          </form>
        ) : (
          /* FASE 2: STATUS PESANAN (PURCHASED) */
          <div className="space-y-6">
            
            {/* Banner Sukses Pembayaran */}
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-5">
              <div className="w-14 h-14 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-2xl shrink-0 shadow-md">
                ✓
              </div>
              <div>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider inline-block mb-1">
                  Status: Purchased
                </span>
                <h3 className="text-xl font-extrabold text-slate-950">Pembayaran Terverifikasi & Pesanan Dibeli!</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Barang <strong>{itemData.model}</strong> telah diubah statusnya menjadi <strong>Purchased</strong>.
                </p>
              </div>
            </div>

            {/* Rincian Keterangan Status saat ini */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detail Status Terakhir</p>
                <span className="text-xs font-mono text-slate-500">ID: {itemData.id}</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Barang Sedang Dibelikan & Diproses oleh Seller</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Seller <strong>{itemData.sellerName}</strong> sedang membelikan pesanan Anda di {itemData.country}. Anda dapat memantau estimasi tiba dan proses pengiriman secara berkala.
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-500 border-t border-slate-200">
                Pengirim Rekening: <span className="font-semibold text-slate-800">{bankAccount}</span> • Total: <span className="font-semibold text-brand-green">{formatRupiah(totalPayment)}</span>
              </div>
            </div>

            {/* Tombol Aksi Lacak dan Kembali ke Dashboard */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/tracking?id=${itemData.id}`}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-center rounded-xl text-sm transition-all shadow-md active:scale-95"
              >
                📦 Lacak Status Pengiriman (Tracking)
              </Link>
              <Link
                href="/"
                className="flex-1 py-3.5 bg-brand-green hover:opacity-90 text-white font-bold text-center rounded-xl text-sm transition-all shadow-md active:scale-95"
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-10 text-center">Loading pembayaran...</div>}>
      <PaymentContent />
    </Suspense>
  );
}