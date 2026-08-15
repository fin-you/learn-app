'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Mock Data Pelacakan (Disesuaikan dengan struktur FedEx API Response)
const TRACKING_DATA: Record<string, any> = {
  'REQ-002': {
    id: 'REQ-002',
    model: 'Sony WH-1000XM5',
    merk: 'Sony',
    kuantitas: 1,
    sellerName: 'Budi (Jasa Titip JP)',
    country: '🇯🇵 Jepang',
    courier: 'FedEx Express (International Priority)',
    resi: '7734 9182 0419', // Format standar resi FedEx (12 digit)
    serviceType: 'FedEx International Priority®',
    estimatedDelivery: '26 Agustus 2026, 18:00 WIB',
    price: 3296700,
    fee: 329670,
    shippingFee: 35000,
    steps: [
      { id: 1, title: 'Pembayaran Dikonfirmasi', date: '18 Agt 2026, 14:30', status: 'completed' },
      { id: 2, title: 'Shipment Picked Up (FedEx Tokyo)', date: '21 Agt 2026, 11:15', status: 'completed' },
      { id: 3, title: 'In Transit - Flight Departed', date: '23 Agt 2026, 08:00', status: 'active' },
      { id: 4, title: 'Out for Delivery (FedEx Indonesia)', date: 'Estimasi 26 Agt 2026', status: 'pending' },
      { id: 5, title: 'Delivered', date: '-', status: 'pending' },
    ],
    // Log riwayat aktivitas pengiriman dari FedEx API
    timelineLogs: [
      { 
        date: '23 Agt 2026 - 08:00 WIB', 
        location: 'TOKYO - JAPAN', 
        note: 'International shipment release - In transit to destination hub (FedEx Express Flight FX-519)' 
      },
      { 
        date: '22 Agt 2026 - 19:45 WIB', 
        location: 'NARITA HARBOR - JAPAN', 
        note: 'At FedEx International Location / Clearance in progress' 
      },
      { 
        date: '21 Agt 2026 - 11:15 WIB', 
        location: 'GINZA, TOKYO - JAPAN', 
        note: 'Picked up by FedEx Courier' 
      },
      { 
        date: '18 Agt 2026 - 14:30 WIB', 
        location: 'JAKARTA - INDONESIA', 
        note: 'Shipment information sent to FedEx / Payment confirmed' 
      },
    ]
  }
};

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const reqId = searchParams.get('id') || 'REQ-002';

  // Ambil data berdasarkan ID atau fallback ke REQ-002
  const data = TRACKING_DATA[reqId] || TRACKING_DATA['REQ-002'];
  const totalBiaya = data.price + data.fee + data.shippingFee;

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Back */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-950 transition-colors gap-2"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Card Header Info Pesanan & FedEx Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                FedEx Express Active Track
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {data.id}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 mt-2">{data.model}</h1>
            <p className="text-sm text-slate-600 mt-1">
              Seller: <span className="font-medium text-slate-900">{data.sellerName}</span> ({data.country})
            </p>
          </div>

          <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto border-slate-100">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Nomor Resi FedEx</p>
            <p className="text-xl font-mono font-extrabold text-slate-900 mt-0.5 tracking-wide">{data.resi}</p>
            <p className="text-xs text-purple-700 font-semibold mt-1">{data.serviceType}</p>
          </div>
        </div>

        {/* Timeline Status Visual (Step Indicator) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-950">Status Pelacakan Pesanan</h2>
            <p className="text-xs text-slate-500">
              Estimasi Tiba: <span className="font-semibold text-slate-800">{data.estimatedDelivery}</span>
            </p>
          </div>
          
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 py-2">
            {data.steps.map((step: any) => (
              <div key={step.id} className="relative pl-8">
                {/* Bullet Node */}
                <div
                  className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                    step.status === 'completed'
                      ? 'bg-brand-green border-brand-green text-white'
                      : step.status === 'active'
                      ? 'bg-purple-600 border-purple-600 text-white ring-4 ring-purple-100'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                >
                  {step.status === 'completed' ? '✓' : step.id}
                </div>

                <div>
                  <h3 className={`text-base font-bold ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-950'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Riwayat (Logs dari FedEx API) & Ringkasan Biaya */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Timeline Log Detail */}
          <div className="md:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-950">Riwayat Perjalanan (FedEx Activity Log)</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono">
                API Live Sync
              </span>
            </div>
            
            <div className="space-y-4">
              {data.timelineLogs.map((log: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-700">
                    <span>{log.location}</span>
                    <span className="text-slate-400 font-normal">{log.date}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">{log.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md h-fit space-y-4">
            <h2 className="text-xl font-bold text-slate-950 pb-2 border-b border-slate-100">Rincian Pembayaran</h2>
            <div className="space-y-2.5 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Harga Barang</span>
                <span className="font-semibold text-slate-900">{formatRupiah(data.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Jastip</span>
                <span className="font-semibold text-slate-900">{formatRupiah(data.fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim FedEx</span>
                <span className="font-semibold text-slate-900">{formatRupiah(data.shippingFee)}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base font-bold text-slate-950">
                <span>Total Biaya</span>
                <span className="text-brand-green text-lg">{formatRupiah(totalBiaya)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <button 
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all text-center shadow-sm active:scale-95"
                onClick={() => alert('Hubungi Seller Jastip via Chat')}
              >
                💬 Hubungi Seller
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}