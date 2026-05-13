import React, { useState } from 'react';
import { loginUser, registerUser } from '../utils/storage';
import { User, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [psoUsername, setPsoUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const res = loginUser(email, password);
      if (res.success) {
        window.location.href = '/profile';
      } else {
        setError(res.message);
      }
    } else {
      if (!email || !password || !psoUsername) {
        setError('Lütfen tüm alanları doldurun.');
        return;
      }
      const res = registerUser(email, psoUsername, password);
      if (res.success) {
        window.location.href = '/profile';
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="page-container container auth-page">
      <div className="glass-card auth-card animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', marginTop: '10vh' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Giriş ' : 'Kayıt '}
          <span className="neon-text">Yap</span>
        </h2>

        {error && (
          <div className="status-msg error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="input-group">
              <User size={18} />
              <input type="text" placeholder="PSO Kullanıcı Adı (Oyundaki Adın)" value={psoUsername} onChange={e => setPsoUsername(e.target.value)} />
            </div>
          )}
          <div className="input-group">
            <Mail size={18} />
            <input type="email" placeholder="E-posta Adresi" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <Lock size={18} />
            <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
            {isLogin ? <><LogIn size={18} /> Giriş Yap</> : <><UserPlus size={18} /> Kayıt Ol</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Hesabın yok mu? " : "Zaten hesabın var mı? "}
          <button 
            className="neon-text" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
