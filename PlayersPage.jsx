import React, { useState } from 'react';
import { getStorageData } from '../utils/storage';
import { User, Search } from 'lucide-react';

const PlayersPage = () => {
  const { players, teams } = getStorageData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');

  const positions = ['GK', 'DEF', 'MID', 'ATT'];

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
          <div key={idx} className="glass-card player-item-card">
            <div className="p-avatar">
              <User size={32} />
            </div>
            <div className="p-info">
              <h4>{player.name}</h4>
              <div className="p-badges">
                <span className="p-team-badge">{player.team}</span>
                {player.position && <span className="p-pos-badge">{player.position}</span>}
              </div>
            </div>
            <div className="p-stats-summary">
              <div className="s-item">
                <span className="s-val">{player.matches}</span>
                <span className="s-lbl">Maç</span>
              </div>
              <div className="s-item">
                <span className="s-val">{player.goals}</span>
                <span className="s-lbl">Gol</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <p>{searchTerm ? 'Aramanızla eşleşen oyuncu bulunamadı.' : 'Henüz ligde kayıtlı oyuncu yok. Maç verisi girerek oyuncu ekleyebilirsiniz.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersPage;
