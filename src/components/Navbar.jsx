import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, BarChart3, Home, Menu, Settings, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Giriş durumunu kontrol et
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('pso_admin_auth');
      setIsAdmin(auth === 'true');
    };

    checkAuth();
    // Storage değişikliklerini dinle (farklı sekmeler için)
    window.addEventListener('storage', checkAuth);
    // Sayfa içi değişiklikleri yakalamak için interval (basit çözüm)
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
          {isAdmin ? (
            <button className="btn-login" onClick={() => navigate('/admin')}>
              <LayoutDashboard size={18} /> Panel
            </button>
          ) : (
            <button className="btn-login" onClick={() => navigate('/admin')}>
              Giriş Yap
            </button>
          )}
          <Menu className="mobile-menu-icon" size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
