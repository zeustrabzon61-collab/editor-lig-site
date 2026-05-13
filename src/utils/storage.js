
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
  const users = localStorage.getItem('pso_users');

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
    users: users ? JSON.parse(users) : [],
  };
};

export const saveStorageData = (data) => {
  if (data.teams) localStorage.setItem('pso_teams', JSON.stringify(data.teams));
  if (data.players) localStorage.setItem('pso_players', JSON.stringify(data.players));
  if (data.matches) localStorage.setItem('pso_matches', JSON.stringify(data.matches));
  if (data.users) localStorage.setItem('pso_users', JSON.stringify(data.users));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('pso_current_user');
  return user ? JSON.parse(user) : null;
};

export const loginUser = (email, password) => {
  const { users } = getStorageData();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('pso_current_user', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'E-posta veya şifre hatalı!' };
};

export const registerUser = (email, psoUsername, password) => {
  const data = getStorageData();
  if (data.users.find(u => u.email === email)) return { success: false, message: 'Bu e-posta zaten kayıtlı!' };
  if (data.users.find(u => u.psoUsername.toLowerCase() === psoUsername.toLowerCase())) return { success: false, message: 'Bu PSO kullanıcı adı alınmış!' };

  const newUser = {
    email,
    psoUsername,
    password,
    avatar: '',
    about: '',
    lookingForTeam: false
  };

  data.users.push(newUser);
  saveStorageData(data);
  localStorage.setItem('pso_current_user', JSON.stringify(newUser));
  return { success: true, user: newUser };
};

export const updateUserProfile = (psoUsername, updates) => {
  const data = getStorageData();
  const userIndex = data.users.findIndex(u => u.psoUsername === psoUsername);
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    saveStorageData(data);
    localStorage.setItem('pso_current_user', JSON.stringify(data.users[userIndex]));
    return true;
  }
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem('pso_current_user');
};

export const cleanTeamName = (n) => n.toUpperCase().replace(/\s+FC$|\s+F\.C\.$/g, '').trim();

export const processMatchJSON = (jsonData, teamMappings = {}) => {
  const { teams, players, matches } = getStorageData();
  const match = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

  // Eşleştirmeleri Uygula
  if (teamMappings.team1) match.team1Stats.teamName = teamMappings.team1;
  if (teamMappings.team2) match.team2Stats.teamName = teamMappings.team2;
  
  // Oyuncu takımlarını da eşleştirmeye göre güncelle
  match.team1PlayerStats.forEach(p => p.team = match.team1Stats.teamName);
  match.team2PlayerStats.forEach(p => p.team = match.team2Stats.teamName);

  const t1 = match.team1Stats;
  const t2 = match.team2Stats;

  // Takımları Güncelle
  const updateTeam = (name, goalsFor, goalsAgainst) => {
    const searchName = cleanTeamName(name);

    let team = teams.find(t => {
      const existingName = cleanTeamName(t.name);
      return existingName === searchName || existingName.includes(searchName) || searchName.includes(existingName);
    });
    
    if (!team) {
      team = { name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, logo: '/logos/default.png' };
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
  
  const matchScorers = [];
  const matchAssists = [];

  allPlayerStats.forEach(ps => {
    if (ps.goals > 0) matchScorers.push({ playerName: ps.playerName, goals: ps.goals, team: ps.team });
    if (ps.assists > 0) matchAssists.push({ playerName: ps.playerName, assists: ps.assists, team: ps.team });

    let player = players.find(p => p.name.toLowerCase() === ps.playerName.toLowerCase());
    
    // Bütün olası PSO hatalarını ve büyük/küçük harf durumlarını kapsayalım
    const extractField = (fieldNames) => {
      const key = Object.keys(ps).find(k => fieldNames.includes(k.toLowerCase()));
      return key ? ps[key] : '';
    };

    const rawPos = String(extractField(['position', 'postion', 'pos'])).toUpperCase();
    const rawId = String(extractField(['playerid', 'steamid', 'psoid', 'id']));
    
    let finalPos = 'CM'; // Varsayılan
    if (rawPos.includes('GK')) finalPos = 'GK';
    else if (rawPos.includes('LB')) finalPos = 'LB';
    else if (rawPos.includes('RB')) finalPos = 'RB';
    else if (rawPos.includes('LW')) finalPos = 'LW';
    else if (rawPos.includes('RW')) finalPos = 'RW';
    else if (rawPos.includes('CM') || rawPos.includes('MID')) finalPos = 'CM';
    else if (rawPos.includes('ATT') || rawPos.includes('ST')) finalPos = 'ATT';
    else if (rawPos !== '') finalPos = rawPos; // Eğer hiçbiri değilse oyunun verdiğini kullan


    if (!player) {
      player = { 
        name: ps.playerName, 
        psoId: rawId, 
        team: ps.team, 
        position: finalPos,
        goals: 0, 
        assists: 0, 
        saves: 0, 
        tackles: 0, 
        interceptions: 0,
        matches: 0 
      };
      players.push(player);
    } else {
      // Mevcut oyuncuyu güncelle
      if (rawId) player.psoId = rawId;
      player.position = finalPos;
      player.team = ps.team;
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
    id: `match-${Date.now()}`,
    date: new Date().toISOString(),
    team1: t1.teamName,
    team2: t2.teamName,
    score1: t1.goals,
    score2: t2.goals,
    scorers: matchScorers,
    assists: matchAssists
  });

  saveStorageData({ teams, players, matches });
  return { teams, players, matches };
};

export const getComments = (matchId) => {
  const comments = localStorage.getItem('pso_comments');
  if (!comments) return [];
  const allComments = JSON.parse(comments);
  return allComments[matchId] || [];
};

export const addComment = (matchId, user, text) => {
  if (!user || !text) return;
  const comments = localStorage.getItem('pso_comments');
  const allComments = comments ? JSON.parse(comments) : {};
  if (!allComments[matchId]) allComments[matchId] = [];
  
  allComments[matchId].push({
    id: `comment-${Date.now()}`,
    user: user.psoUsername,
    avatar: user.avatar,
    text,
    date: new Date().toISOString()
  });
  
  localStorage.setItem('pso_comments', JSON.stringify(allComments));
};
