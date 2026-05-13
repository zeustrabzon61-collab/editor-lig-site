import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile } from '../utils/storage';
import { User, Image as ImageIcon, Save, Info, ShieldAlert } from 'lucide-react';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [about, setAbout] = useState('');
  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [position, setPosition] = useState('');
  const [psoId, setPsoId] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
      setPosition(currentUser.position || '');
      setPsoId(currentUser.psoId || '');
      setJerseyNumber(currentUser.jerseyNumber || '');
    }
  }, []);

  const handleSave = () => {
    const updates = { avatar, about, lookingForTeam, position, psoId, jerseyNumber };
    if (newPassword.trim()) {
      updates.password = newPassword.trim();
    }
    const success = updateUserProfile(user.psoUsername, updates);
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setUser({ ...user, ...updates });
      setNewPassword(''); // clear password field after save
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 250;
          const MAX_HEIGHT = 250;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          setAvatar(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
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
          <label><ImageIcon size={16} /> Profil Fotoğrafı Linki veya Bilgisayardan Yükle</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="https://site.com/resim.png" 
              value={avatar} 
              onChange={e => setAvatar(e.target.value)} 
              style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px' }}
            />
            <label className="btn-secondary" style={{ padding: '0.9rem', cursor: 'pointer', margin: 0 }}>
              Yükle
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Büyük resimler otomatik olarak küçültülür.</small>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="input-group-vertical">
            <label>Mevki (Örn: ST, CM)</label>
            <input 
              type="text" 
              placeholder="CM" 
              maxLength="3"
              value={position} 
              onChange={e => setPosition(e.target.value.toUpperCase())} 
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px' }}
            />
          </div>
          <div className="input-group-vertical">
            <label>Forma No</label>
            <input 
              type="number" 
              placeholder="10" 
              min="1" max="99"
              value={jerseyNumber} 
              onChange={e => setJerseyNumber(e.target.value)} 
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px' }}
            />
          </div>
          <div className="input-group-vertical">
            <label>PSO ID (Steam)</label>
            <input 
              type="text" 
              placeholder="SteamID64" 
              value={psoId} 
              onChange={e => setPsoId(e.target.value)} 
              style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px' }}
            />
          </div>
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

        <div className="input-group-vertical" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Şifre Değiştir</h4>
          <input 
            type="password" 
            placeholder="Yeni Şifreniz (Değiştirmek istemiyorsanız boş bırakın)" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '1rem', color: 'white', borderRadius: '10px' }}
          />
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
