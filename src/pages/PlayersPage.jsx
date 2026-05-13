import React, { useState } from 'react';
import { getStorageData } from '../utils/storage';
import { User, Search, X, Trophy, Target, Shield, Zap, ShieldAlert, Info } from 'lucide-react';

const PlayerCard = ({ player, users = [], onClick }) => {
  const profile = users.find(u => u.psoUsername.toLowerCase() === player.name.toLowerCase());

  return (
    <div className="fifa-card-container animate-fade-in" onClick={() => onClick(player, profile)}>
      <div className="fifa-card">
        <div className="fifa-card-inner">
          <div className="fifa-card-top">
            <div className="f-rating">{Math.min(99, 70 + (player.goals * 2) + (player.assists))}</div>
            <div className="f-position">{player.position || 'CM'}</div>
          </div>
          <div className="f-avatar-area" style={{ position: 'relative' }}>
            {profile && profile.avatar ? (
              <img src={profile.avatar} alt={player.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={80} strokeWidth={1} />
            )}
            {profile && profile.lookingForTeam && (
              <div className="lft-badge" title="Takım Arıyor" style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'rgba(0,0,0,0.8)', padding: '4px', borderRadius: '50%', border: '1px solid var(--neon-cyan)' }}>
                <ShieldAlert size={16} color="#00ffcc" />
              </div>
            )}
          </div>
          <div className="f-info">
            <div className="f-name">{player.name}</div>
            <div className="f-main-stats">
              <div className="f-stat"><span>{player.goals}</span> GOL</div>
              <div className="f-stat"><span>{player.assists}</span> AST</div>
              <div className="f-stat"><span>{player.matches}</span> MAÇ</div>
            </div>
            <div className="f-badges">
              <span className="f-team-name">{player.team}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="fifa-card-glow"></div>
    </div>
  );
};

const PlayersPage = () => {
  const { players, teams, users } = getStorageData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const positions = ['GK', 'LB', 'RB', 'CM', 'LW', 'RW'];

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'All' || p.team.toUpperCase() === selectedTeam.toUpperCase();
    const matchesPosition = selectedPosition === 'All' || (p.position && p.position.toUpperCase() === selectedPosition.toUpperCase());
    
    return matchesSearch && matchesTeam && matchesPosition;
  });

  return (
    <div className="page-container container">
      <h2 className="section-title">Lig <span className="neon-text">Oyuncuları</span></h2>
      
      <div className="filters-container">
        <div className="players-search-wrapper">
          <div className="search-bar glass-card">
            <Search size={20} className="neon-text" />
            <input 
              type="text" 
              placeholder="Oyuncu ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-selects">
          <div className="filter-group">
            <label>TAKIM</label>
            <select className="glass-card" value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
              <option value="All">Tüm Takımlar</option>
              {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>MEVKİ</label>
            <select className="glass-card" value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
              <option value="All">Tüm Mevkiler</option>
              {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="players-list-grid">
        {filteredPlayers.length > 0 ? filteredPlayers.map((player, idx) => (
          <PlayerCard key={idx} player={player} users={users} onClick={(p, prof) => { setSelectedPlayer(p); setSelectedProfile(prof); }} />
        )) : (
          <div className="empty-state">
            <p>{searchTerm ? 'Aramanızla eşleşen oyuncu bulunamadı.' : 'Henüz ligde kayıtlı oyuncu yok.'}</p>
          </div>
        )}
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => { setSelectedPlayer(null); setSelectedProfile(null); }}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setSelectedPlayer(null); setSelectedProfile(null); }}><X /></button>
            
            <div className="modal-header">
              <div className="m-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)' }}>
                {selectedProfile && selectedProfile.avatar ? (
                  <img src={selectedProfile.avatar} alt={selectedPlayer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={64} />
                )}
              </div>
              <div className="m-title">
                <h2>{selectedPlayer.name}</h2>
                <span className="p-team-badge">{selectedPlayer.team}</span>
              </div>
            </div>

            <div className="modal-body">
              <div className="m-info-grid">
                <div className="m-info-item">
                  <label>PSO ID</label>
                  <span>#{selectedPlayer.psoId || 'Belirtilmedi'}</span>
                </div>
                <div className="m-info-item">
                  <label>Mevki</label>
                  <span>{selectedPlayer.position || 'CM'}</span>
                </div>
              </div>

              <div className="m-stats-grid">
                <div className="m-stat-box">
                  <Target className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{selectedPlayer.goals}</span>
                    <span className="m-lbl">Gol</span>
                  </div>
                </div>
                <div className="m-stat-box">
                  <Zap className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{selectedPlayer.assists}</span>
                    <span className="m-lbl">Asist</span>
                  </div>
                </div>
                <div className="m-stat-box">
                  <Shield className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{selectedPlayer.tackles || 0}</span>
                    <span className="m-lbl">Tackle</span>
                  </div>
                </div>
                <div className="m-stat-box">
                  <Trophy className="neon-text" />
                  <div className="m-stat-data">
                    <span className="m-val">{selectedPlayer.saves || 0}</span>
                    <span className="m-lbl">Kurtarış</span>
                  </div>
                </div>
              </div>

              <div className="m-footer-stats">
                <div className="f-stat-pill">Oynanan Maç: {selectedPlayer.matches}</div>
                <div className="f-stat-pill">Top Çalma: {selectedPlayer.interceptions || 0}</div>
              </div>

              {selectedProfile && selectedProfile.about && (
                <div className="profile-about-box" style={{ background: 'rgba(0,255,204,0.05)', border: '1px solid rgba(0,255,204,0.2)', padding: '1.5rem', borderRadius: '15px', marginTop: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--neon-cyan)' }}>
                    <Info size={18} /> Hakkında
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{selectedProfile.about}"
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
