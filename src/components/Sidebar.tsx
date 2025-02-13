import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/user/userSlice';
import { AppDispatch, RootState } from '../app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleProfile = () => {
    if (currentUser && currentUser.uid) {
      navigate(`/profile/${currentUser.uid}`);
    } else {
      navigate('/profileInfo');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`h-screen bg-white border-r border-gray-300 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-[20%]'
      }`}
    >
      <div className="p-4">
        {/* Başlık kısmı: Dar modda kısaltılmış, geniş modda tam metin */}

        <ul className="mt-4 space-y-8">
          <li>
            <a
              href="/"
              className="flex items-center text-gray-700 hover:text-indigo-500"
            >
              <FontAwesomeIcon icon={faHome} size="lg" />
              {!collapsed && <span className="ml-2">Ana Sayfa</span>}
            </a>
          </li>
          <li>
            <button
              onClick={handleProfile}
              className="flex items-center w-full text-gray-700 hover:text-indigo-500"
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
              {!collapsed && <span className="ml-2">Profil Sayfası</span>}
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-gray-700 hover:text-indigo-500"
            >
              <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
              {!collapsed && <span className="ml-2">Çıkış Yap</span>}
            </button>
          </li>
          {/* İhtiyacınıza göre daha fazla menü öğesi ekleyebilirsiniz */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
