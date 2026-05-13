import React from 'react';
import { getStorageData, cleanTeamName } from '../utils/storage';

const FixturesPage = () => {
  const { teams: storedTeams, matches: storedMatches } = getStorageData();
  const teams = storedTeams.map(t => t.name);

  const getLogo = (teamName) => {
    const team = storedTeams.find(t => t.name.toUpperCase() === teamName.toUpperCase());
    return team ? team.logo : null;
  };

  const generateFixtures = (numWeeks) => {
    const fixtures = [];
    const baseRounds = [
      [ ['BAY FC', 'HAYAT OKULU FC'], ['ANTONY ULTRAS FC', 'OOG FC'] ], // Hafta 1
      [ ['ANTONY ULTRAS FC', 'BAY FC'], ['OOG FC', 'HAYAT OKULU FC'] ], // Hafta 2
      [ ['OOG FC', 'BAY FC'], ['ANTONY ULTRAS FC', 'HAYAT OKULU FC'] ]  // Hafta 3
    ];

    const matchupCounts = {};

    for (let i = 0; i < numWeeks; i++) {
      const roundIndex = i % 3;
      const roundMatches = baseRounds[roundIndex].map(match => {
        const teamA = match[0];
        const teamB = match[1];
        
        const matchKey = [cleanTeamName(teamA), cleanTeamName(teamB)].sort().join('-');
        if (!matchupCounts[matchKey]) matchupCounts[matchKey] = 0;
        
        const matchesBetweenThem = storedMatches.filter(m => {
          const t1 = cleanTeamName(m.team1);
          const t2 = cleanTeamName(m.team2);
          const a = cleanTeamName(teamA);
          const b = cleanTeamName(teamB);
          return (t1 === a && t2 === b) || (t1 === b && t2 === a);
        });

        const playedMatch = matchesBetweenThem[matchupCounts[matchKey]];
        matchupCounts[matchKey]++;

        let score1 = null, score2 = null;
        let t1Scorers = [], t2Scorers = [], t1Assists = [], t2Assists = [];

        if (playedMatch) {
          const isTeamAFirst = cleanTeamName(playedMatch.team1) === cleanTeamName(teamA);
          score1 = isTeamAFirst ? playedMatch.score1 : playedMatch.score2;
          score2 = isTeamAFirst ? playedMatch.score2 : playedMatch.score1;

          const scorers = playedMatch.scorers || [];
          const assists = playedMatch.assists || [];

          t1Scorers = scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(teamA));
          t2Scorers = scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(teamB));
          
          t1Assists = assists.filter(a => cleanTeamName(a.team) === cleanTeamName(teamA));
          t2Assists = assists.filter(a => cleanTeamName(a.team) === cleanTeamName(teamB));
        }

        return {
          team1: teamA,
          team2: teamB,
          played: !!playedMatch,
          score1,
          score2,
          t1Scorers,
          t2Scorers,
          t1Assists,
          t2Assists
        };
      });

      fixtures.push({
        week: i + 1,
        matches: roundMatches
      });
    }
    return fixtures;
  };

  const fixturesData = generateFixtures(12);

  return (
    <div className="page-container container">
      <h2 className="section-title">12 Haftalık <span className="neon-text">Fikstür</span></h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Editör Lig heyecanı! Maç skorları ve detayları burada yer almaktadır.
      </p>
      
      <div className="fixtures-grid">
        {fixturesData.map((weekData) => (
          <div key={weekData.week} className="glass-card fixture-card" style={{ height: 'auto' }}>
            <div className="fixture-week">HAFTA {weekData.week}</div>
            {weekData.matches.map((match, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem', borderBottom: idx === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', paddingBottom: idx === 0 ? '1.5rem' : '0' }}>
                <div className="match-row" style={{ padding: '0.5rem 0' }}>
                  <div className="match-team" style={{ flex: 1, justifyContent: 'flex-end', textAlign: 'right' }}>
                    <span style={{ marginRight: '0.5rem' }}>{match.team1}</span>
                    <img src={getLogo(match.team1)} alt="" className="fixture-logo" onError={(e) => e.target.style.display = 'none'} style={{ margin: 0 }} />
                  </div>
                  
                  <div className="match-score" style={{ 
                    flex: '0 0 80px', 
                    height: '40px',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: match.played ? '1.5rem' : '1.2rem', 
                    color: match.played ? '#ffffff' : 'var(--text-secondary)',
                    borderRadius: '8px'
                  }}>
                    {match.played ? `${match.score1} - ${match.score2}` : 'VS'}
                  </div>
                  
                  <div className="match-team" style={{ flex: 1, justifyContent: 'flex-start', textAlign: 'left' }}>
                    <img src={getLogo(match.team2)} alt="" className="fixture-logo" onError={(e) => e.target.style.display = 'none'} style={{ margin: 0 }} />
                    <span style={{ marginLeft: '0.5rem' }}>{match.team2}</span>
                  </div>
                </div>

                {match.played && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', padding: '0 1rem' }}>
                    <div style={{ flex: 1, textAlign: 'right', paddingRight: '2rem' }}>
                      {match.t1Scorers.length > 0 && <div style={{ color: '#fff', marginBottom: '0.3rem' }}>⚽ {match.t1Scorers.map(s => `${s.playerName} (${s.goals})`).join(', ')}</div>}
                      {match.t1Assists.length > 0 && <div>👟 {match.t1Assists.map(a => `${a.playerName} (${a.assists})`).join(', ')}</div>}
                    </div>
                    <div style={{ flex: 1, textAlign: 'left', paddingLeft: '2rem' }}>
                      {match.t2Scorers.length > 0 && <div style={{ color: '#fff', marginBottom: '0.3rem' }}>⚽ {match.t2Scorers.map(s => `${s.playerName} (${s.goals})`).join(', ')}</div>}
                      {match.t2Assists.length > 0 && <div>👟 {match.t2Assists.map(a => `${a.playerName} (${a.assists})`).join(', ')}</div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FixturesPage;
