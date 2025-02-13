import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmail, logout } from '../../services/auth';
import { UserCredential } from 'firebase/auth';
import { AppUser } from '../../types/user';

// Kullanıcıyla ilgili state yapısı
interface UserState {
  currentUser: AppUser | null; // Buraya sade, serileştirilebilir AppUser atılacak
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Başlangıç state'i
const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

// loginUser thunk'ı: Firebase'den dönen UserCredential içinden gerekli alanları çıkarıp sade bir nesne oluşturuyoruz.
export const loginUser = createAsyncThunk<
  { user: AppUser }, // Döndürülecek payload, sade bir kullanıcı nesnesi
  { email: string; password: string }, // Parametreler
  { rejectValue: string } // Hata durumunda dönecek mesajın tipi
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    // signInWithEmail, Firebase'den UserCredential döndürüyor
    const userCredential: UserCredential = await signInWithEmail(
      email,
      password,
    );
    const firebaseUser = userCredential.user;

    // Sadece ihtiyacımız olan alanları içeren serileştirilebilir bir AppUser nesnesi oluşturuyoruz.
    const appUser: AppUser = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      phoneNumber: firebaseUser.phoneNumber || null,
    };

    // Oluşturduğumuz nesneyi payload olarak döndürüyoruz.
    return { user: appUser };
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Firebase hata mesajına göre özel mesajlar oluşturabiliriz.
      if (error.message.includes('auth/wrong-password')) {
        return rejectWithValue('Parola bilgisi hatalı');
      }
      if (error.message.includes('auth/user-not-found')) {
        return rejectWithValue('Böyle bir kullanıcı kayıtlı değil');
      }
      return rejectWithValue('E-mail veya parola hatalı');
    }
    return rejectWithValue('Bilinmeyen bir hata oluştu');
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Bilinmeyen bir hata oluştu');
    }
  },
);

// userSlice: Hem login hem de logout işlemlerine göre state'i güncelliyoruz.
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser işlemi başlatıldığında
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // loginUser işlemi başarılı olduğunda: currentUser state'ine sade AppUser nesnesini atıyoruz.
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload.user;
      })
      // loginUser işlemi hata aldığında
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      // logoutUser işlemi başlatıldığında
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // logoutUser işlemi başarılı olduğunda: currentUser'u null yapıyoruz.
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.currentUser = null;
      })
      // logoutUser işlemi hata aldığında
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Logout failed';
      });
  },
});

export default userSlice.reducer;
