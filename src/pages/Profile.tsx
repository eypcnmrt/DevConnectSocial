import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ProfileEdit from '../components/ProfileEdit';

const Profile: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLogout = async () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Profil Alanı */}
      <div className="flex flex-1 flex-col max-w-3xl mx-auto bg-white shadow-lg">
        {/* Kapak Fotoğrafı */}
        <div className="relative h-48 bg-indigo-500"></div>

        {/* Profil İçeriği */}
        <div className="p-6 relative">
          {/* Profil Fotoğrafı */}
          <div className="absolute top-[-50px] left-6">
            <img
              src={currentUser?.photoURL || 'https://via.placeholder.com/150'}
              alt="Profil Resmi"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          {/* Kullanıcı Bilgileri */}
          <div className="mt-10">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentUser?.displayName || 'İsim bulunamadı'}
            </h1>
            <p className="text-gray-600">
              {currentUser?.email || 'Email bulunamadı'}
            </p>

            {/* Telefon Numarası */}
            {currentUser?.phoneNumber && (
              <p className="text-gray-600">{currentUser.phoneNumber}</p>
            )}
          </div>

          {/* Profili Düzenle ve Logout Butonları */}
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
            >
              <FontAwesomeIcon icon={faPen} />
              <span>Profili Düzenle</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal - Profili Düzenleme */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            {/* 🔥 Burada onClose prop'unu ProfileEdit'e geçiriyoruz */}
            <ProfileEdit onClose={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
