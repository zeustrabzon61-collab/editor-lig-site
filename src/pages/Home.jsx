import React from 'react';
import Hero from '../components/Hero';
import Standings from '../components/Standings';
import { getStorageData } from '../utils/storage';
import { Clock } from 'lucide-react';

const Home = () => {
  const { matches } = getStorageData();
  
  // En son oynanan 3 maçı al (tersten sırala)
  const recentMatches = [...matches].reverse().slice(0, 3);

  return (
    <>
      <Hero />
      
      {/* Son Maç Sonuçları Bölümü */}
      <section className="results-section container">
        <h2 className="section-title">Son <span className="neon-text">Sonuçlar</span></h2>
        <div className="results-grid">
          {recentMatches.length > 0 ? recentMatches.map((match, idx) => (
            <div key={idx} className="glass-card match-result-card">
              <div className="match-date">
                <Clock size={14} /> {new Date(match.date).toLocaleDateString('tr-TR')}
              </div>
              <div className="match-main">
                <div className="m-team">{match.team1}</div>
                <div className="m-score">{match.score1} - {match.score2}</div>
                <div className="m-team">{match.team2}</div>
              </div>
            </div>
          )) : (
            <div className="glass-card empty-results">
              <p>Henüz oynanmış maç bulunmuyor. Ligin başlaması bekleniyor!</p>
            </div>
          )}
        </div>
      </section>

      <Standings />

      <section className="news-section container">
        <h2 className="section-title">Lig <span className="neon-text">Haberleri</span></h2>
        <div className="news-grid">
          <div className="glass-card news-card">
            <div className="news-img-placeholder"></div>
            <h3>Editör Lig Başlıyor!</h3>
            <p>16 haftalık dev maraton için tüm hazırlıklar tamamlandı.</p>
          </div>
          <div className="glass-card news-card">
            <div className="news-img-placeholder"></div>
            <h3>Yeni Transfer Dönemi</h3>
            <p>Takımlar kadrolarını güçlendirmek için çalışmalara başladı.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
