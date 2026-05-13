import React from 'react';
import { NavLink } from 'react-router-dom';
import { Play, MessageCircle, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-badge animate-float">LİG TÜM HIZIYLA DEVAM EDİYOR</div>
        <h1 className="hero-title">EDİTÖRLERİN <span className="gradient-text">ARENASI</span></h1>
        <p className="hero-subtitle">
          Zirve yarışı kızışıyor. 4 dev takımın amansız şampiyonluk 
          mücadelesini yakından takip et.
        </p>
        
        <div className="hero-btns">
          <NavLink to="/fikstur" className="btn-primary">
            <Play size={20} fill="black" /> Fikstürü Gör
          </NavLink>
          <a href="https://discord.gg/FzvUPzj3fU" target="_blank" rel="noreferrer" className="btn-secondary">
            <MessageCircle size={20} /> Topluluğa Katıl
          </a>
        </div>

        <div className="hero-stats animate-fade-in">
          <div className="h-stat-item">
            <h3 className="neon-text">4</h3>
            <p>Dev Takım</p>
          </div>
          <div className="h-stat-item">
            <h3 className="neon-text">12</h3>
            <p>Haftalık Lig</p>
          </div>
          <div className="h-stat-item">
            <h3 className="neon-text">12</h3>
            <p>MAÇ</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
