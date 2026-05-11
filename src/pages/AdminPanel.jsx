import React, { useState, useEffect } from 'react';
import { processMatchJSON } from '../utils/storage';
import { Upload, CheckCircle, AlertCircle, Trash2, Lock, LogOut } from 'lucide-react';

const AdminPanel = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Şifre: admin123
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    const authStatus = localStorage.getItem('pso_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('pso_admin_auth', 'true');
      setLoginError('');
      // Navbardaki durumu güncellemek için küçük bir tetikleyici
      window.dispatchEvent(new Event('storage'));
    } else {
      setLoginError('Hatalı şifre! Lütfen tekrar deneyin.');
      setPassword(''); // Şifreyi temizle
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pso_admin_auth');
    window.location.href = '/';
  };

  const handleProcess = () => {
    try {
      const data = JSON.parse(jsonInput);
      processMatchJSON(data);
      setStatus({ type: 'success', message: 'Maç verileri başarıyla işlendi ve lig güncellendi!' });
      setJsonInput('');
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Hata: Geçersiz JSON formatı. Lütfen kopyaladığınız metni kontrol edin.' });
    }
  };

  const clearDatabase = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container container admin-login-page">
        <div className="glass-card login-card">
          <div className="login-icon">
            <Lock size={48} className="neon-text" />
          </div>
          <h2>Admin <span className="neon-text">Girişi</span></h2>
          <p>Bu alana erişmek için yetkili olmanız gerekmektedir.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Admin Şifresi" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              autoFocus
            />
            {loginError && <p className="error-text">{loginError}</p>}
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem', cursor: 'pointer' }}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container container">
      <div className="admin-header">
        <h2 className="section-title">Admin <span className="neon-text">Paneli</span></h2>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} /> Çıkış Yap
        </button>
      </div>
      
      <div className="admin-grid">
        <div className="glass-card">
          <h3>Maç Verisi Yükle</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            PSO'dan indirdiğiniz maç istatistikleri JSON içeriğini buraya yapıştırın.
          </p>
          
          <textarea 
            className="admin-textarea"
            placeholder='{"team1Stats": ...}'
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          ></textarea>
          
          <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleProcess}>
            <Upload size={20} /> Maçı İşle ve Kaydet
          </button>
          
          {status.message && (
            <div className={`status-msg ${status.type}`}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}
        </div>
        
        <div className="glass-card">
          <h3>Sistem Ayarları</h3>
          <div className="admin-actions">
            <button className="btn-secondary" onClick={clearDatabase} style={{ color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.3)', width: '100%', fontSize: '0.85rem' }}>
              <Trash2 size={18} /> Puan durumunu eskiye çevir ve verileri sıfırla
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
              Tüm skorları ve istatistikleri temizleyerek ligi başlangıç durumuna (4 Takım) getirir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
