import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmail, logout } from '../../services/auth';
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
  { user: AppUser }, // 🔥 Artık `AppUser` tam uyumlu
  { email: string; password: string },
  { rejectValue: string }
>('user/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const appUser: AppUser = await signInWithEmail(email, password);
    return { user: appUser };
  } catch (error: unknown) {
    if (error instanceof Error) {
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
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.status = 'idle';
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AppUser>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
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
        state.currentUser = {
          uid: action.payload.user.uid || '', // ✅ UID'nin her zaman string olmasını garanti et
          email: action.payload.user.email || null,
          displayName:
            action.payload.user.displayName || 'Bilinmeyen Kullanıcı',
          photoURL:
            action.payload.user.photoURL || 'https://via.placeholder.com/150',
          phoneNumber: action.payload.user.phoneNumber || null,
        } as AppUser; // ✅ Zorla `AppUser` olarak tip ata
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
export const { loginSuccess, logoutSuccess, updateUser } = userSlice.actions;
export default userSlice.reducer;
