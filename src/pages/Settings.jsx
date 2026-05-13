import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile } from '../utils/storage';
import { User, Image as ImageIcon, Save, Info, ShieldAlert } from 'lucide-react';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [about, setAbout] = useState('');
  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = '/auth';
    } else {
      setUser(currentUser);
      setAvatar(currentUser.avatar || '');
      setAbout(currentUser.about || '');
      setLookingForTeam(currentUser.lookingForTeam || false);
    }
  }, []);

  const handleSave = () => {
    const success = updateUserProfile(user.psoUsername, { avatar, about, lookingForTeam });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setUser({ ...user, avatar, about, lookingForTeam });
    }
  };

  if (!user) return null;

  return (
    <div className="page-container container animate-fade-in">
      <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Profil <span className="neon-text">Ayarları</span></h2>

      <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="profile-avatar-preview" style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatar ? (
              <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; }} />
            ) : (
              <User size={60} strokeWidth={1} color="rgba(255,255,255,0.5)" />
            )}
          </div>
          <div>
            <h3 className="neon-text" style={{ fontSize: '1.8rem', margin: 0 }}>{user.psoUsername}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>{user.email}</p>
          </div>
        </div>

        <div className="input-group-vertical">
          <label><ImageIcon size={16} /> Profil Fotoğrafı Linki (Hızlıresim, Discord vb.)</label>
          <input 
            type="text" 
            placeholder="https://site.com/resim.png" 
            value={avatar} 
            onChange={e => setAvatar(e.target.value)} 
            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px' }}
          />
        </div>

        <div className="input-group-vertical">
          <label><Info size={16} /> Hakkımda (Max 100 Karakter)</label>
          <textarea 
            placeholder="Kendinden bahset..." 
            value={about} 
            onChange={e => setAbout(e.target.value.substring(0, 100))} 
            style={{ width: '100%', height: '80px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px', resize: 'none' }}
          />
          <small style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>{about.length}/100</small>
        </div>

        <div className="input-group-vertical" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.1rem' }}>
              <ShieldAlert size={20} className={lookingForTeam ? 'neon-text' : ''} />
              Takım Arıyorum
            </label>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Bu seçeneği açarsan, oyuncu kartında takım aradığını belirten bir ikon çıkar.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={lookingForTeam} onChange={e => setLookingForTeam(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <button className="btn-primary" style={{ justifyContent: 'center', padding: '1rem' }} onClick={handleSave}>
          <Save size={20} /> Değişiklikleri Kaydet
        </button>

        {saved && (
          <p className="neon-text" style={{ textAlign: 'center', marginTop: '-1rem' }}>Başarıyla kaydedildi!</p>
        )}

      </div>
    </div>
  );
};

export default Settings;
