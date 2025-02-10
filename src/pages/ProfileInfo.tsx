import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileInfo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Profil Bilgilerine Erişilemedi
      </h1>
      <p className="text-lg mb-6">
        Profil bilgilerine ulaşabilmek için lütfen giriş yapınız.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Giriş Yap
      </button>
    </div>
  );
};

export default ProfileInfo;
