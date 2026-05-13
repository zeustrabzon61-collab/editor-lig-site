

import { getStorageData } from '../utils/storage';

const { teams: storedTeams } = getStorageData();
const teams = storedTeams.map(t => t.name);

const getLogo = (teamName) => {
  const team = storedTeams.find(t => t.name.toUpperCase() === teamName.toUpperCase());
  return team ? team.logo : null;
};

// Fikstür oluşturma algoritması (Round-robin döngüsü)
const generateFixtures = (numWeeks) => {
  const fixtures = [];
  const baseRounds = [
    [ ['BAY FC', 'HAYAT OKULU FC'], ['ANTONY ULTRAS FC', 'OOG FC'] ], // Hafta 1
    [ ['ANTONY ULTRAS FC', 'BAY FC'], ['OOG FC', 'HAYAT OKULU FC'] ], // Hafta 2
    [ ['OOG FC', 'BAY FC'], ['ANTONY ULTRAS FC', 'HAYAT OKULU FC'] ]  // Hafta 3
  ];

  for (let i = 0; i < numWeeks; i++) {
    const roundIndex = i % 3;
    fixtures.push({
      week: i + 1,
      matches: baseRounds[roundIndex]
    });
  }
  return fixtures;
};

const fixturesData = generateFixtures(12);

const FixturesPage = () => {
  return (
    <div className="page-container container">
      <h2 className="section-title">12 Haftalık <span className="neon-text">Fikstür</span></h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Editör Lig heyecanı başlıyor! Maçlar her gün düzenli olarak oynanacaktır.
      </p>
      
      <div className="fixtures-grid">
        {fixturesData.map((weekData) => (
          <div key={weekData.week} className="glass-card fixture-card">
            <div className="fixture-week">HAFTA {weekData.week}</div>
            {weekData.matches.map((match, idx) => (
              <div key={idx} className="match-row">
                <div className="match-team">
                  <img src={getLogo(match[0])} alt="" className="fixture-logo" onError={(e) => e.target.style.display = 'none'} />
                  {match[0]}
                </div>
                <div className="match-score">VS</div>
                <div className="match-team">
                  {match[1]}
                  <img src={getLogo(match[1])} alt="" className="fixture-logo" onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="empty-state">
        <p>Tüm maçlar lig yönetimi tarafından belirlenen saatlerde oynanacaktır.</p>
      </div>
    </div>
  );
};

export default FixturesPage;
