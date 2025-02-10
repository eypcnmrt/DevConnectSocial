import React, { useState, useEffect } from 'react';
import {
  signInWithGoogle,
  signInWithGithub,
  // signInWithEmail,  // Artık bu fonksiyonu direkt kullanmayacağız.
} from '../services/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faUserPlus,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import google from '../assets/google.svg';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/user/userSlice';
import { AppDispatch, RootState } from '../app/store';
import { toast } from 'react-toastify';

const Login = () => {
  // Form state'leri
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redux dispatch ve store selector (tip güvenli)
  const dispatch = useDispatch<AppDispatch>();
  const { error, status } = useSelector((state: RootState) => state.user);

  // Yönlendirme için hook
  const navigate = useNavigate();

  // Hata durumunda toast mesajı gösterimi
  useEffect(() => {
    if (error && status === 'failed') {
      toast.error(error);
    }
  }, [error, status]);

  // E-posta ile giriş işlemi: Redux thunk kullanılarak loginUser dispatch ediliyor.
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap() // Thunk'un sonucunu unwrap ediyoruz.
      .then(() => {
        navigate('/'); // Giriş başarılı ise ana sayfaya yönlendir.
      })
      .catch((err) => {
        console.error('Login failed:', err);
        // Hata mesajı useEffect ile toast.error olarak gösterilecek.
      });
  };

  // Kaydol butonuna tıklanınca signup sayfasına yönlendir.
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div
      className="flex flex-col h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmd6cGVma2V6cjl1ZHNndXdiaGI5bXY5azJ5bWVpcTdlbDIzaWFsYiZlcD12MV9pbnRlcm5naWZfYnlfaWQmY3Q9Zw/7FrOU9tPbgAZtxV5mb/giphy.gif')",
      }}
    >
      {/* Üst Kısım: Header (10vh yüksekliğinde kapsayıcı) */}
      <div className="h-[10vh]">
        <Header title="Geliştiricilerin Sosyal Ağı DevConnect'e hoş geldiniz. Lütfen giriş yapın." />
      </div>

      {/* İçerik Bölümü: Kalan alan */}
      <div className="flex-1 flex justify-center items-center">
        {/* Form Kutusu */}
        <div className="relative z-10 bg-white rounded-lg shadow-xl p-10 max-w-md w-full">
          <h2 className="text-center text-2xl font-bold text-indigo-500 mb-6">
            Sign In
          </h2>

          <form onSubmit={handleEmailLogin} className="space-y-12">
            <div className="space-y-2">
              <div className="relative w-full">
                <p className="block text-sm text-indigo-500 font-medium mb-1">
                  E-mail
                </p>
                <div className="relative w-full">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer pl-10 p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder=" "
                    required
                  />
                </div>
              </div>

              <div className="relative w-full">
                <p className="block text-sm text-indigo-500 font-medium mb-1">
                  Password
                </p>
                <div className="relative w-full">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer pl-10 p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder=" "
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="w-3/4 flex justify-center items-center gap-2 py-3 px-1 rounded-md border border-indigo-500 bg-white text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mx-auto"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="text-lg" />
                Sign in
              </button>
              <button
                onClick={handleEmailSignup}
                className="w-3/4 flex justify-center items-center gap-2 py-3 px-1 rounded-md border border-indigo-500 bg-white text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mx-auto"
              >
                <FontAwesomeIcon icon={faUserPlus} className="text-lg" />
                Sign up
              </button>
            </div>

            <div className="flex w-full gap-x-3">
              <button
                onClick={() => signInWithGoogle(navigate)}
                className="w-1/2 border border-gray-300 flex items-center justify-center gap-2 py-3 px-1 font-medium text-sm rounded-full hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <img
                  src={google}
                  alt="Google Logo"
                  width="24"
                  height="24"
                  className="text-lg"
                />
                Sign in with Google
              </button>
              <button
                onClick={() => signInWithGithub(navigate)}
                className="w-1/2 border border-gray-300 flex items-center justify-center gap-2 py-3 px-1 font-medium text-sm rounded-full hover:bg-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <FontAwesomeIcon icon={faGithub} className="text-lg" />
                Sign in with GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
