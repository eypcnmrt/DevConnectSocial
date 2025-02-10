import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';
import { AppDispatch, RootState } from '../app/store';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleProfile = () => {
    if (currentUser && currentUser.uid) {
      navigate(`/profile/${currentUser.uid}`);
    } else {
      navigate('/profileInfo');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      {/* Menü başlığı */}
      <h2 className="text-xl font-bold mb-6">Menu</h2>
      {/* Profil Sayfası butonu */}
      <button
        onClick={handleProfile}
        className="w-full text-left mb-4 px-3 py-2 rounded hover:bg-gray-700"
      >
        Profil Sayfası
      </button>
      {/* Çıkış Yap butonu */}
      <button
        onClick={handleLogout}
        className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default Sidebar;
