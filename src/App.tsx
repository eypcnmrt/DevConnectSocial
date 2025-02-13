import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { auth } from './services/firebase'; // Firebase auth import
import { onAuthStateChanged } from 'firebase/auth';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './pages/SignUp';
import { ToastContainer } from 'react-toastify';
import ProfileInfo from './pages/ProfileInfo';
import useAuthSession from './hooks/useAuthSession';

function App() {
  useAuthSession(); // Otomatik oturum yönetimini başlat

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {});
    return () => unsubscribe();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:uid" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="profileInfo" element={<ProfileInfo />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
