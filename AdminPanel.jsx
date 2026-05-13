import React, { useState, useEffect } from 'react';
import { processMatchJSON, getStorageData, saveStorageData, cleanTeamName } from '../utils/storage';
import { Upload, CheckCircle, AlertCircle, Trash2, Lock, LogOut, Plus, Save, ClipboardList, Info } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('json');
  const [jsonInput, setJsonInput] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [teams, setTeams] = useState([]);

  const [manualMatch, setManualMatch] = useState({
    team1: '',
    team2: '',
    score1: 0,
    score2: 0,
    playerStats: []
  });

  const [newStat, setNewStat] = useState({ playerName: '', psoId: '', shirtNumber: '', team: '', position: 'CM', goals: 0, assists: 0, saves: 0, tackles: 0 });
  
  const [showMapping, setShowMapping] = useState(false);
  const [mappingData, setMappingData] = useState({ team1: '', team2: '', t1Original: '', t2Original: '' });
  const [pendingJson, setPendingJson] = useState(null);

  const ADMIN_PASSWORD = 'Bulanahelalolsun611967';

  useEffect(() => {
    // Giriş durumunu ve takımları yükle
    const authStatus = localStorage.getItem('pso_admin_auth');
    if (authStatus === 'true') setIsAuthenticated(true);
    
    const data = getStorageData();
    setTeams(data.teams || []);
    if (data.teams && data.teams.length >= 2) {
      setManualMatch(prev => ({
        ...prev,
        team1: data.teams[0].name,
        team2: data.teams[1].name
      }));
    }
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('pso_admin_auth', 'true');
      window.dispatchEvent(new Event('storage'));
    } else {
      setLoginError('Hatalı şifre!');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pso_admin_auth');
    window.location.href = '/';
  };

  const handleJsonProcess = () => {
    try {
      if (!jsonInput.trim()) return;
      const match = JSON.parse(jsonInput);
      
      const checkTeam = (name) => {
        const search = cleanTeamName(name);
        return teams.find(t => {
          const ex = cleanTeamName(t.name);
          return ex === search || ex.includes(search) || search.includes(ex);
        });
      };

      const t1Valid = checkTeam(match.team1Stats.teamName);
      const t2Valid = checkTeam(match.team2Stats.teamName);

      if (!t1Valid || !t2Valid) {
        setPendingJson(match);
        setMappingData({
          t1Original: match.team1Stats.teamName,
          t2Original: match.team2Stats.teamName,
          team1: t1Valid ? t1Valid.name : teams[0].name,
          team2: t2Valid ? t2Valid.name : teams[1].name
        });
        setShowMapping(true);
        return;
      }

      processMatchJSON(match);
      setStatus({ type: 'success', message: 'JSON verileri başarıyla işlendi!' });
      setJsonInput('');
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Geçersiz JSON formatı!' });
    }
  };

  const confirmMapping = () => {
    processMatchJSON(pendingJson, { team1: mappingData.team1, team2: mappingData.team2 });
    setShowMapping(false);
    setPendingJson(null);
    setStatus({ type: 'success', message: 'Eşleştirme yapıldı ve maç kaydedildi!' });
    setJsonInput('');
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const addPlayerStat = () => {
    if (!newStat.playerName || !newStat.team) {
      alert('Lütfen oyuncu adı ve takım seçiniz.');
      return;
    }
    setManualMatch(prev => ({
      ...prev,
      playerStats: [...prev.playerStats, { ...newStat }]
    }));
    setNewStat({ playerName: '', psoId: '', shirtNumber: '', team: '', position: 'CM', goals: 0, assists: 0, saves: 0, tackles: 0 });
  };

  const handleManualSave = () => {
    if (manualMatch.team1 === manualMatch.team2) {
      alert('Aynı takımlar birbiriyle maç yapamaz!');
      return;
    }

    try {
      const { teams: storedTeams, players, matches } = getStorageData();
      
      const updateTeamData = (name, gf, ga) => {
        let team = storedTeams.find(t => t.name === name);
        if (team) {
          team.played += 1;
          team.gf += gf;
          team.ga += ga;
          if (gf > ga) { team.won += 1; team.points += 3; }
          else if (gf === ga) { team.drawn += 1; team.points += 1; }
          else team.lost += 1;
        }
      };

      updateTeamData(manualMatch.team1, manualMatch.score1, manualMatch.score2);
      updateTeamData(manualMatch.team2, manualMatch.score2, manualMatch.score1);

      manualMatch.playerStats.forEach(ps => {
        let p = players.find(player => player.name === ps.playerName);
        if (!p) {
          p = { name: ps.playerName, psoId: ps.psoId, shirtNumber: ps.shirtNumber, team: ps.team, position: ps.position, goals: 0, assists: 0, saves: 0, tackles: 0, interceptions: 0, matches: 0 };
          players.push(p);
        } else {
          p.position = ps.position;
          if (ps.psoId) p.psoId = ps.psoId;
          if (ps.shirtNumber) p.shirtNumber = ps.shirtNumber;
        }


        p.matches += 1;
        p.goals += Number(ps.goals);
        p.assists += Number(ps.assists);
        p.saves += Number(ps.saves);
        p.tackles += Number(ps.tackles);
      });

      matches.push({
        date: new Date().toISOString(),
        team1: manualMatch.team1,
        team2: manualMatch.team2,
        score1: manualMatch.score1,
        score2: manualMatch.score2
      });

      saveStorageData({ teams: storedTeams, players, matches });
      setStatus({ type: 'success', message: 'Maç başarıyla kaydedildi!' });
      setManualMatch(prev => ({ ...prev, score1: 0, score2: 0, playerStats: [] }));
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Kaydetme sırasında bir hata oluştu.' });
    }
  };

  const clearDatabase = () => {
    if (window.confirm('Verileri sıfırlamak istediğinize emin misiniz?')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container container admin-login-page">
        <div className="glass-card login-card">
          <div className="login-icon"><Lock size={48} className="neon-text" /></div>
          <h2>Admin <span className="neon-text">Girişi</span></h2>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" autoFocus />
            {loginError && <p className="error-text">{loginError}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Giriş Yap</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container container">
      <div className="admin-header">
        <h2 className="section-title">Admin <span className="neon-text">Paneli</span></h2>
        <button className="btn-logout" onClick={handleLogout}><LogOut size={18} /> Çıkış Yap</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'json' ? 'active' : ''} onClick={() => setActiveTab('json')}>
          <ClipboardList size={18} /> JSON ile Yükle
        </button>
        <button className={activeTab === 'manual' ? 'active' : ''} onClick={() => setActiveTab('manual')}>
          <Plus size={18} /> Elle Giriş Yap
        </button>
      </div>
      
      <div className="admin-grid">
        <div className="glass-card">
          {activeTab === 'json' ? (
            <div className="json-entry">
              <h3>JSON Verisi</h3>
              <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>PSO'dan kopyaladığınız istatistikleri buraya yapıştırın.</p>
              <textarea className="admin-textarea" placeholder='{"team1Stats": ...}' value={jsonInput} onChange={(e) => setJsonInput(e.target.value)}></textarea>
              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleJsonProcess}>
                <Upload size={20} /> Maçı İşle
              </button>
            </div>
          ) : (
            <div className="manual-entry">
              <h3>Maç Detayları</h3>
              <div className="match-entry-row">
                <div className="team-select">
                  <select value={manualMatch.team1} onChange={e => setManualMatch({...manualMatch, team1: e.target.value})}>
                    {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                  <input type="number" value={manualMatch.score1} onChange={e => setManualMatch({...manualMatch, score1: parseInt(e.target.value) || 0})} />
                </div>
                <div className="vs">VS</div>
                <div className="team-select">
                  <input type="number" value={manualMatch.score2} onChange={e => setManualMatch({...manualMatch, score2: parseInt(e.target.value) || 0})} />
                  <select value={manualMatch.team2} onChange={e => setManualMatch({...manualMatch, team2: e.target.value})}>
                    {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <h4 style={{marginTop: '2rem'}}>Oyuncu İstatistikleri Ekle</h4>
              <div className="player-stat-input-grid full-width">
                <input type="text" placeholder="Oyuncu Adı" value={newStat.playerName} onChange={e => setNewStat({...newStat, playerName: e.target.value})} />
                <input type="text" placeholder="PSO ID" value={newStat.psoId} onChange={e => setNewStat({...newStat, psoId: e.target.value})} />
                <input type="text" placeholder="Forma No" value={newStat.shirtNumber} onChange={e => setNewStat({...newStat, shirtNumber: e.target.value})} />
                <select value={newStat.team} onChange={e => setNewStat({...newStat, team: e.target.value})}>
                  <option value="">Takım Seç...</option>
                  <option value={manualMatch.team1}>{manualMatch.team1}</option>
                  <option value={manualMatch.team2}>{manualMatch.team2}</option>
                </select>
                <select value={newStat.position} onChange={e => setNewStat({...newStat, position: e.target.value})}>
                  <option value="GK">GK</option>
                  <option value="LB">LB</option>
                  <option value="RB">RB</option>
                  <option value="CM">CM</option>
                  <option value="LW">LW</option>
                  <option value="RW">RW</option>
                </select>
                <input type="number" placeholder="Gol" value={newStat.goals} onChange={e => setNewStat({...newStat, goals: parseInt(e.target.value) || 0})} />
                <input type="number" placeholder="Asist" value={newStat.assists} onChange={e => setNewStat({...newStat, assists: parseInt(e.target.value) || 0})} />
                <button className="btn-add-stat" onClick={addPlayerStat} title="Ekle"><Plus size={18} /></button>
              </div>

              <ul className="added-stats-list">
                {manualMatch.playerStats.map((ps, idx) => (
                  <li key={idx}>
                    <strong>{ps.playerName}</strong> ({ps.team} - {ps.position}) - {ps.goals} Gol, {ps.assists} Asist
                  </li>
                ))}
              </ul>

              <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={handleManualSave}>
                <Save size={20} /> Maçı Kaydet
              </button>
            </div>
          )}
          
          {status.message && (
            <div className={`status-msg ${status.type}`}>
              {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}
        </div>
        
        </div>
      </div>

      {showMapping && (
        <div className="modal-overlay" onClick={() => setShowMapping(false)}>
          <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
            <div className="mapping-header">
              <Info className="neon-text" size={32} />
              <h3>Bilinmeyen Takım Tespit Edildi</h3>
            </div>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>
              JSON verisindeki takım isimleri ligdekilerle tam eşleşmedi. Lütfen doğruluğunu kontrol edin:
            </p>

            <div className="mapping-grid">
              <div className="mapping-item">
                <label>JSON'daki İsim: <strong>{mappingData.t1Original}</strong></label>
                <select value={mappingData.team1} onChange={e => setMappingData({...mappingData, team1: e.target.value})}>
                  {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="mapping-item">
                <label>JSON'daki İsim: <strong>{mappingData.t2Original}</strong></label>
                <select value={mappingData.team2} onChange={e => setMappingData({...mappingData, team2: e.target.value})}>
                  {teams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mapping-btns" style={{marginTop: '2rem', display: 'flex', gap: '1rem'}}>
              <button className="btn-primary" onClick={confirmMapping} style={{flex: 1}}>Eşleştirmeyi Onayla</button>
              <button className="btn-secondary" onClick={() => setShowMapping(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
