import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserCard from '../components/UserCard';
import PostForm from '../components/PostFrom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PostList from '../components/PostList';

const Home: React.FC = () => {
  // + butonuna tıklandığında form modalının açılması için state
  const [showPostForm, setShowPostForm] = useState(false);

  // Modal kapatma fonksiyonu
  const handleClosePostForm = () => {
    setShowPostForm(false);
  };

  // PostForm gönderim işlemi sonrasında çağrılacak callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePostSubmit = (postData: any) => {
    // postData'yı burada Firestore'a kaydedebilirsiniz.
    console.log('Gönderilen post verileri:', postData);
    setShowPostForm(false); // Form gönderildikten sonra modalı kapatıyoruz.
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sol taraf: Sidebar */}
      <Sidebar />

      {/* Orta Alan: Ana içerik */}
      <div className="flex-1 relative p-4">
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-indigo-500">Ana Sayfa</h1>
          <PostList />
          {/* Ana içerik bileşenleriniz burada yer alabilir */}
        </div>

        {/* + Butonu: Ana içerik alanı içinde absolute konumlandırılıyor */}
        <button
          onClick={() => setShowPostForm(true)}
          className="absolute bottom-8 left-8 bg-white border border-indigo-500 text-indigo-500 rounded-full p-4 shadow-lg hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <FontAwesomeIcon icon={faPlus} size="lg" />
        </button>

        {/* Eğer showPostForm true ise modal render ediliyor */}
        {showPostForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg relative w-full max-w-md mx-4">
              {/* Kapatma butonu */}
              <button
                onClick={handleClosePostForm}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                X
              </button>
              {/* PostForm bileşeni */}
              <PostForm onSubmit={handlePostSubmit} />
            </div>
          </div>
        )}
      </div>

      {/* Sağ Taraf: UserCard bölgesi (sabit 20% genişlik) */}
      <div className="w-[20%] p-4">
        <div className="sticky top-4">
          <UserCard />
          {/* İleride ek içerikler eklemek için alt kısım boş bırakılmıştır */}
        </div>
      </div>
    </div>
  );
};

export default Home;
