import { auth, db, googleProvider, githubProvider } from './firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { AppUser } from '../types/user';

// 📌 Kullanıcı bilgilerini Firebase Realtime Database'e kaydetme fonksiyonu
const saveUserToDB = async (user: AppUser) => {
  try {
    await set(ref(db, `users/${user.uid}`), user);
    console.log("✅ Kullanıcı bilgileri Firebase Database'e kaydedildi:", user);
  } catch (error) {
    console.error("❌ Kullanıcı Firebase Database'e kaydedilemedi:", error);
  }
};

// 📌 Google ile giriş yapma fonksiyonu
export const signInWithGoogle = async (
  navigate: (path: string) => void,
): Promise<AppUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);

    const appUser: AppUser = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'Bilinmeyen Kullanıcı',
      photoURL: user.photoURL || 'https://via.placeholder.com/150',
      phoneNumber: user.phoneNumber || null,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      tenantId: user.tenantId || null,
    };

    if (!userSnapshot.exists()) {
      await saveUserToDB(appUser);
    }

    navigate('/');
    return appUser;
  } catch (error) {
    console.error('❌ Google login error:', error);
    throw error;
  }
};

// 📌 GitHub ile giriş yapma fonksiyonu
export const signInWithGithub = async (
  navigate: (path: string) => void,
): Promise<AppUser> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;

    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);

    const appUser: AppUser = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'Bilinmeyen Kullanıcı',
      photoURL: user.photoURL || 'https://via.placeholder.com/150',
      phoneNumber: user.phoneNumber || null,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      tenantId: user.tenantId || null,
    };

    if (!userSnapshot.exists()) {
      await saveUserToDB(appUser);
    }

    navigate('/');
    return appUser;
  } catch (error) {
    console.error('❌ GitHub login error:', error);
    throw error;
  }
};

// 📌 E-posta ve şifre ile giriş yapma fonksiyonu
export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AppUser> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    const appUser: AppUser = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || 'Bilinmeyen Kullanıcı',
      photoURL: user.photoURL || 'https://via.placeholder.com/150',
      phoneNumber: user.phoneNumber || null,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      tenantId: user.tenantId || null,
    };

    return appUser;
  } catch (error) {
    console.error('❌ Email login error:', error);
    throw error;
  }
};

// 📌 E-posta ve şifre ile kayıt olma fonksiyonu
export const signUpWithEmail = async (
  email: string,
  password: string,
  fullName: string,
  photoURL?: string,
): Promise<AppUser> => {
  try {
    console.log('📌 Kayıt işlemi başladı...');

    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("✅ Firebase Auth'a kayıt başarılı:", userCredential);

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: fullName,
      photoURL: photoURL || 'https://via.placeholder.com/150',
    });
    console.log('✅ Kullanıcı profili güncellendi:', user);

    const appUser: AppUser = {
      uid: user.uid,
      email: user.email || null,
      displayName: fullName,
      photoURL: photoURL || 'https://via.placeholder.com/150',
      phoneNumber: user.phoneNumber || null,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      tenantId: user.tenantId || null,
    };

    console.log("✅ Firebase Realtime Database'e kaydediliyor...");
    await saveUserToDB(appUser);
    console.log("✅ Kullanıcı Firebase Database'e kaydedildi:", appUser);

    return appUser;
  } catch (error) {
    console.error('❌ Kayıt sırasında hata oluştu:', error);
    throw error;
  }
};

// 📌 Kullanıcı çıkış yapma fonksiyonu
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('✅ Kullanıcı çıkış yaptı.');
  } catch (error) {
    console.error('❌ Logout error:', error);
    throw error;
  }
};
