import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const UserCard: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex items-center space-x-4">
      <img
        src={currentUser.photoURL || 'https://via.placeholder.com/80'}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-bold">
          {currentUser.displayName || 'Kullanıcı Adı'}
        </h3>
        <p className="text-sm text-gray-600">{currentUser.email}</p>
        {/* İsteğe bağlı: telefon numarası, kullanıcı adı, soyisim vs. */}
      </div>
    </div>
  );
};

export default UserCard;
