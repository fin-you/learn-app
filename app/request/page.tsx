'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';

export default function RequestFormPage() {
  const [formData, setFormData] = useState({
    model: '',
    merk: '',
    kuantitas: 1,
    photo: null as File | null,
    alamat: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Data Request Terkirim:', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Form Request Titip Barang</h1>
            <p className="text-slate-600 text-lg mt-1.5">Isi rincian barang yang ingin kamu titip beli.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-brand-green transition-colors">
            {"← Kembali ke Dashboard"}
          </Link>
        </div>

        {isSubmitted ? (
          <div className="text-center py-12 space-y-5 bg-brand-green-light border border-emerald-200 rounded-2xl">
            <div className="w-20 h-20 bg-emerald-100 text-brand-green border-4 border-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Request Berhasil Terkirim! 🚀</h2>
            <p className="text-slate-700 text-md max-w-md mx-auto">
              Request barang kamu telah diteruskan ke seller. Silakan cek status respon seller secara berkala di dashboard.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-8 py-3 bg-brand-green hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg text-lg"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Model / Nama Barang <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  required
                  placeholder="Contoh: Play Station 5 Slim"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
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
                  Photo Referensi Barang
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand-green-light file:text-brand-green cursor-pointer border border-slate-200 rounded-xl bg-slate-50 p-1"
                />
                {previewUrl && (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Preview Barang"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <p className="text-xs text-slate-500">Preview foto referensi barang yang Anda unggah.</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Alamat Lengkap Pengiriman Buyer <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="alamat"
                rows={4}
                required
                placeholder="Jl. Mawar No. 12, RT 01/RW 02, Kebayoran Baru, Jakarta Selatan, 12110"
                value={formData.alamat}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl px-4 py-3 text-slate-950 placeholder-slate-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
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