import React from 'react';
import Standings from '../components/Standings';
import Hero from '../components/Hero';
import { getStorageData } from '../utils/storage';
import { Calendar, Trophy, BarChart3, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Home = () => {
  const { matches } = getStorageData();
  const recentMatches = matches.slice(-3).reverse();

  return (
    <div className="home-page">
      <Hero />
      
      <section className="main-content container">
        <div className="home-grid">
          <div className="main-col">
            <div className="section-header">
              <h2 className="section-title"><Trophy className="neon-text" size={32} /> LİG <span className="gradient-text">TABLOSU</span></h2>
              <NavLink to="/puan-durumu" className="view-all">Tümünü Gör <ArrowRight size={16} /></NavLink>
            </div>
            <div className="glass-card standings-card">
              <Standings limit={4} />
            </div>
          </div>

          <aside className="side-col">
            <div className="section-header">
              <h2 className="section-title"><Calendar className="neon-text" size={32} /> SON <span className="gradient-text">SONUÇLAR</span></h2>
            </div>
            <div className="results-list">
              {recentMatches.length > 0 ? recentMatches.map((match, idx) => (
                <div key={idx} className="glass-card result-card">
                  <div className="r-teams">
                    <div className="r-team">
                      <div className="r-logo">{match.team1[0]}</div>
                      <span className="r-name">{match.team1}</span>
                    </div>
                    <div className="r-score-box">
                      <span className="r-score">{match.score1}</span>
                      <span className="r-divider">:</span>
                      <span className="r-score">{match.score2}</span>
                    </div>
                    <div className="r-team">
                      <div className="r-logo">{match.team2[0]}</div>
                      <span className="r-name">{match.team2}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="glass-card empty-results">
                  <p>Henüz maç oynanmadı.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="quick-links container">
        <div className="links-grid">
          <NavLink to="/fikstur" className="glass-card link-card">
            <Calendar size={40} className="neon-text" />
            <h3>Fikstür</h3>
            <p>Maç takvimini incele</p>
          </NavLink>
          <NavLink to="/oyuncular" className="glass-card link-card">
            <Trophy size={40} className="neon-text" />
            <h3>Oyuncular</h3>
            <p>Ligdeki tüm yıldızlar</p>
          </NavLink>
          <NavLink to="/istatistikler" className="glass-card link-card">
            <BarChart3 size={40} className="neon-text" />
            <h3>Krallıklar</h3>
            <p>Gol ve asist liderleri</p>
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Home;
