

const teams = ["BAY FC", "HAYAT OKULU FC", "OOG FC", "ANTONY ULTRAS FC"];

// Fikstür oluşturma algoritması (Round-robin döngüsü)
const generateFixtures = (numWeeks) => {
  const fixtures = [];
  const baseRounds = [
    [ [teams[0], teams[3]], [teams[1], teams[2]] ], // Hafta 1
    [ [teams[0], teams[2]], [teams[3], teams[1]] ], // Hafta 2
    [ [teams[0], teams[1]], [teams[2], teams[3]] ]  // Hafta 3
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

const fixturesData = generateFixtures(16);

const FixturesPage = () => {
  return (
    <div className="page-container container">
      <h2 className="section-title">16 Haftalık <span className="neon-text">Fikstür</span></h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Editör Lig heyecanı başlıyor! Maçlar her gün düzenli olarak oynanacaktır.
      </p>
      
      <div className="fixtures-grid">
        {fixturesData.map((weekData) => (
          <div key={weekData.week} className="glass-card fixture-card">
            <div className="fixture-week">HAFTA {weekData.week}</div>
            {weekData.matches.map((match, idx) => (
              <div key={idx} className="match-row">
                <div className="match-team">{match[0]}</div>
                <div className="match-score">VS</div>
                <div className="match-team">{match[1]}</div>
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
