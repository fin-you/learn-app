'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export interface RequestItem {
  id: string;
  model: string;
  merk: string;
  kuantitas: number;
  sellerName: string;
  country: string;
  status: 'pending' | 'accepted' | 'purchased' | 'rejected' | 'cancelled';
  price: number;
  fee: number;
  shippingFee: number;
  photoUrl?: string;
  alamat?: string;
  catatan?: string;
}

// Mock Data Awal dengan Foto Produk Asli
const INITIAL_REQUESTS: RequestItem[] = [
  {
    id: 'REQ-000',
    model: 'Nintendo Switch OLED Joy-Con Red/Blue',
    merk: 'Nintendo',
    kuantitas: 1,
    sellerName: 'Budi Santoso',
    country: '🇯🇵 Jepang',
    status: 'pending',
    price: 4500000,
    fee: 450000,
    shippingFee: 40000,
    photoUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'REQ-001',
    model: 'Matcha Powder Uji Premium 100g',
    merk: 'Ito En',
    kuantitas: 2,
    sellerName: 'Budi Santoso',
    country: '🇯🇵 Jepang',
    status: 'accepted',
    price: 265000,
    fee: 26500,
    shippingFee: 20000,
    photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'REQ-002',
    model: 'Sony WH-1000XM5',
    merk: 'Sony',
    kuantitas: 1,
    sellerName: 'Budi Santoso',
    country: '🇯🇵 Jepang',
    status: 'purchased',
    price: 3296700,
    fee: 329670,
    shippingFee: 35000,
    photoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'REQ-003',
    model: 'MacBook Air M3 13 Inch',
    merk: 'Apple',
    kuantitas: 1,
    sellerName: 'Siti Rahma',
    country: '🇸🇬 Singapura',
    status: 'rejected',
    price: 15999000,
    fee: 1599900,
    shippingFee: 50000,
    photoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'REQ-004',
    model: 'PlayStation 5 Slim Digital Edition',
    merk: 'Sony',
    kuantitas: 1,
    sellerName: 'Andi Wijaya',
    country: '🇰🇷 Korea Selatan',
    status: 'cancelled',
    price: 7200000,
    fee: 720000,
    shippingFee: 60000,
    photoUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&auto=format&fit=crop&q=80',
  },
];

export const SELLER_TRIPS = [
  { id: 1, seller: 'Budi Santoso', country: '🇯🇵 Jepang', flag: '🇯🇵', departure: '20 Agustus 2026', returnDate: '28 Agustus 2026', status: 'Aktif' },
  { id: 2, seller: 'Siti Rahma', country: '🇸🇬 Singapura', flag: '🇸🇬', departure: '22 Agustus 2026', returnDate: '25 Agustus 2026', status: 'Aktif' },
  { id: 3, seller: 'Andi Wijaya', country: '🇰🇷 Korea Selatan', flag: '🇰🇷', departure: '01 September 2026', returnDate: '10 September 2026', status: 'Mendatang' },
];

export default function BuyerDashboard() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load data dari localStorage saat mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('jastip_buyer_requests');
    if (savedRequests) {
      try {
        const parsed = JSON.parse(savedRequests);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Pastikan item mock lama mendapatkan photoUrl jika belum ada
          const merged = parsed.map((item: RequestItem) => {
            if (!item.photoUrl) {
              const mockMatch = INITIAL_REQUESTS.find((m) => m.id === item.id);
              if (mockMatch?.photoUrl) {
                return { ...item, photoUrl: mockMatch.photoUrl };
              }
            }
            return item;
          });
          setRequests(merged);
        } else {
          setRequests(INITIAL_REQUESTS);
          localStorage.setItem('jastip_buyer_requests', JSON.stringify(INITIAL_REQUESTS));
        }
      } catch (e) {
        console.error('Gagal memuat request dari localStorage:', e);
        setRequests(INITIAL_REQUESTS);
      }
    } else {
      setRequests(INITIAL_REQUESTS);
      localStorage.setItem('jastip_buyer_requests', JSON.stringify(INITIAL_REQUESTS));
    }
    setIsLoaded(true);
  }, []);

  // Update localStorage dan state
  const updateRequests = (newRequests: RequestItem[]) => {
    setRequests(newRequests);
    localStorage.setItem('jastip_buyer_requests', JSON.stringify(newRequests));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handler: Buyer membatalkan request (mengubah status accepted -> cancelled)
  const handleCancelRequest = (id: string) => {
    const isConfirmed = window.confirm('Apakah Anda yakin ingin membatalkan request ini karena harga yang diajukan tidak sesuai?');
    if (!isConfirmed) return;

    const updated = requests.map((item) => {
      if (item.id === id) {
        return { ...item, status: 'cancelled' as const };
      }
      return item;
    });

    updateRequests(updated);
    showToast('🚫 Request berhasil dibatalkan (Status diubah menjadi Cancelled).');
  };

  // Handler: Simulasi seller menyetujui request (pending -> accepted) & mengajukan penawaran harga
  const handleSimulateSellerAccept = (id: string) => {
    const updated = requests.map((item) => {
      if (item.id === id) {
        const agreedPrice = item.price > 0 ? item.price : 450000;
        const fee = Math.round(agreedPrice * 0.1);
        const shippingFee = 25000;
        return {
          ...item,
          status: 'accepted' as const,
          price: agreedPrice,
          fee: fee,
          shippingFee: shippingFee,
        };
      }
      return item;
    });

    updateRequests(updated);
    showToast('✅ Simulasi: Seller telah menerima request & mengajukan harga (Status: Accepted).');
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-brand-green animate-ping"></span>
          Memuat data titipan lokal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-sm font-medium animate-bounce transition-all">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-brand-green text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-brand-green"></span>
              Jastip Buyer Dashboard
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">Dashboard Titip Beli</h1>
            <p className="text-slate-600 mt-1 text-base md:text-lg">
              Kelola request barang titipan, pantau status konfirmasi seller, dan jadwal trip jastip.
            </p>
          </div>
          <div>
            <Link
              href="/request"
              className="inline-flex items-center justify-center px-7 py-4 bg-brand-green hover:opacity-90 font-bold rounded-2xl text-white transition-all shadow-md active:scale-95 text-base gap-2"
            >
              <span className="text-xl leading-none">+</span> Buat Request Barang
            </Link>
          </div>
        </div>

        {/* Status Request Barang Anda */}
        <div className="space-y-6" id="status">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Daftar Titipan & Status Request</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Total {requests.length} barang titipan tersimpan di penyimpanan lokal.
              </p>
            </div>
            
            {/* Filter / Quick Reset Mock */}
            <button
              onClick={() => {
                if (window.confirm('Reset data titipan ke data bawaan (mock)?')) {
                  updateRequests(INITIAL_REQUESTS);
                  showToast('Data titipan telah di-reset ke data awal.');
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline self-start sm:self-auto cursor-pointer"
            >
              ↺ Reset Data Demo
            </button>
          </div>
          
          <div className="space-y-5">
            {requests.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 text-2xl font-bold">
                  📦
                </div>
                <h3 className="text-lg font-bold text-slate-800">Belum ada request titipan barang</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Kirim request titip beli pertamamu ke seller untuk memulai jastip barang luar negeri impianmu.
                </p>
                <Link
                  href="/request"
                  className="inline-block px-6 py-2.5 bg-brand-green text-white font-semibold rounded-xl text-sm hover:opacity-90 transition-all shadow-sm"
                >
                  + Buat Request Sekarang
                </Link>
              </div>
            ) : (
              requests.map((item) => {
                const totalBiaya = item.price + item.fee + item.shippingFee;

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-3xl p-6 md:p-8 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row gap-6 justify-between items-start md:items-center ${
                      item.status === 'cancelled'
                        ? 'border-slate-200 bg-slate-50/50 opacity-80'
                        : item.status === 'pending'
                        ? 'border-amber-200 ring-1 ring-amber-100'
                        : item.status === 'accepted'
                        ? 'border-emerald-200 ring-1 ring-emerald-100'
                        : 'border-slate-100'
                    }`}
                  >
                    
                    {/* Informasi Barang & Foto Gambar Aktual */}
                    <div className="flex items-start gap-5 w-full md:w-auto">
                      <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center border shrink-0 bg-slate-100 ${
                        item.status === 'cancelled'
                          ? 'border-slate-300'
                          : 'border-slate-200 shadow-xs'
                      }`}>
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.model}
                            className={`w-full h-full object-cover transition-all ${
                              item.status === 'cancelled' ? 'grayscale opacity-60' : 'hover:scale-105'
                            }`}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-3 text-center text-slate-400">
                            <span className="text-3xl">🛍️</span>
                            <span className="text-[10px] mt-1 font-semibold text-slate-400">No Image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grow space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className={`text-xl font-bold tracking-tight ${item.status === 'cancelled' ? 'text-slate-600 line-through' : 'text-slate-950'}`}>
                            {item.model}
                          </h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {`x${item.kuantitas}`}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600">
                          Merk: <span className="text-slate-900 font-semibold">{item.merk}</span>
                        </p>
                        <p className="text-xs font-mono text-slate-400">
                          ID: {item.id}
                        </p>
                        
                        <div className="mt-2 text-xs text-slate-500 space-y-0.5 pt-2 border-t border-slate-100">
                          <p>Seller: <span className="text-slate-800 font-medium">{item.sellerName}</span></p>
                          <p>Negara Trip: <span className="text-slate-800 font-medium">{item.country}</span></p>
                          {item.alamat && (
                            <p className="truncate max-w-sm text-slate-400">Alamat: {item.alamat}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sisi Kanan: Badge Status, Total Harga, & Tombol Aksi */}
                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto shrink-0">
                      
                      {/* Tag Status */}
                      {item.status === 'pending' && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending (Butuh Konfirmasi)
                        </span>
                      )}
                      {item.status === 'accepted' && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Accepted (Harga Disetujui Seller)
                        </span>
                      )}
                      {item.status === 'purchased' && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                          Purchased
                        </span>
                      )}
                      {item.status === 'rejected' && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                          Rejected
                        </span>
                      )}
                      {item.status === 'cancelled' && (
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300 uppercase tracking-wider">
                          Cancelled
                        </span>
                      )}

                      {/* Total Biaya */}
                      <div className="text-left md:text-right mt-1">
                        <p className="text-xs text-slate-500 font-medium">Estimasi Tagihan / Total Biaya</p>
                        {totalBiaya > 0 ? (
                          <>
                            <p className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                              item.status === 'cancelled' ? 'text-slate-400 line-through' : 'text-brand-green'
                            }`}>
                              {formatRupiah(totalBiaya)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {`Barang: ${formatRupiah(item.price)} • Fee: ${formatRupiah(item.fee)} • Ongkir: ${formatRupiah(item.shippingFee)}`}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-bold text-amber-700 mt-0.5">
                            Menunggu Penawaran Harga Seller
                          </p>
                        )}
                      </div>

                      {/* Tombol / Keterangan Aksi Berdasarkan Status */}
                      <div className="mt-2 w-full md:w-auto space-y-2">
                        
                        {/* 1. Status: PENDING */}
                        {item.status === 'pending' && (
                          <div className="space-y-2">
                            <div className="text-xs text-amber-800 bg-amber-50 px-3.5 py-2.5 rounded-xl border border-amber-200 text-left md:text-right">
                              ⏳ <strong>Request Terkirim</strong> (Menunggu konfirmasi & penawaran harga dari seller)
                            </div>
                            
                            {/* Tombol Simulasi untuk memudahkan testing alur pengujian */}
                            <button
                              onClick={() => handleSimulateSellerAccept(item.id)}
                              className="w-full text-center px-3.5 py-1.5 bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 text-xs font-semibold rounded-lg border border-amber-300 transition-colors cursor-pointer"
                              title="Simulasi jika seller menerima request dan mengajukan rincian harga"
                            >
                              ⚡ Simulasi Seller Terima & Beri Harga
                            </button>
                          </div>
                        )}

                        {/* 2. Status: ACCEPTED (Ada tombol Batalkan Request jika harga tidak sesuai) */}
                        {item.status === 'accepted' && (
                          <div className="flex flex-col sm:flex-row gap-2.5">
                            <Link
                              href={`/confirmation?id=${item.id}`}
                              className="inline-flex items-center justify-center text-center px-5 py-2.5 bg-brand-green hover:opacity-90 text-white font-bold rounded-xl text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              ✓ Konfirmasi Harga & Bayar
                            </Link>
                            
                            {/* Tombol Pembatalan Request */}
                            <button
                              onClick={() => handleCancelRequest(item.id)}
                              className="inline-flex items-center justify-center text-center px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-sm transition-all border border-rose-200 active:scale-95 cursor-pointer"
                              title="Batalkan request jika harga yang diajukan seller tidak cocok"
                            >
                              ✕ Batalkan Request
                            </button>
                          </div>
                        )}

                        {/* 3. Status: PURCHASED */}
                        {item.status === 'purchased' && (
                          <Link
                            href={`/tracking?id=${item.id}`}
                            className="block text-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95"
                          >
                            📦 Lacak Status Pesanan
                          </Link>
                        )}

                        {/* 4. Status: REJECTED */}
                        {item.status === 'rejected' && (
                          <p className="text-xs text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl border border-rose-200 text-center md:text-right">
                            ❌ Request ditolak oleh seller
                          </p>
                        )}

                        {/* 5. Status: CANCELLED */}
                        {item.status === 'cancelled' && (
                          <div className="text-xs text-slate-600 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-left md:text-right space-y-1">
                            <p className="font-semibold text-slate-700">🚫 Dibatalkan (Harga Tidak Sesuai)</p>
                            <p className="text-[11px] text-slate-500">Request telah dibatalkan oleh buyer.</p>
                          </div>
                        )}

                      </div>

                    </div>
                  
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Jadwal Trip Seller Per Negara */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Jadwal Trip Seller Per Negara</h2>
              <p className="text-slate-500 text-sm mt-0.5">Pilih seller jastip aktif yang sedang atau akan bepergian.</p>
            </div>
            <span className="text-xs px-3.5 py-1 rounded-full bg-emerald-50 text-brand-green font-bold border border-emerald-200 self-start sm:self-auto">
              Verified Jastip Sellers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SELLER_TRIPS.map((trip) => (
              <div key={trip.id} className="p-6 bg-brand-green-light/60 border border-emerald-200 rounded-2xl flex flex-col justify-between hover:border-brand-green-pastel transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{trip.flag}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                      trip.status === 'Aktif' ? 'bg-emerald-100 text-brand-green border border-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">{trip.country}</h3>
                  <p className="text-sm text-slate-700 mt-1.5">Seller: <span className="text-slate-950 font-bold">{trip.seller}</span></p>
                  
                  <div className="mt-5 pt-4 border-t border-emerald-200/80 text-xs text-slate-600 space-y-1.5">
                    <p>🛫 <span className="font-medium text-slate-800">Berangkat:</span> {trip.departure}</p>
                    <p>🛬 <span className="font-medium text-slate-800">Kembali:</span> {trip.returnDate}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/request?seller=${encodeURIComponent(trip.seller)}&country=${encodeURIComponent(trip.country)}`}
                    className="w-full py-2.5 bg-white hover:bg-emerald-50 text-brand-green border border-emerald-300 text-center rounded-xl text-sm font-bold transition-colors inline-block shadow-sm"
                  >
                    Request ke Seller Ini →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      
      </div>

    </div>
  );
}