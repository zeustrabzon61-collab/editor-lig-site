import React, { useState, useEffect } from 'react';
import { getStorageData, getTOTW } from '../utils/storage';

const TeamOfTheWeek = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [manualTotw, setManualTotw] = useState(null);
  const { players, matches: storedMatches } = getStorageData();

  useEffect(() => {
    const manual = getTOTW(selectedWeek);
    setManualTotw(manual);
  }, [selectedWeek]);
  
  // Haftada 2 maç olduğu varsayımıyla (4 takım)
  const weekMatches = storedMatches.slice((selectedWeek - 1) * 2, selectedWeek * 2);
  const isPlayed = weekMatches.length > 0;

  // Haftalık maçlardan oyuncu performanslarını topla
  const weekPerformances = [];
  weekMatches.forEach(m => {
    if (m.playerStats) {
      weekPerformances.push(...m.playerStats);
    }
  });

  const getTopPlayerByPos = (posFilter, posKey) => {
    // 1. Manuel seçim varsa onu kullan
    if (manualTotw && manualTotw[posKey]) {
      const p = players.find(player => player.name === manualTotw[posKey]);
      if (p) return p;
      return { name: manualTotw[posKey], team: 'Bilinmiyor', position: posKey };
    }

    // 2. Yoksa otomatik hesapla
    let pool = weekPerformances.filter(p => posFilter.includes(p.position));

    if (pool.length === 0) return { name: 'Seçilmedi', team: '-', position: posFilter[0] };
    
    return pool.sort((a, b) => {
      const scoreA = (a.goals * 3) + (a.assists * 2) + (a.saves * 3) + (a.tackles * 1.5) + a.interceptions;
      const scoreB = (b.goals * 3) + (b.assists * 2) + (b.saves * 3) + (b.tackles * 1.5) + b.interceptions;
      return scoreB - scoreA;
    })[0];
  };

  const totw = {
    GK: getTopPlayerByPos(['GK'], 'GK'),
    LB: getTopPlayerByPos(['LB', 'LWB', 'DEF'], 'LB'),
    RB: getTopPlayerByPos(['RB', 'RWB', 'DEF'], 'RB'),
    CM: getTopPlayerByPos(['CM', 'CDM', 'CAM', 'MID'], 'CM'),
    LW: getTopPlayerByPos(['LW', 'LM', 'ATT'], 'LW'),
    RW: getTopPlayerByPos(['RW', 'RM', 'ATT'], 'RW')
  };

  // Eğer aynı oyuncu iki defa gelirse engellemek için basit bir hack yapılabilir ama demo için sorun değil.

  const renderPlayerNode = (player, top, left) => (
    <div style={{
      position: 'absolute',
      top, left,
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100px',
      zIndex: 2
    }}>
      <div style={{
        width: '50px', height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        border: '2px solid #fff',
        boxShadow: '0 0 15px rgba(0,255,204,0.5)',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: '#000'
      }}>
        {player.position}
      </div>
      {isPlayed ? (
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
            {player.name}
          </div>
          <div style={{ color: '#00ffcc', fontSize: '0.65rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
            {player.team}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          height: '24px',
          width: '80px',
          borderRadius: '4px',
          border: '1px dashed rgba(255,255,255,0.2)'
        }}></div>
      )}
    </div>
  );

  return (
    <div className="page-container container">
      <h2 className="section-title">Haftanın <span className="neon-text">Takımı</span></h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Her haftanın en göze çarpan 6 oyuncusu.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <select 
          value={selectedWeek} 
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid var(--primary-color)',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1.1rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(week => (
            <option key={week} value={week} style={{ background: '#121212' }}>{week}. Hafta</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          aspectRatio: '0.7',
          background: 'linear-gradient(to bottom, #1a4f21, #0d2b11)',
          borderRadius: '12px',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          overflow: 'hidden'
        }}>
          {/* Pitch Lines */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#fff' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #fff', transform: 'translate(-50%, -50%)' }}></div>
            <div style={{ position: 'absolute', bottom: '-10px', left: '50%', width: '200px', height: '100px', border: '2px solid #fff', transform: 'translateX(-50%)' }}></div>
            <div style={{ position: 'absolute', bottom: '-10px', left: '50%', width: '100px', height: '50px', border: '2px solid #fff', transform: 'translateX(-50%)' }}></div>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', width: '200px', height: '100px', border: '2px solid #fff', transform: 'translateX(-50%)' }}></div>
            <div style={{ position: 'absolute', top: '-10px', left: '50%', width: '100px', height: '50px', border: '2px solid #fff', transform: 'translateX(-50%)' }}></div>
          </div>

          {/* Players */}
          {renderPlayerNode(totw.GK, '85%', '50%')}
          {renderPlayerNode(totw.LB, '65%', '20%')}
          {renderPlayerNode(totw.RB, '65%', '80%')}
          {renderPlayerNode(totw.CM, '45%', '50%')}
          {renderPlayerNode(totw.LW, '20%', '25%')}
          {renderPlayerNode(totw.RW, '20%', '75%')}
        </div>
      </div>
    </div>
  );
};

export default TeamOfTheWeek;
