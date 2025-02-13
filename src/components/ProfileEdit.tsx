import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { auth, db } from '../services/firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { updateUser } from '../features/user/userSlice'; // Redux kullanarak state güncelleme

interface ProfileEditProps {
  onClose: () => void; // Modal'ı kapatma fonksiyonu
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onClose }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();

  // Form state'leri
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || '',
  );
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [phoneNumber, setPhoneNumber] = useState(
    currentUser?.phoneNumber || '',
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Şifre giriş kutularında kopyala-yapıştır engelleme
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Kullanıcı bilgisi bulunamadı.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        // Firebase Auth Profilini Güncelle
        await updateProfile(user, { displayName, photoURL });

        // Firebase Realtime Database Güncelleme
        await update(ref(db, `users/${user.uid}`), {
          displayName,
          photoURL,
          phoneNumber,
        });

        // Şifreyi güncelle (Eğer yeni şifre girilmişse)
        if (newPassword) {
          await updatePassword(user, newPassword);
        }

        // Redux store'u güncelle
        const updatedUser = {
          ...currentUser,
          displayName,
          photoURL,
          phoneNumber,
        };
        dispatch(updateUser(updatedUser));

        alert('Profil başarıyla güncellendi!');
        onClose(); // Modal'ı kapat
      }
    } catch (error) {
      console.error('Profil güncellenirken hata oluştu:', error);
      setError('Profil güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Profili Düzenle
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Ad */}
          <div>
            <label className="block text-gray-700">Ad Soyad</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* E-posta (readonly) */}
          <div>
            <label className="block text-gray-700">E-posta</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Fotoğraf URL */}
          <div>
            <label className="block text-gray-700">Profil Fotoğrafı URL</label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Telefon Numarası */}
          <div>
            <label className="block text-gray-700">Telefon Numarası</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Yeni Şifre */}
          <div>
            <label className="block text-gray-700">Yeni Şifre</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              onPaste={handlePaste} // Kopyala yapıştırı engelle
            />
          </div>

          {/* Şifre Tekrar */}
          <div>
            <label className="block text-gray-700">Yeni Şifre (Tekrar)</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-indigo-500 focus:border-indigo-500"
              onPaste={handlePaste} // Kopyala yapıştırı engelle
            />
          </div>

          {/* Kaydet Butonu */}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
