import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, BarChart3, Home, Menu, Settings, User, LayoutDashboard } from 'lucide-react';

import { getCurrentUser } from '../utils/storage';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Giriş durumunu kontrol et
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('pso_admin_auth');
      setIsAdmin(auth === 'true');
      setUser(getCurrentUser());
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <NavLink to="/" className="logo">
          <Trophy className="neon-text" size={32} />
          <span className="logo-text gradient-text">EDİTÖR LİG</span>
        </NavLink>
        
        <ul className="nav-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              <Home size={18} /> Anasayfa
            </NavLink>
          </li>
          <li>
            <NavLink to="/puan-durumu" className={({ isActive }) => isActive ? 'active' : ''}>
              <Trophy size={18} /> Puan Durumu
            </NavLink>
          </li>
          <li>
            <NavLink to="/fikstur" className={({ isActive }) => isActive ? 'active' : ''}>
              <Calendar size={18} /> Fikstür
            </NavLink>
          </li>
          <li>
            <NavLink to="/oyuncular" className={({ isActive }) => isActive ? 'active' : ''}>
              <User size={18} /> Oyuncular
            </NavLink>
          </li>
          <li>
            <NavLink to="/istatistikler" className={({ isActive }) => isActive ? 'active' : ''}>
              <BarChart3 size={18} /> İstatistikler
            </NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          {user ? (
            <button className="btn-secondary" onClick={() => navigate('/profile')} style={{ padding: '0.5rem 1rem' }}>
              <User size={18} /> Profil
            </button>
          ) : (
            <button className="btn-login" onClick={() => navigate('/auth')}>
              Kayıt / Giriş
            </button>
          )}

          {isAdmin ? (
            <button className="btn-login" onClick={() => navigate('/admin')}>
              <LayoutDashboard size={18} /> Panel
            </button>
          ) : (
            <button className="btn-secondary" style={{ background: 'transparent' }} onClick={() => navigate('/admin')}>
              <Settings size={18} />
            </button>
          )}
          <Menu className="mobile-menu-icon" size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
