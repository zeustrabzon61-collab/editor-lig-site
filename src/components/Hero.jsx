import React from 'react';
import { PlayCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text-area">
          <span className="badge">EDİTÖR LİG BAŞLIYOR</span>
          <h1 className="hero-title">
            REKABETİN YENİ ADRESİ: <span className="neon-text">EDİTÖR</span> LİG
          </h1>
          <p className="hero-description">
            4 Dev takım, 16 Haftalık amansız mücadele. BAY FC, HAYAT OKULU FC, OOG FC 
            ve ANTONY ULTRAS FC şampiyonluk için sahaya çıkıyor.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/fikstur')}>
              Fikstürü Gör <PlayCircle size={20} />
            </button>
            <a 
              href="https://discord.gg/FzvUPzj3fU" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary"
            >
              Discord <ShieldCheck size={20} />
            </a>
          </div>
        </div>
        
        <div className="hero-stats-preview glass-card">
          <div className="stat-item">
            <span className="stat-value">4</span>
            <span className="stat-label">Takım</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">16</span>
            <span className="stat-label">Hafta</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">32</span>
            <span className="stat-label">Maç</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
