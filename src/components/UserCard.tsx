import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const UserCard: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  if (!currentUser) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-300">
      <img
        src={currentUser.photoURL || 'https://placehold.co/80'}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover"
      />

      <h3 className="text-gray-700">
        {currentUser.displayName ? (
          currentUser.displayName
        ) : (
          <strong>Kullanıcı Adı:</strong>
        )}
      </h3>
      <p className="text-gray-700">{currentUser.email}</p>
      {/* İsteğe bağlı: telefon numarası, kullanıcı adı, soyisim vs. */}
    </div>
  );
};

export default UserCard;
