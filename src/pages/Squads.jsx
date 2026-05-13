import React from 'react';
import { getStorageData } from '../utils/storage';

const Squads = () => {
  const { teams, players } = getStorageData();

  return (
    <div className="page-container container">
      <h2 className="section-title">Takım <span className="neon-text">Kadroları</span></h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Tüm takımların güncel oyuncu listeleri ve istatistikleri.
      </p>
      
      <div className="squads-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {teams.map(team => {
          const teamPlayers = players.filter(p => p.team.toUpperCase() === team.name.toUpperCase());
          
          return (
            <div key={team.name} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                <img src={team.logo} alt={team.name} style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '1rem' }} onError={(e) => e.target.style.display = 'none'} />
                <h3 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>{team.name}</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {teamPlayers.length > 0 ? (
                  teamPlayers.map((player, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold', color: '#00ffcc', fontSize: '1.1rem' }}>{player.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Mevki: {player.position}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Maç: {player.matches} | Gol: {player.goals} | Asist: {player.assists}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>Henüz oyuncu bulunmuyor.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Squads;
