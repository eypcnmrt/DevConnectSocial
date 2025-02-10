import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../services/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

const PrivateRoute: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('PrivateRoute: Auth listener başlatıldı...');

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth Durumu Güncellendi:', currentUser);

      setUser(currentUser);

      setLoading(false);
    });

    return () => {
      console.log('PrivateRoute: Cleanup işlemi...');
      unsubscribe();
    };
  }, []);
  if (loading) {
    console.log('PrivateRoute: Yükleniyor...');
    return <div>Loading...</div>;
  }

  console.log(
    'PrivateRoute: Yönlendirme yapılıyor...',
    user ? 'Authenticated' : 'Not Authenticated',
  );

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
