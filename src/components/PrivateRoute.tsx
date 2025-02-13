import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser } from '../features/user/userSlice';

const PrivateRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [checkingAuth, setCheckingAuth] = useState(true); // 🔥 Firebase doğrulama sürecini beklet

  useEffect(() => {
    console.log('PrivateRoute: Auth listener başlatıldı...');

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      console.log('Auth Durumu Güncellendi:', currentUser);

      if (currentUser) {
        dispatch({
          type: 'user/loginSuccess', // 🔥 `userSlice.ts` içinde bir reducer ekleyerek doğrudan Redux'ı güncelliyoruz.
          payload: {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            phoneNumber: currentUser.phoneNumber,
          },
        });
        setCheckingAuth(false); // 🔥 Kullanıcı oturumu açık, yükleme tamamlandı
      } else {
        setTimeout(() => {
          if (!auth.currentUser) {
            dispatch(logoutUser());
          }
          setCheckingAuth(false);
        }, 1000); // 🔥 Firebase gerçekten null döndürdüğünde 1 saniye bekleyip çıkış yap
      }
    });

    return () => {
      console.log('PrivateRoute: Cleanup işlemi...');
      unsubscribe();
    };
  }, [dispatch]);

  if (checkingAuth) {
    console.log('PrivateRoute: Auth kontrol ediliyor...');
    return <div>Loading...</div>; // 🔥 Firebase durumu doğrulayana kadar bekle
  }

  console.log(
    'PrivateRoute: Yönlendirme yapılıyor...',
    user ? 'Authenticated' : 'Not Authenticated',
  );

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
