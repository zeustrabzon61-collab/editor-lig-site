const INITIAL_TEAMS = [
  { name: 'BAY FC', logo: 'https://i.ibb.co/pX1L5K1/bay-logo.png', played: 1, won: 0, drawn: 0, lost: 1, gf: 2, ga: 3, points: 0 },
  { name: 'HAYAT OKULU FC', logo: 'https://i.ibb.co/mS5S8k7/hayat-okulu.png', played: 1, won: 1, drawn: 0, lost: 0, gf: 3, ga: 2, points: 3 },
  { name: 'OOG FC', logo: 'https://i.ibb.co/vY5T6N9/oog-fc.png', played: 1, won: 0, drawn: 1, lost: 0, gf: 4, ga: 4, points: 1 },
  { name: 'ANTONY ULTRAS FC', logo: 'https://i.ibb.co/VqXNqN8/antony-ultras.png', played: 1, won: 0, drawn: 1, lost: 0, gf: 4, ga: 4, points: 1 },
];

const INITIAL_PLAYERS = [
  { psoId: 'dooukqkT', name: 'drass', team: 'ANTONY ULTRAS FC', goals: 1, assists: 1, played: 1, rating: 75 },
  { psoId: 'XsaerID', name: 'Xsaer', team: 'ANTONY ULTRAS FC', goals: 2, assists: 0, played: 1, rating: 73 },
  { psoId: 'WolfiID', name: 'Wolfi', team: 'ANTONY ULTRAS FC', goals: 1, assists: 1, played: 1, rating: 74 },
  { psoId: 'NeekoID', name: 'Neeko', team: 'OOG FC', goals: 1, assists: 1, played: 1, rating: 72 },
  { psoId: 'cunhaID', name: 'cunha', team: 'OOG FC', goals: 1, assists: 0, played: 1, rating: 70 },
  { psoId: 'slowID', name: 'slow', team: 'OOG FC', goals: 2, assists: 1, played: 1, rating: 76 },
  { psoId: 'saksafonID', name: 'saksafoncihazı', team: 'HAYAT OKULU FC', goals: 2, assists: 1, played: 1, rating: 78 },
  { psoId: 'bekoID', name: 'beko', team: 'HAYAT OKULU FC', goals: 1, assists: 1, played: 1, rating: 74 },
  { psoId: 'yurtseverID', name: 'yurtsever', team: 'BAY FC', goals: 2, assists: 0, played: 1, rating: 73 },
  { psoId: 'yakupID', name: 'yakup tv', team: 'BAY FC', goals: 0, assists: 1, played: 1, rating: 71 },
];

const INITIAL_MATCHES = [
  {
    id: 'match-1',
    team1: 'ANTONY ULTRAS FC',
    team2: 'OOG FC',
    score1: 4,
    score2: 4,
    date: '2024-05-13',
    scorers: [
      { playerName: 'drass', goals: 1, team: 'ANTONY ULTRAS FC' },
      { playerName: 'Xsaer', goals: 2, team: 'ANTONY ULTRAS FC' },
      { playerName: 'Wolfi', goals: 1, team: 'ANTONY ULTRAS FC' },
      { playerName: 'Neeko', goals: 1, team: 'OOG FC' },
      { playerName: 'cunha', goals: 1, team: 'OOG FC' },
      { playerName: 'slow', goals: 2, team: 'OOG FC' }
    ],
    assists: [
      { playerName: 'drass', assists: 1, team: 'ANTONY ULTRAS FC' },
      { playerName: 'Wolfi', assists: 1, team: 'ANTONY ULTRAS FC' },
      { playerName: 'Neeko', assists: 1, team: 'OOG FC' },
      { playerName: 'slow', assists: 1, team: 'OOG FC' }
    ]
  },
  {
    id: 'match-2',
    team1: 'HAYAT OKULU FC',
    team2: 'BAY FC',
    score1: 3,
    score2: 2,
    date: '2024-05-13',
    scorers: [
      { playerName: 'saksafoncihazı', goals: 2, team: 'HAYAT OKULU FC' },
      { playerName: 'beko', goals: 1, team: 'HAYAT OKULU FC' },
      { playerName: 'yurtsever', goals: 2, team: 'BAY FC' }
    ],
    assists: [
      { playerName: 'saksafoncihazı', assists: 1, team: 'HAYAT OKULU FC' },
      { playerName: 'beko', assists: 1, team: 'HAYAT OKULU FC' },
      { playerName: 'lasiks pilayer', assists: 1, team: 'HAYAT OKULU FC' },
      { playerName: 'yakup tv', assists: 1, team: 'BAY FC' }
    ]
  }
];

export const getStorageData = () => {
  const teamsStr = localStorage.getItem('pso_teams');
  const playersStr = localStorage.getItem('pso_players');
  const matchesStr = localStorage.getItem('pso_matches');
  const usersStr = localStorage.getItem('pso_users_v2'); // Yeni anahtar ile eski hesapları sıfırladık

  let teams = teamsStr ? JSON.parse(teamsStr) : INITIAL_TEAMS;
  let players = playersStr ? JSON.parse(playersStr) : INITIAL_PLAYERS;
  let matches = matchesStr ? JSON.parse(matchesStr) : INITIAL_MATCHES;

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
    players,
    matches,
    users: usersStr ? JSON.parse(usersStr) : [],
  };
};

export const saveStorageData = (data) => {
  if (data.teams) localStorage.setItem('pso_teams', JSON.stringify(data.teams));
  if (data.players) localStorage.setItem('pso_players', JSON.stringify(data.players));
  if (data.matches) localStorage.setItem('pso_matches', JSON.stringify(data.matches));
  if (data.users) localStorage.setItem('pso_users_v2', JSON.stringify(data.users));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('pso_current_user_v2');
  return user ? JSON.parse(user) : null;
};

export const loginUser = (psoId, password) => {
  const { users } = getStorageData();
  const user = users.find(u => u.psoId === psoId && u.password === password);
  if (user) {
    localStorage.setItem('pso_current_user_v2', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Geçersiz PSO ID veya şifre.' };
};

export const logoutUser = () => {
  localStorage.removeItem('pso_current_user_v2');
};

export const registerUser = (psoId, password) => {
  const { users } = getStorageData();
  if (users.find(u => u.psoId === psoId)) {
    return { success: false, message: 'Bu PSO ID zaten kayıtlı.' };
  }

  // Eğer bu ID INITIAL_PLAYERS içinde varsa ismini oradan al, yoksa ID'yi isim olarak kullan
  const knownPlayer = INITIAL_PLAYERS.find(p => p.psoId === psoId);
  const psoUsername = knownPlayer ? knownPlayer.name : `Oyuncu_${psoId}`;

  const newUser = {
    psoId,
    psoUsername,
    password,
    avatar: null,
    stats: { played: 0, goals: 0, assists: 0 }
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem('pso_users_v2', JSON.stringify(updatedUsers));
  localStorage.setItem('pso_current_user_v2', JSON.stringify(newUser));
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
    // Bütün olası PSO hatalarını ve büyük/küçük harf durumlarını kapsayalım
    const extractField = (fieldNames) => {
      const key = Object.keys(ps).find(k => fieldNames.includes(k.toLowerCase()));
      return key ? ps[key] : '';
    };

    const goals = parseInt(extractField(['goals', 'goal', 'g']) || 0);
    const assists = parseInt(extractField(['assists', 'assist', 'a']) || 0);

    if (goals > 0) matchScorers.push({ playerName: ps.playerName, goals: goals, team: ps.team });
    if (assists > 0) matchAssists.push({ playerName: ps.playerName, assists: assists, team: ps.team });

    let player = players.find(p => p.name.toLowerCase() === ps.playerName.toLowerCase());
    

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
    player.goals += goals;
    player.assists += assists;
    player.saves += (parseInt(extractField(['gksaves', 'saves', 's']) || 0));
    player.tackles += (parseInt(extractField(['tackles', 'tackle', 't']) || 0));
    player.interceptions += (parseInt(extractField(['interceptions', 'interception', 'i']) || 0));
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

export const deleteComment = (matchId, commentId) => {
  const comments = localStorage.getItem('pso_comments');
  if (!comments) return;
  const allComments = JSON.parse(comments);
  if (!allComments[matchId]) return;
  
  allComments[matchId] = allComments[matchId].filter(c => c.id !== commentId);
  localStorage.setItem('pso_comments', JSON.stringify(allComments));
};

export const updateComment = (matchId, commentId, newText) => {
  const comments = localStorage.getItem('pso_comments');
  if (!comments) return;
  const allComments = JSON.parse(comments);
  if (!allComments[matchId]) return;
  
  const comment = allComments[matchId].find(c => c.id === commentId);
  if (comment) {
    comment.text = newText;
    comment.date = new Date().toISOString(); // Opsiyonel: Güncelleme tarihini de set edebiliriz
    localStorage.setItem('pso_comments', JSON.stringify(allComments));
  }
};

export const getGlobalChat = () => {
  const chat = localStorage.getItem('pso_global_chat');
  return chat ? JSON.parse(chat) : [];
};

export const addGlobalChatMessage = (user, text) => {
  if (!user || !text) return;
  const chat = getGlobalChat();
  
  chat.push({
    id: `chat-${Date.now()}`,
    user: user.psoUsername,
    avatar: user.avatar,
    text,
    date: new Date().toISOString()
  });
  
  // Son 100 mesajı tutalım (limit)
  const limitedChat = chat.slice(-100);
  localStorage.setItem('pso_global_chat', JSON.stringify(limitedChat));
};

export const deleteGlobalChatMessage = (messageId) => {
  const chat = getGlobalChat();
  const updatedChat = chat.filter(m => m.id !== messageId);
  localStorage.setItem('pso_global_chat', JSON.stringify(updatedChat));
};
