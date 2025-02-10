import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail } from '../services/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faEnvelope,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUpWithEmail(email, password);
      toast.success('Kayıt başarılı! Lütfen giriş yapınız.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Kayıt başarısız! Lütfen tekrar deneyin.');
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmd6cGVma2V6cjl1ZHNndXdiaGI5bXY5azJ5bWVpcTdlbDIzaWFsYiZlcD12MV9pbnRlcm5naWZfYnlfaWQmY3Q9Zw/7FrOU9tPbgAZtxV5mb/giphy.gif')",
      }}
    >
      {/* Üst Kısım: Header */}
      <div className="h-[10vh]">
        <Header title="Geliştiricilerin Sosyal Ağı DevConnect'e hoş geldiniz. Lütfen kaydolun." />
      </div>

      {/* İçerik Bölümü: Sign-Up Formu */}
      <div className="flex-1 flex justify-center items-center">
        <div className="relative z-10 bg-white rounded-lg shadow-xl p-10 max-w-md w-full">
          <h2 className="text-center text-2xl font-bold text-indigo-500 mb-6">
            Sign Up
          </h2>

          <form onSubmit={handleEmailSignup} className="space-y-12">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 p-3 w-full border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md border border-indigo-500 bg-white text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <FontAwesomeIcon icon={faUserPlus} className="text-lg pr-2" />
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
