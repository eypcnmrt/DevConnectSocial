import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import { RootState, AppDispatch } from '../app/store';
import { logoutUser, loginSuccess } from '../features/user/userSlice';

const PrivateRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    console.log('PrivateRoute: Auth listener başlatıldı...');

    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      console.log('Auth Durumu Güncellendi:', currentUser);

      if (currentUser) {
        dispatch(
          loginSuccess({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            phoneNumber: currentUser.phoneNumber,
          }),
        );
      } else {
        dispatch(logoutUser());
      }

      // 🔥 Kullanıcı durumu ne olursa olsun, auth işlemi tamamlandı!
      setCheckingAuth(false);
    });

    return () => {
      console.log('PrivateRoute: Cleanup işlemi...');
      unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    console.log(
      'PrivateRoute: Yönlendirme yapılıyor...',
      user ? 'Authenticated' : 'Not Authenticated',
    );
  }, []);

  if (checkingAuth) {
    console.log('PrivateRoute: Auth kontrol ediliyor...');
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
