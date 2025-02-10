import React from 'react';
import Sidebar from '../components/Sidebar';
import UserCard from '../components/UserCard';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sol tarafta Sidebar */}
      <Sidebar />

      {/* Sağ tarafta ana içerik alanı */}
      <div className="flex-1 relative p-4">
        {/* Sağ üst köşede kullanıcı kartı */}
        <div className="absolute top-4 right-4">
          <UserCard />
        </div>
        {/* Diğer ana içerikler buraya eklenebilir */}
        <div className="mt-20">
          <h1 className="text-3xl font-bold">Ana Sayfa</h1>
          <p>Buraya diğer içerikler eklenebilir.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
