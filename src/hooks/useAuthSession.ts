import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';
import { AppDispatch } from '../app/store'; // ✅ AppDispatch'i import et

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 dakika (ms)
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 dakika (ms)

const useAuthSession = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ dispatch'in tipini belirle
  const [lastActive, setLastActive] = useState<number>(Date.now());

  // Kullanıcı aktif olduğunda zamanı güncelle
  const resetTimer = () => setLastActive(Date.now());

  useEffect(() => {
    // Kullanıcının giriş yaptığı zamanı kaydet
    localStorage.setItem('loginTime', Date.now().toString());

    // Kullanıcı etkinliklerini dinle
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    const interval = setInterval(() => {
      const loginTime = Number(localStorage.getItem('loginTime'));
      const currentTime = Date.now();

      if (!loginTime) return;

      // 30 dakikayı geçtiyse ve 10 dakikadır aktif değilse çıkış yap
      if (
        currentTime - loginTime >= SESSION_TIMEOUT &&
        currentTime - lastActive >= INACTIVITY_TIMEOUT
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(logoutUser() as any); // 🔥 Eğer hala hata verirse 'as any' ekleyebilirsin
        signOut(auth); // Firebase'den çıkış yap
        localStorage.removeItem('loginTime');
      }
    }, 60000); // Her dakika kontrol et

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      clearInterval(interval);
    };
  }, [lastActive, dispatch]);

  return null; // Bu hook, herhangi bir UI döndürmez
};

export default useAuthSession;
