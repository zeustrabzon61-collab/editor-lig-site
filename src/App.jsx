import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StandingsPage from './pages/StandingsPage';
import FixturesPage from './pages/FixturesPage';
import AdminPanel from './pages/AdminPanel';
import Leaderboards from './pages/Leaderboards';
import PlayersPage from './pages/PlayersPage';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Squads from './pages/Squads';
import TeamOfTheWeek from './pages/TeamOfTheWeek';
import Awards from './pages/Awards';
import GlobalChat from './components/GlobalChat';
import { initCloudSync } from './utils/storage';

function App() {
  React.useEffect(() => {
    initCloudSync();
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puan-durumu" element={<StandingsPage />} />
            <Route path="/fikstur" element={<FixturesPage />} />
            <Route path="/istatistikler" element={<Leaderboards />} />
            <Route path="/oyuncular" element={<PlayersPage />} />
            <Route path="/kadrolar" element={<Squads />} />
            <Route path="/haftanin-takimi" element={<TeamOfTheWeek />} />
            <Route path="/oduller" element={<Awards />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 Editör Lig. Tüm Hakları Saklıdır.</p>
          </div>
        </footer>

        <GlobalChat />
      </div>
    </Router>
  );
}

export default App;
