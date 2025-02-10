import { auth, googleProvider, githubProvider } from './firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  getAuth,
} from 'firebase/auth';

// Google ile giriş yapma fonksiyonu
export const signInWithGoogle = async (
  navigate: (path: string) => void,
): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google Login Successful:', result.user);
    navigate('/'); // navigate fonksiyonunu dışarıdan çağırıyoruz
  } catch (error) {
    console.error('Google login error:', error);
    throw error; // Hatanın dışarı taşınması, Redux thunk’da yakalanabilir.
  }
};

// GitHub ile giriş yapma fonksiyonu
export const signInWithGithub = async (
  navigate: (path: string) => void,
): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log('GitHub Login Successful:', result.user);
    navigate('/');
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
};

// E-posta ve şifre ile giriş yapma fonksiyonu
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<UserCredential> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Email Login Successful:', result.user);
    return result;
  } catch (error) {
    console.error('Email login error:', error);
    throw error; // Hata fırlatılıyor ki, thunk’da yakalanabilsin.
  }
};

// E-posta ve şifre ile kayıt olma fonksiyonu
export const signUpWithEmail = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    console.log('Kullanıcı başarıyla kaydedildi:', user);
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Kayıt hatası:', error.message);
      throw error;
    } else {
      console.error('Bilinmeyen bir hata oluştu:', error);
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }
};

// Kullanıcı çıkış yapma fonksiyonu
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
