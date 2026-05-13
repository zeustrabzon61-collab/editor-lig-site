import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, BarChart3, Home, Menu, Settings, User, LayoutDashboard, LogOut } from 'lucide-react';

import { getCurrentUser, logoutUser } from '../utils/storage';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
          <div style={{ position: 'relative' }}>
            <Menu className="mobile-menu-icon" size={24} onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: 'pointer', display: 'block' }} />
            {menuOpen && (
              <div className="glass-card animate-fade-in" style={{ position: 'absolute', top: '150%', right: '0', minWidth: '150px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 100 }}>
                {user ? (
                  <>
                    <button className="btn-secondary" onClick={() => { setMenuOpen(false); navigate('/settings'); }} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem', fontSize: '0.9rem' }}>
                      <Settings size={16} /> Ayarlar
                    </button>
                    <button className="btn-secondary" onClick={() => { setMenuOpen(false); logoutUser(); window.location.href='/'; }} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem', color: '#ff4444', borderColor: 'rgba(255,68,68,0.3)', fontSize: '0.9rem' }}>
                      <LogOut size={16} /> Çıkış Yap
                    </button>
                  </>
                ) : (
                  <button className="btn-login" onClick={() => { setMenuOpen(false); navigate('/auth'); }} style={{ width: '100%', padding: '0.75rem' }}>
                    Kayıt / Giriş
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
