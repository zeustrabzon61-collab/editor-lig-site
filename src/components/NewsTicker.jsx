import React, { useState, useEffect } from 'react';
import { getStorageData } from '../utils/storage';
import { Trophy, Star, TrendingUp, Zap } from 'lucide-react';

const NewsTicker = () => {
  const { matches, players } = getStorageData();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Verileri Hazırla
  const recentMatches = matches.slice(-3).reverse();
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 3);
  const topAssists = [...players].sort((a, b) => b.assists - a.assists).slice(0, 3);

  const newsItems = [
    {
      type: 'league',
      title: 'EDİTÖR LİG HEYECANI',
      content: '12 Haftalık kıran kırana mücadele devam ediyor!',
      icon: <Zap size={20} color="#00f2ff" />
    },
    ...recentMatches.map(m => ({
      type: 'match',
      title: 'SON MAÇ SONUCU',
      content: `${m.team1} ${m.score1} - ${m.score2} ${m.team2}`,
      icon: <Trophy size={20} color="#ffd700" />
    })),
    ...topScorers.map(p => ({
      type: 'stat',
      title: 'GOL KRALLIĞI',
      content: `${p.name} (${p.goals} Gol) - ${p.team}`,
      icon: <Star size={20} color="#ff3366" />
    })),
    ...topAssists.map(p => ({
      type: 'stat',
      title: 'ASİST KRALLIĞI',
      content: `${p.name} (${p.assists} Asist) - ${p.team}`,
      icon: <TrendingUp size={20} color="#00ff88" />
    }))
  ];

  useEffect(() => {
    if (newsItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  if (newsItems.length === 0) return null;

  const currentNews = newsItems[currentIndex];

  return (
    <div className="ticker-container container" style={{ margin: '2rem auto' }}>
      <div className="glass-card ticker-card" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        overflow: 'hidden',
        height: '70px',
        position: 'relative',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <div className="ticker-badge" style={{ 
          background: 'var(--accent-primary)', 
          color: '#000', 
          padding: '0.3rem 0.8rem', 
          borderRadius: '4px', 
          fontSize: '0.7rem', 
          fontWeight: '900',
          marginRight: '1.5rem',
          whiteSpace: 'nowrap'
        }}>
          SON DAKİKA
        </div>

        <div key={currentIndex} className="animate-slide-up" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          animation: 'slideUp 0.5s ease-out'
        }}>
          {currentNews.icon}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: '800', letterSpacing: '1px' }}>
              {currentNews.title}
            </span>
            <span style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>
              {currentNews.content}
            </span>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          {newsItems.map((_, i) => (
            <div key={i} style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: i === currentIndex ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
