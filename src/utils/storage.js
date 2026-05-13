
const INITIAL_TEAMS = [
  { name: 'BAY FC', logo: '/logos/bay_fc.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'HAYAT OKULU FC', logo: '/logos/hayat_okulu.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'OOG FC', logo: '/logos/oog.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'ANTONY ULTRAS FC', logo: '/logos/antony_ultras.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
];

export const getStorageData = () => {
  const teamsStr = localStorage.getItem('pso_teams');
  const players = localStorage.getItem('pso_players');
  const matches = localStorage.getItem('pso_matches');

  let teams = teamsStr ? JSON.parse(teamsStr) : INITIAL_TEAMS;

  // Mevcut verilere logo bilgisini enjekte et (eğer yoksa)
  teams = teams.map(t => {
    const initial = INITIAL_TEAMS.find(it => it.name.toUpperCase() === t.name.toUpperCase());
    if (initial && !t.logo) {
      return { ...t, logo: initial.logo };
    }
    return t;
  });

  return {
    teams,
    players: players ? JSON.parse(players) : [],
    matches: matches ? JSON.parse(matches) : [],
  };
};

export const saveStorageData = (data) => {
  if (data.teams) localStorage.setItem('pso_teams', JSON.stringify(data.teams));
  if (data.players) localStorage.setItem('pso_players', JSON.stringify(data.players));
  if (data.matches) localStorage.setItem('pso_matches', JSON.stringify(data.matches));
};

export const processMatchJSON = (jsonData) => {
  const { teams, players, matches } = getStorageData();
  const match = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

  const t1 = match.team1Stats;
  const t2 = match.team2Stats;

  // Takımları Güncelle
  const updateTeam = (name, goalsFor, goalsAgainst) => {
    let team = teams.find(t => t.name.toUpperCase() === name.toUpperCase());
    
    // Eğer takım listede yoksa (örneğin yabancı bir takımla maç yapılmışsa), listeye ekle
    if (!team) {
      team = { name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
      teams.push(team);
    }

    team.played += 1;
    team.gf += goalsFor;
    team.ga += goalsAgainst;

    if (goalsFor > goalsAgainst) {
      team.won += 1;
      team.points += 3;
    } else if (goalsFor === goalsAgainst) {
      team.drawn += 1;
      team.points += 1;
    } else {
      team.lost += 1;
    }
  };

  updateTeam(t1.teamName, t1.goals, t2.goals);
  updateTeam(t2.teamName, t2.goals, t1.goals);

  // Oyuncu İstatistiklerini Güncelle
  const allPlayerStats = [...match.team1PlayerStats, ...match.team2PlayerStats];
  
  allPlayerStats.forEach(ps => {
    let player = players.find(p => p.name === ps.playerName);
    if (!player) {
      player = { 
        name: ps.playerName, 
        team: ps.team, 
        goals: 0, 
        assists: 0, 
        saves: 0, 
        tackles: 0, 
        interceptions: 0,
        matches: 0 
      };
      players.push(player);
    }
    
    player.matches += 1;
    player.goals += ps.goals;
    player.assists += ps.assists;
    player.saves += (ps.gKSaves || 0);
    player.tackles += ps.tackles;
    player.interceptions += ps.interceptions;
  });

  // Maç Geçmişine Ekle
  matches.push({
    date: new Date().toISOString(),
    team1: t1.teamName,
    team2: t2.teamName,
    score1: t1.goals,
    score2: t2.goals
  });

  saveStorageData({ teams, players, matches });
  return { teams, players, matches };
};
