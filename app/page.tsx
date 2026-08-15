'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock Data Request Buyer
const INITIAL_REQUESTS = [
  {
    id: 'REQ-000',
    model: 'Nintendo Switch OLED Joy-Con Red/Blue',
    merk: 'Nintendo',
    kuantitas: 1,
    sellerName: 'Budi (Jasa Titip JP)',
    country: '🇯🇵 Jepang',
    status: 'pending', // 'pending' | 'accepted' | 'purchased' | 'rejected' | 'cancelled'
    price: 4500000,
    fee: 450000,
    shippingFee: 40000,
  },
  {
    id: 'REQ-001',
    model: 'Matcha Powder Uji Premium 100g',
    merk: 'Ito En',
    kuantitas: 2,
    sellerName: 'Budi (Jasa Titip JP)',
    country: '🇯🇵 Jepang',
    status: 'accepted',
    price: 265000,
    fee: 26500,
    shippingFee: 20000,
  },
  {
    id: 'REQ-002',
    model: 'Sony WH-1000XM5',
    merk: 'Sony',
    kuantitas: 1,
    sellerName: 'Budi (Jasa Titip JP)',
    country: '🇯🇵 Jepang',
    status: 'purchased',
    price: 3296700,
    fee: 329670,
    shippingFee: 35000,
  },
  {
    id: 'REQ-003',
    model: 'MacBook Air M3',
    merk: 'Apple',
    kuantitas: 1,
    sellerName: 'Siti (SG Express)',
    country: '🇸🇬 Singapura',
    status: 'rejected',
    price: 15999000,
    fee: 1599900,
    shippingFee: 50000,
  },
  {
    id: 'REQ-004',
    model: 'PlayStation 5 Slim Digital',
    merk: 'Sony',
    kuantitas: 1,
    sellerName: 'Andi (Korea Jastip)',
    country: '🇰🇷 Korea Selatan',
    status: 'cancelled',
    price: 7200000,
    fee: 720000,
    shippingFee: 60000,
  },
];

const SELLER_TRIPS = [
  { id: 1, seller: 'Budi Santoso', country: '🇯🇵 Jepang', flag: '🇯🇵', departure: '20 Agustus 2026', returnDate: '28 Agustus 2026', status: 'Aktif' },
  { id: 2, seller: 'Siti Rahma', country: '🇸🇬 Singapura', flag: '🇸🇬', departure: '22 Agustus 2026', returnDate: '25 Agustus 2026', status: 'Aktif' },
  { id: 3, seller: 'Andi Wijaya', country: '🇰🇷 Korea Selatan', flag: '🇰🇷', departure: '01 September 2026', returnDate: '10 September 2026', status: 'Mendatang' },
];

export default function BuyerDashboard() {
  const [requests] = useState(INITIAL_REQUESTS);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-8 bg-white p-6 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Dashboard Buyer</h1>
            <p className="text-slate-600 mt-1.5 text-lg">Kelola request barang dan pantau jadwal trip seller.</p>
          </div>
          <Link
            href="/request"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand-green hover:opacity-90 font-semibold rounded-xl text-white transition-all shadow-md active:scale-95 text-lg"
          >
            {"+ Buat Request Barang"}
          </Link>
        </div>

        {/* Status Request Barang Anda */}
        <div className="space-y-6" id="status">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Titipan & Status Request</h2>
          
          <div className="space-y-6">
            {requests.map((item) => {
              const totalBiaya = item.price + item.fee + item.shippingFee;

              return (
                <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  
                  {/* Informasi Barang */}
                  <div className="flex items-start gap-5 w-full md:w-auto">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-mono text-xs border border-slate-200 shrink-0">
                      IMG
                    </div>
                    
                    <div className="grow">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <h3 className="text-xl font-bold text-slate-950 tracking-tight">{item.model}</h3>
                        <span className="text-sm px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {`x${item.kuantitas}`}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600 mt-1">Merk: <span className="text-slate-800 font-medium">{item.merk}</span></p>
                      <p className="text-sm text-slate-600 mt-1">ID: <span className="font-mono text-slate-500 text-xs">{item.id}</span></p>
                      
                      <div className="mt-3 text-sm text-slate-500 space-y-0.5">
                        <p>Seller: <span className="text-slate-700 font-medium">{item.sellerName}</span></p>
                        <p>Negara: <span className="text-slate-700 font-medium">{item.country}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Sisi Kanan: Badge Status, Total Harga, & Tombol Aksi */}
                  <div className="flex flex-col items-start md:items-end gap-3.5 w-full md:w-auto shrink-0">
                    
                    {/* Tag Status */}
                    {item.status === 'pending' && (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Pending
                      </span>
                    )}
                    {item.status === 'accepted' && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-brand-green-light text-brand-green border border-emerald-200 uppercase tracking-wider">
                        Accepted
                      </span>
                    )}
                    {item.status === 'purchased' && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider">
                        Purchased
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">
                        Rejected
                      </span>
                    )}
                    {item.status === 'cancelled' && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                        Cancelled
                      </span>
                    )}

                    {/* Total Biaya */}
                    <div className="text-left md:text-right mt-1">
                      <p className="text-sm text-slate-500">Estimasi Total Biaya</p>
                      <p className="text-3xl font-extrabold text-brand-green tracking-tight">
                        {formatRupiah(totalBiaya)}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {`Barang: ${formatRupiah(item.price)} • Fee Jastip: ${formatRupiah(item.fee)}`}
                      </p>
                    </div>

                    {/* Tombol / Keterangan Aksi Berdasarkan Status */}
                    <div className="mt-2 w-full md:w-auto">
                      {item.status === 'pending' && (
                        <p className="text-xs text-amber-800 bg-amber-50/80 px-3 py-2 rounded-lg border border-amber-200/60 text-center md:text-right">
                          ⏳ Request sudah masuk
                        </p>
                      )}

                      {item.status === 'accepted' && (
                        <Link
                          href={`/confirmation?id=${item.id}`}
                          className="block text-center px-5 py-2.5 bg-brand-green hover:opacity-90 text-white font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95"
                        >
                          ✓ Lihat Konfirmasi Harga & Bayar
                        </Link>
                      )}

                      {item.status === 'purchased' && (
                        <Link
                          href={`/tracking?id=${item.id}`}
                          className="block text-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-sm active:scale-95"
                        >
                          📦 Lacak Status Pesanan
                        </Link>
                      )}

                      {item.status === 'rejected' && (
                        <p className="text-xs text-rose-700 bg-rose-50/80 px-3 py-2 rounded-lg border border-rose-200/60 text-center md:text-right">
                          ❌ Request ditolak oleh seller
                        </p>
                      )}

                      {item.status === 'cancelled' && (
                        <p className="text-xs text-slate-600 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200/60 text-center md:text-right">
                          🚫 Dibatalkan (Harga Tidak Sesuai)
                        </p>
                      )}
                    </div>

                  </div>
                
                </div>
              );
            })}
          </div>
        </div>

        {/* Jadwal Trip Seller Per Negara */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Jadwal Trip Seller Per Negara</h2>
            <span className="text-sm px-4 py-1 rounded-full bg-brand-green-light text-brand-green font-medium">
              Temukan Jastip Sesuai Kebutuhan Anda
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SELLER_TRIPS.map((trip) => (
              <div key={trip.id} className="p-6 bg-brand-green-light border border-emerald-200 rounded-2xl flex flex-col justify-between hover:border-brand-green-pastel transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{trip.flag}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${trip.status === 'Aktif' ? 'bg-emerald-100 text-brand-green' : 'bg-slate-100 text-slate-600'}`}>
                      {trip.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">{trip.country}</h3>
                  <p className="text-sm text-slate-700 mt-1.5">Seller: <span className="text-slate-950 font-semibold">{trip.seller}</span></p>
                  
                  <div className="mt-5 pt-4 border-t border-emerald-200 text-sm text-slate-600 space-y-1.5">
                    <p>🛫 <span className="font-medium text-slate-800">Berangkat:</span> {trip.departure}</p>
                    <p>🛬 <span className="font-medium text-slate-800">Kembali:</span> {trip.returnDate}</p>
                  </div>
                </div>

                <Link
                  href={`/request?seller=${encodeURIComponent(trip.seller)}&country=${encodeURIComponent(trip.country)}`}
                  className="mt-6 w-full py-2.5 bg-white hover:bg-emerald-50 text-brand-green border border-emerald-300 text-center rounded-xl text-sm font-semibold transition-colors inline-block"
                >
                  Request ke Seller Ini
                </Link>
              </div>
            ))}
          </div>
        </div>
      
      </div>
    </div>
  );
}