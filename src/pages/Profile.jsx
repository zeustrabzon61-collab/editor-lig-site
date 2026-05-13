import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateUserProfile, logoutUser, getStorageData } from '../utils/storage';
import { useLocation } from 'react-router-dom';
import { User, Image as ImageIcon, Save, LogOut, Info, ShieldAlert, Target, Zap, Shield, Trophy } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState('');
  const [about, setAbout] = useState('');
  const [lookingForTeam, setLookingForTeam] = useState(false);
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile');
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = '/auth';
    } else {
      setUser(currentUser);
      setAvatar(currentUser.avatar || '');
      setAbout(currentUser.about || '');
      setLookingForTeam(currentUser.lookingForTeam || false);
      
      const { players } = getStorageData();
      const stats = players.find(p => p.name.toLowerCase() === currentUser.psoUsername.toLowerCase());
      setPlayerStats(stats);
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

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <div className="page-container container animate-fade-in">
      <div className="admin-header">
        <h2 className="section-title">Kullanıcı <span className="neon-text">Profili</span></h2>
        <button className="btn-secondary" onClick={handleLogout} style={{ color: '#ff4444', borderColor: 'rgba(255,68,68,0.3)' }}>
          <LogOut size={18} /> Çıkış Yap
        </button>
      </div>

      <div className="tabs-container" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <button 
          className={activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('profile')}
        >
          Profilim
        </button>
        <button 
          className={activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveTab('settings')}
        >
          Ayarlar
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-view-tab animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          
          {playerStats ? (
            <>
              <div className="fifa-card-container" style={{ transform: 'scale(1.1)', margin: '1rem 0 2rem 0' }}>
                <div className="fifa-card">
                  <div className="fifa-card-inner">
                    <div className="fifa-card-top">
                      <div className="f-rating">{Math.min(99, 70 + (playerStats.goals * 2) + (playerStats.assists))}</div>
                      <div className="f-position">{playerStats.position || 'CM'}</div>
                    </div>
                    <div className="f-avatar-area" style={{ position: 'relative' }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.psoUsername} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <User size={80} strokeWidth={1} />
                      )}
                      {user.lookingForTeam && (
                        <div className="lft-badge" title="Takım Arıyor" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'rgba(0,0,0,0.8)', padding: '4px', borderRadius: '50%', border: '1px solid var(--neon-cyan)' }}>
                          <ShieldAlert size={16} color="#00ffcc" />
                        </div>
                      )}
                    </div>
                    <div className="f-info">
                      <div className="f-name">{playerStats.name}</div>
                      <div className="f-main-stats">
                        <div className="f-stat"><span>{playerStats.goals}</span> GOL</div>
                        <div className="f-stat"><span>{playerStats.assists}</span> AST</div>
                        <div className="f-stat"><span>{playerStats.matches}</span> MAÇ</div>
                      </div>
                      <div className="f-badges">
                        <span className="f-team-name">{playerStats.team}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fifa-card-glow"></div>
              </div>

              <div className="m-stats-grid" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="m-stat-box">
                  <Target className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{playerStats.goals}</span>
                    <span className="m-lbl">Gol</span>
                  </div>
                </div>
                <div className="m-stat-box">
                  <Zap className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{playerStats.assists}</span>
                    <span className="m-lbl">Asist</span>
                  </div>
                </div>
                <div className="m-stat-box">
                  <Shield className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{playerStats.tackles || 0}</span>
                    <span className="m-lbl">Tackle</span>
                  </div>
                </div>
                <div className="m-stat-box">
                  <Trophy className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{playerStats.saves || 0}</span>
                    <span className="m-lbl">Kurtarış</span>
                  </div>
                </div>
              </div>

              <div className="m-footer-stats" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="f-stat-pill">Oynanan Maç: {playerStats.matches}</div>
                <div className="f-stat-pill">Top Çalma: {playerStats.interceptions || 0}</div>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', width: '100%', maxWidth: '600px', padding: '3rem' }}>
              <User size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>Henüz İstatistik Bulunamadı</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Kayıtlı maç verileriniz sistemde bulunmuyor. Maçlara katıldıkça istatistikleriniz ve oyuncu kartınız burada belirecektir.</p>
            </div>
          )}

          {user.about && (
            <div className="profile-about-box" style={{ background: 'rgba(0,255,204,0.05)', border: '1px solid rgba(0,255,204,0.2)', padding: '1.5rem', borderRadius: '15px', width: '100%', maxWidth: '600px', marginTop: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--neon-cyan)' }}>
                <Info size={18} /> Hakkında
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                "{user.about}"
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
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
      )}
    </div>
  );
};

export default Profile;

