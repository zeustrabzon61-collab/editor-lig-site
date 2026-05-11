import React, { useState } from 'react';
import { getStorageData } from '../utils/storage';
import { User, Search } from 'lucide-react';

const PlayersPage = () => {
  const { players } = getStorageData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container container">
      <h2 className="section-title">Lig <span className="neon-text">Oyuncuları</span></h2>
      
      <div className="players-search-wrapper">
        <div className="search-bar glass-card">
          <Search size={20} className="text-secondary" />
          <input 
            type="text" 
            placeholder="Oyuncu veya takım ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <span className="p-team-badge">{player.team}</span>
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
