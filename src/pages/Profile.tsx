// src/pages/Profile.tsx
import React from 'react';
// Redux store'dan currentUser bilgisini çekmek ve dispatch işlemi yapmak için gerekli hook'ları import ediyoruz.
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
// Logout işlemi için oluşturduğumuz logoutUser thunk'ını import ediyoruz.
import { logoutUser } from '../features/user/userSlice';
// Yönlendirme (redirect) işlemi için useNavigate hook'unu import ediyoruz.
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  // currentUser: Giriş yapmış kullanıcının bilgilerini içerir (örneğin, uid, displayName, photoURL, email, vb.).
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  // dispatch fonksiyonunu tip güvenli şekilde elde ediyoruz.
  const dispatch = useDispatch<AppDispatch>();

  // Yönlendirme işlemleri için useNavigate hook'unu kullanıyoruz.
  const navigate = useNavigate();

  // handleLogout: Çıkış yap butonuna tıklanıldığında çalışır.
  const handleLogout = async () => {
    // logoutUser thunk'ını dispatch ediyoruz. unwrap() ile başarılı sonucu veya hatayı yakalıyoruz.
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        // Çıkış işlemi başarılı olursa, kullanıcıyı /login sayfasına yönlendiriyoruz.
        navigate('/login');
      })
      .catch((error) => {
        // Hata durumunda hata mesajını konsola yazdırıyoruz.
        console.error('Logout failed:', error);
      });
  };

  return (
    // Dış kapsayıcı div: Sayfanın tamamını kaplar, arka planı belirttiğiniz GIF ile ayarlar.
    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage:
          "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmd6cGVma2V6cjl1ZHNndXdiaGI5bXY5azJ5bWVpcTdlbDIzaWFsYiZlcD12MV9pbnRlcm5naWZfYnlfaWQmY3Q9Zw/7FrOU9tPbgAZtxV5mb/giphy.gif')",
      }}
    >
      {/* İçerik Kartı: Kullanıcı bilgilerini daha okunaklı hale getirmek için yarı şeffaf beyaz bir kart */}
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Profilim</h1>
        {currentUser ? (
          <div className="flex flex-col items-center space-y-4">
            {/* Profil Resmi: Kullanıcının photoURL'si varsa onu gösterir, yoksa placeholder kullanılır */}
            <img
              src={currentUser.photoURL || 'https://via.placeholder.com/150'}
              alt="Profil Resmi"
              className="w-32 h-32 rounded-full object-cover"
            />
            {/* Kullanıcının Adı */}
            <p className="text-xl font-semibold">
              {currentUser.displayName || 'İsim bulunamadı'}
            </p>
            {/* Kullanıcının E-posta Adresi */}
            <p className="text-gray-600">
              {currentUser.email || 'Email bulunamadı'}
            </p>
            {/* Telefon Numarası varsa gösterilir */}
            {currentUser.phoneNumber && (
              <p className="text-gray-600">{currentUser.phoneNumber}</p>
            )}
            {/* Logout Butonu */}
            <button
              onClick={handleLogout} // Kullanıcı bu butona tıkladığında handleLogout çalışır.
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          // Eğer currentUser bilgisi alınamamışsa, bilgilendirici bir mesaj gösterilir.
          <p className="text-center">Kullanıcı bilgileri bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
