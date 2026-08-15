'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync form data with user from context
  useEffect(() => {
    if (isLoaded) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [isLoaded, user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Hanya file gambar (JPG, PNG, WebP) yang diperbolehkan.');
      return;
    }

    // Check size limit (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Ukuran foto terlalu besar. Maksimal 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    setPhotoError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simpan ke UserContext & localStorage
    updateUser({
      fullName: formData.fullName.trim() || 'User',
      phone: formData.phone.trim(),
      avatarUrl: avatarUrl,
    });

    setSavedSuccess(true);

    setTimeout(() => {
      router.push('/');
    }, 600);
  };

  const avatarLetter = (formData.fullName.trim().charAt(0).toUpperCase()) || 'U';

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Perbarui informasi profil dan foto akun Anda
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
            {user.role || 'Buyer'}
          </span>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Profil berhasil disimpan! Mengalihkan ke Dashboard...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bagian Foto Profil */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Foto Profil
            </label>
            <div className="flex items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-emerald-100/70 border-2 border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Preview Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-slate-800">
                    {avatarLetter}
                  </span>
                )}
              </div>

              {/* Tombol Upload & Remove */}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="avatar-upload-input"
                />
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="avatar-upload-input"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {avatarUrl ? 'Ganti Foto' : 'Unggah Foto'}
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  Format JPG, PNG, atau WebP (Maks. 2MB)
                </p>
                {photoError && (
                  <p className="text-xs text-rose-600 font-medium">{photoError}</p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Input Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              required
            />
          </div>

          {/* Input Phone Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Contoh: 081234567890"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              required
            />
          </div>

          {/* Actions Button */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-1/2 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-1/2 bg-slate-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.99]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}