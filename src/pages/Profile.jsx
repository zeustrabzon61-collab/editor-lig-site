import React, { useState, useEffect } from 'react';
import { getCurrentUser, getStorageData } from '../utils/storage';
import { User, Info, ShieldAlert, Target, Zap, Shield, Trophy } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      window.location.href = '/auth';
    } else {
      setUser(currentUser);
      
      const { players } = getStorageData();
      const stats = players.find(p => p.name.toLowerCase() === currentUser.psoUsername.toLowerCase());
      setPlayerStats(stats);
    }
  }, []);

  if (!user) return null;

  const displayStats = playerStats || {
    name: user.psoUsername,
    position: 'FA',
    team: 'Serbest Oyuncu',
    goals: 0,
    assists: 0,
    matches: 0,
    tackles: 0,
    saves: 0,
    interceptions: 0
  };

  return (
    <div className="page-container container animate-fade-in">
      <div className="admin-header">
        <h2 className="section-title">Kullanıcı <span className="neon-text">Profili</span></h2>
      </div>

      <div className="profile-view-tab animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', marginTop: '2rem' }}>
        
        <div className="fifa-card-container" style={{ transform: 'scale(1.1)', margin: '1rem 0 2rem 0' }}>
          <div className="fifa-card">
            <div className="fifa-card-inner">
              <div className="fifa-card-top">
                <div className="f-rating">{Math.min(99, 70 + (displayStats.goals * 2) + (displayStats.assists))}</div>
                <div className="f-position">{displayStats.position || 'CM'}</div>
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
                <div className="f-name">{displayStats.name}</div>
                <div className="f-main-stats">
                  <div className="f-stat"><span>{displayStats.goals}</span> GOL</div>
                  <div className="f-stat"><span>{displayStats.assists}</span> AST</div>
                  <div className="f-stat"><span>{displayStats.matches}</span> MAÇ</div>
                </div>
                <div className="f-badges">
                  <span className="f-team-name">{displayStats.team}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="fifa-card-glow"></div>
        </div>

        {!playerStats && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem 2rem', borderRadius: '10px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', width: '100%', fontSize: '0.9rem' }}>
            <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Kayıtlı maç veriniz bulunmuyor. Maçlara katıldıkça istatistikleriniz güncellenecektir.
          </div>
        )}

        <div className="m-stats-grid" style={{ width: '100%', maxWidth: '600px' }}>
          <div className="m-stat-box">
            <Target className="neon-text" />
            <div className="m-stat-data">
              <span className="m-val">{displayStats.goals}</span>
              <span className="m-lbl">Gol</span>
            </div>
          </div>
          <div className="m-stat-box">
            <Zap className="neon-text" />
            <div className="m-stat-data">
              <span className="m-val">{displayStats.assists}</span>
              <span className="m-lbl">Asist</span>
            </div>
          </div>
          <div className="m-stat-box">
            <Shield className="neon-text" />
            <div className="m-stat-data">
              <span className="m-val">{displayStats.tackles || 0}</span>
              <span className="m-lbl">Tackle</span>
            </div>
          </div>
          <div className="m-stat-box">
            <Trophy className="neon-text" />
            <div className="m-stat-data">
              <span className="m-val">{displayStats.saves || 0}</span>
              <span className="m-lbl">Kurtarış</span>
            </div>
          </div>
        </div>

        <div className="m-footer-stats" style={{ width: '100%', maxWidth: '600px' }}>
          <div className="f-stat-pill">Oynanan Maç: {displayStats.matches}</div>
          <div className="f-stat-pill">Top Çalma: {displayStats.interceptions || 0}</div>
        </div>

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
    </div>
  );
};

export default Profile;

