import React from 'react';
import { getStorageData, cleanTeamName, getComments, addComment, getCurrentUser } from '../utils/storage';
import { MessageSquare, Send, X, User } from 'lucide-react';

const FixturesPage = () => {
  const { teams: storedTeams, matches: storedMatches } = getStorageData();
  const [selectedMatch, setSelectedMatch] = React.useState(null);
  const [commentText, setCommentText] = React.useState('');
  const [matchComments, setMatchComments] = React.useState([]);
  const user = getCurrentUser();

  const loadComments = (matchId) => {
    if (!matchId) return;
    setMatchComments(getComments(matchId));
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !user || !selectedMatch) return;
    addComment(selectedMatch.id || `${selectedMatch.team1}-${selectedMatch.team2}-${selectedMatch.score1}`, user, commentText);
    setCommentText('');
    loadComments(selectedMatch.id || `${selectedMatch.team1}-${selectedMatch.team2}-${selectedMatch.score1}`);
  };
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

          // Daha esnek eşleştirme için cleanTeamName kullanıyoruz
          t1Scorers = scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(teamA));
          t2Scorers = scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(teamB));
          
          t1Assists = assists.filter(a => cleanTeamName(a.team) === cleanTeamName(teamA));
          t2Assists = assists.filter(a => cleanTeamName(a.team) === cleanTeamName(teamB));

          // Eğer hala boşsa (isim farkından dolayı), tüm golleri/asistleri dağıtmayı dene (yedek plan)
          if (t1Scorers.length === 0 && t2Scorers.length === 0 && scorers.length > 0) {
             // Bu durum genellikle team mapping hatalarında olur
             // Şimdilik veriyi olduğu gibi alalım
             t1Scorers = isTeamAFirst ? scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(playedMatch.team1)) : scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(playedMatch.team2));
             t2Scorers = isTeamAFirst ? scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(playedMatch.team2)) : scorers.filter(s => cleanTeamName(s.team) === cleanTeamName(playedMatch.team1));
          }
        }

        return {
          id: playedMatch ? (playedMatch.id || `${teamA}-${teamB}-${score1}`) : null,
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
                  <div 
                    className={`match-row ${match.played ? 'played-clickable' : ''}`} 
                    style={{ padding: '0.5rem 0', cursor: match.played ? 'pointer' : 'default' }}
                    onClick={() => {
                      if (match.played) {
                        setSelectedMatch(match);
                        loadComments(match.id);
                      }
                    }}
                  >
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

      {/* Match Details Modal */}
      {selectedMatch && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px'
        }}>
          <div className="glass-card modal-content" style={{
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            position: 'relative', border: '1px solid var(--accent-primary)'
          }}>
            <button 
              onClick={() => setSelectedMatch(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '800', marginBottom: '1rem' }}>MAÇ DETAYLARI</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <img src={getLogo(selectedMatch.team1)} style={{ width: '60px', height: '60px', objectFit: 'contain' }} alt="" />
                  <div style={{ fontWeight: '900', marginTop: '0.5rem' }}>{selectedMatch.team1}</div>
                </div>
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-primary)' }}>{selectedMatch.score1} - {selectedMatch.score2}</div>
                <div style={{ textAlign: 'center' }}>
                  <img src={getLogo(selectedMatch.team2)} style={{ width: '60px', height: '60px', objectFit: 'contain' }} alt="" />
                  <div style={{ fontWeight: '900', marginTop: '0.5rem' }}>{selectedMatch.team2}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', marginBottom: '0.5rem' }}>{selectedMatch.team1.split(' ')[0]} GOLLER</div>
                {selectedMatch.t1Scorers.map((s, i) => <div key={i} style={{ fontSize: '0.9rem' }}>⚽ {s.playerName} ({s.goals})</div>)}
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', marginTop: '1rem', marginBottom: '0.5rem' }}>ASİSTLER</div>
                {selectedMatch.t1Assists.map((a, i) => <div key={i} style={{ fontSize: '0.9rem' }}>👟 {a.playerName} ({a.assists})</div>)}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', marginBottom: '0.5rem' }}>{selectedMatch.team2.split(' ')[0]} GOLLER</div>
                {selectedMatch.t2Scorers.map((s, i) => <div key={i} style={{ fontSize: '0.9rem' }}>{s.playerName} ({s.goals}) ⚽</div>)}
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800', marginTop: '1rem', marginBottom: '0.5rem' }}>ASİSTLER</div>
                {selectedMatch.t2Assists.map((a, i) => <div key={i} style={{ fontSize: '0.9rem' }}>{a.playerName} ({a.assists}) 👟</div>)}
              </div>
            </div>

            <div className="comments-section" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}>
                <MessageSquare size={18} className="neon-text" /> Yorumlar ({matchComments.length})
              </h3>

              <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {matchComments.length > 0 ? matchComments.map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0, 242, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.avatar ? <img src={c.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" /> : <User size={16} color="var(--accent-primary)" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{c.user}</span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#ddd' }}>{c.text}</p>
                    </div>
                  </div>
                )) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '1rem' }}>Henüz yorum yapılmamış. İlk yorumu sen yap!</div>
                )}
              </div>

              {user ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Yorumunu yaz..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }} 
                  />
                  <button 
                    onClick={handleAddComment}
                    style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', width: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#000' }}
                  >
                    <Send size={18} />
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0, 242, 255, 0.05)', borderRadius: '8px', fontSize: '0.8rem' }}>
                  Yorum yapmak için giriş yapmalısınız.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixturesPage;
