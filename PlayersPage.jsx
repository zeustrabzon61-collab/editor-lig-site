import React, { useState } from 'react';
import { getStorageData } from '../utils/storage';
import { User, Search, X, Trophy, Target, Shield, Zap } from 'lucide-react';

const PlayerCard = ({ player, onClick }) => {
  return (
    <div className="fifa-card-container animate-fade-in" onClick={() => onClick(player)}>
      <div className="fifa-card">
        <div className="fifa-card-inner">
          <div className="fifa-card-top">
            <div className="f-rating">{Math.min(99, 70 + (player.goals * 2) + (player.assists))}</div>
            <div className="f-position">{player.position || 'ST'}</div>
          </div>
          <div className="f-avatar-area">
            <User size={80} strokeWidth={1} />
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
  const { players, teams } = getStorageData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

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
          <PlayerCard key={idx} player={player} onClick={setSelectedPlayer} />
        )) : (
          <div className="empty-state">
            <p>{searchTerm ? 'Aramanızla eşleşen oyuncu bulunamadı.' : 'Henüz ligde kayıtlı oyuncu yok.'}</p>
          </div>
        )}
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPlayer(null)}><X /></button>
            
            <div className="modal-header">
              <div className="m-avatar"><User size={64} /></div>
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
                  <label>Forma No</label>
                  <span>{selectedPlayer.shirtNumber || '--'}</span>
                </div>
                <div className="m-info-item">
                  <label>Mevki</label>
                  <span>{selectedPlayer.position || 'ATT'}</span>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
