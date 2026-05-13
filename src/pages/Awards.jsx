import React from 'react';
import { getStorageData } from '../utils/storage';
import { Trophy, Star, Shield, Zap } from 'lucide-react';

const Awards = () => {
  const { players } = getStorageData();

  // Calculate potential winners based on stats
  const goldenBoot = [...players].sort((a, b) => b.goals - a.goals)[0];
  const goldenGlove = [...players].sort((a, b) => b.saves - a.saves)[0];
  const ballonDor = [...players].sort((a, b) => (b.goals * 2 + b.assists + b.interceptions * 0.5) - (a.goals * 2 + a.assists + a.interceptions * 0.5))[0];

  const awardCategories = [
    {
      id: 'ballondor',
      title: "Ballon d'Or",
      icon: <Star size={32} color="#ffd700" />,
      winner: ballonDor || { name: 'Bilinmiyor', team: '-' },
      description: "Sezonun en etkili ve en yüksek performans gösteren oyuncusu."
    },
    {
      id: 'goldenboot',
      title: "Altın Ayakkabı",
      icon: <Trophy size={32} color="#ff9900" />,
      winner: goldenBoot || { name: 'Bilinmiyor', team: '-' },
      description: "Ligin gol kralı."
    },
    {
      id: 'goldenglove',
      title: "Altın Eldiven",
      icon: <Shield size={32} color="#00ccff" />,
      winner: goldenGlove || { name: 'Bilinmiyor', team: '-' },
      description: "Kalesini en çok gole kapatan ve en çok kurtarış yapan kaleci."
    },
    {
      id: 'puskas',
      title: "Puskas Ödülü",
      icon: <Zap size={32} color="#ff3366" />,
      winner: { name: 'Yakında', team: 'Oylama Bekleniyor' },
      description: "Sezonun en estetik ve unutulmaz golü."
    }
  ];

  return (
    <div className="page-container container">
      <h2 className="section-title">Lig <span className="neon-text">Ödülleri</span></h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        Sezon sonunda sahiplerini bulacak olan prestijli ödüller ve adaylar.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '2rem' 
      }}>
        {awardCategories.map((award) => (
          <div key={award.id} className="glass-card" style={{ 
            padding: '2.5rem', 
            textAlign: 'center',
            transition: 'transform 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              marginBottom: '1.5rem', 
              display: 'inline-flex', 
              padding: '1.5rem', 
              borderRadius: '50%', 
              background: 'rgba(255,255,255,0.05)',
              boxShadow: '0 0 20px rgba(0,255,204,0.1)'
            }}>
              {award.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>{award.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{award.description}</p>
            
            <div style={{ 
              marginTop: '1rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(255,255,255,0.1)' 
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Güncel Lider</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{award.winner.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{award.winner.team}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Awards;
