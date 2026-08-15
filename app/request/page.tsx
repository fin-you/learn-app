'use client';

import { useState, useEffect, ChangeEvent, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Daftar Seller Jastip Aktif yang Tersedia
const AVAILABLE_SELLERS = [
  { id: 'budi', seller: 'Budi Santoso', country: '🇯🇵 Jepang', departure: '20 Agt 2026', returnDate: '28 Agt 2026' },
  { id: 'siti', seller: 'Siti Rahma', country: '🇸🇬 Singapura', departure: '22 Agt 2026', returnDate: '25 Agt 2026' },
  { id: 'andi', seller: 'Andi Wijaya', country: '🇰🇷 Korea Selatan', departure: '01 Sep 2026', returnDate: '10 Sep 2026' },
];

function RequestFormContent() {
  const searchParams = useSearchParams();
  const sellerParam = searchParams.get('seller');
  const countryParam = searchParams.get('country');

  // Cari default seller dari URL query atau default ke opsi pertama
  const initialSeller = AVAILABLE_SELLERS.find((s) => s.seller === sellerParam) || AVAILABLE_SELLERS[0];

  const [formData, setFormData] = useState({
    model: '',
    merk: '',
    kuantitas: 1,
    photo: null as File | null,
    alamat: '',
    sellerName: initialSeller.seller,
    country: initialSeller.country,
    estimatedPrice: '',
  });

  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync jika query params berubah
  useEffect(() => {
    if (sellerParam) {
      const match = AVAILABLE_SELLERS.find((s) => s.seller === sellerParam);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          sellerName: match.seller,
          country: match.country,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          sellerName: sellerParam,
          country: countryParam || prev.country,
        }));
      }
    }
  }, [sellerParam, countryParam]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler dropdown pemilihan seller: otomatis set negara trip
  const handleSellerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSellerName = e.target.value;
    const selectedSellerObj = AVAILABLE_SELLERS.find((s) => s.seller === selectedSellerName);
    
    setFormData((prev) => ({
      ...prev,
      sellerName: selectedSellerName,
      country: selectedSellerObj ? selectedSellerObj.country : prev.country,
    }));
  };

  // Baca file gambar dan konversi ke Base64 Data URL agar bisa tersimpan persisten di localStorage
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        setPhotoDataUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const rawPrice = parseFloat(formData.estimatedPrice) || 0;
    const fee = rawPrice > 0 ? Math.round(rawPrice * 0.1) : 0;
    const shippingFee = rawPrice > 0 ? 30000 : 0;

    const newRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      model: formData.model,
      merk: formData.merk,
      kuantitas: Number(formData.kuantitas) || 1,
      sellerName: formData.sellerName,
      country: formData.country,
      status: 'pending' as const, // Status awal pending karena butuh konfirmasi dari seller
      price: rawPrice,
      fee: fee,
      shippingFee: shippingFee,
      alamat: formData.alamat,
      photoUrl: photoDataUrl || undefined, // Gambar aktual disimpan dalam format base64
    };

    // Simpan ke localStorage
    try {
      const existing = localStorage.getItem('jastip_buyer_requests');
      const list = existing ? JSON.parse(existing) : [];
      const updatedList = [newRequest, ...(Array.isArray(list) ? list : [])];
      localStorage.setItem('jastip_buyer_requests', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Form Request Titip Barang</h1>
            <p className="text-slate-600 text-base md:text-lg mt-1.5">
              Pilih seller jastip tujuan dan sertakan foto referensi barang yang ingin kamu titip beli.
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-brand-green transition-colors">
            {"← Kembali ke Dashboard"}
          </Link>
        </div>

        {isSubmitted ? (
          <div className="text-center py-12 space-y-5 bg-brand-green-light border border-emerald-200 rounded-3xl">
            <div className="w-20 h-20 bg-emerald-100 text-brand-green border-4 border-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Request Berhasil Terkirim! 🚀</h2>
            
            {photoDataUrl && (
              <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden border-2 border-brand-green shadow-md">
                <img src={photoDataUrl} alt={formData.model} className="w-full h-full object-cover" />
              </div>
            )}

            <p className="text-slate-700 text-base max-w-md mx-auto">
              Request barang <strong>{formData.model}</strong> beserta foto referensi telah tersimpan di penyimpanan lokal dengan status <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-md">Pending</span> dan diteruskan ke seller (<strong>{formData.sellerName}</strong>).
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block px-8 py-3.5 bg-brand-green hover:opacity-90 text-white font-bold rounded-2xl transition-all shadow-lg text-base"
              >
                Lihat di Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* OPSI PILIHAN SELLER (DROPDOWN OTOMATIS) */}
            <div className="p-5 bg-brand-green-light/60 border border-emerald-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-900">
                  Pilih Seller Jastip Tujuan <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs font-semibold text-brand-green bg-white px-2.5 py-1 rounded-full border border-emerald-200">
                  Tersedia Sesuai Jadwal Trip
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <select
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleSellerChange}
                    className="w-full bg-white border border-slate-300 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 font-medium focus:outline-none transition-colors cursor-pointer shadow-xs"
                  >
                    {AVAILABLE_SELLERS.map((s) => (
                      <option key={s.id} value={s.seller}>
                        {s.seller} — {s.country} ({s.departure} - {s.returnDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium">
                    <span className="text-xs text-slate-500 font-normal">Negara Pembelian:</span>
                    <span className="font-bold text-slate-950">{formData.country}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Model / Nama Barang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  placeholder="Contoh: PlayStation 5 Slim"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Merk / Brand <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="merk"
                  required
                  placeholder="Contoh: Sony"
                  value={formData.merk}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Kuantitas <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="kuantitas"
                  min="1"
                  required
                  value={formData.kuantitas}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Estimasi Harga Target Buyer (Opsional, IDR)
                </label>
                <input
                  type="number"
                  name="estimatedPrice"
                  placeholder="Contoh: 4500000"
                  value={formData.estimatedPrice}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* UNGGAH GAMBAR REFERENSI BARANG */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Foto Referensi Barang (Akan Ditampilkan di Dashboard)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-green-light file:text-brand-green cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1"
              />
              {previewUrl && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4">
                  <img
                    src={previewUrl}
                    alt="Preview Barang"
                    className="w-24 h-24 object-cover rounded-2xl border-2 border-white shadow-sm shrink-0"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">✓ Foto Barang Berhasil Dimuat</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Foto ini akan otomatis muncul pada kartu barang di daftar titipan Dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Alamat Lengkap Pengiriman Buyer <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="alamat"
                rows={3}
                required
                placeholder="Jl. Mawar No. 12, RT 01/RW 02, Kebayoran Baru, Jakarta Selatan, 12110"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 placeholder-slate-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
              <p className="font-bold">⏳ Status Pending & Konfirmasi Seller:</p>
              <p>
                Barang yang Anda request akan disimpan di penyimpanan lokal dengan status <strong>Pending</strong> sampai seller mengonfirmasi ketersediaan barang dan memberikan rincian harga final.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-4 bg-brand-green hover:opacity-90 font-bold rounded-2xl text-white transition-all shadow-lg active:scale-95 cursor-pointer text-lg tracking-tight"
              >
                Kirim Request ke Seller
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RequestFormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-10 text-center">Loading form...</div>}>
      <RequestFormContent />
    </Suspense>
  );
}