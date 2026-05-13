import React from 'react';
import { getStorageData } from '../utils/storage';
import { Trophy, Star, Shield, Crosshair } from 'lucide-react';

const Leaderboards = () => {
  const [data, setData] = React.useState(getStorageData());

  React.useEffect(() => {
    const handleSync = () => setData(getStorageData());
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const { players } = data;

  const getTop = (key, limit = 10) => {
    return [...players].sort((a, b) => b[key] - a[key]).slice(0, limit);
  };

  return (
    <div className="page-container container">
      <h2 className="section-title">Lig <span className="neon-text">İstatistikleri</span></h2>
      
      <div className="leaderboards-grid">
        <LeaderboardTable 
          title="Gol Krallığı" 
          icon={<Trophy size={18} color="#ffd700" />} 
          data={getTop('goals')} 
          statKey="goals" 
          label="Gol" 
        />
        <LeaderboardTable 
          title="Asist Krallığı" 
          icon={<Star size={18} color="#00f2ff" />} 
          data={getTop('assists')} 
          statKey="assists" 
          label="Asist" 
        />
        <LeaderboardTable 
          title="Kurtarış Krallığı" 
          icon={<Shield size={18} color="#00ff64" />} 
          data={getTop('saves')} 
          statKey="saves" 
          label="Kurtarış" 
        />
        <LeaderboardTable 
          title="Tackle Krallığı" 
          icon={<Crosshair size={18} color="#ff4444" />} 
          data={getTop('tackles')} 
          statKey="tackles" 
          label="Tackle" 
        />
      </div>
    </div>
  );
};

const LeaderboardTable = ({ title, icon, data, statKey, label }) => (
  <div className="glass-card leaderboard-card">
    <div className="card-header">
      {icon}
      <h3>{title}</h3>
    </div>
    <table className="mini-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Oyuncu / Takım</th>
          <th style={{ textAlign: 'right' }}>{label}</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? data.map((player, idx) => (
          <tr key={idx}>
            <td className="rank-cell">{idx + 1}</td>
            <td>
              <div className="p-name">{player.name}</div>
              <div className="p-team-badge">{player.team}</div>
            </td>
            <td className="stat-value-cell">
              {player[statKey]}
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="3" style={{ textAlign: 'center', opacity: 0.5, padding: '2rem' }}>Henüz veri yok</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default Leaderboards;
