const INITIAL_TEAMS = [
  { name: 'BAY FC', logo: '/logos/bay_fc.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'HAYAT OKULU FC', logo: '/logos/hayat_okulu.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'OOG FC', logo: '/logos/oog.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'ANTONY ULTRAS FC', logo: '/logos/antony_ultras.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
];

const INITIAL_PLAYERS = [];
const INITIAL_MATCHES = [];

// HERKES İÇİN ORTAK BULUT KANALI (Üyelik Gerektirmez)
const CLOUD_STORAGE_URL = "https://kvdb.io/Tz9Kj8y1Z5m2p1X5m2p1/pso_league_v1";

export const getStorageData = () => {
  const teamsStr = localStorage.getItem('pso_teams_v2');
  const playersStr = localStorage.getItem('pso_players_v2');
  const matchesStr = localStorage.getItem('pso_matches_v2');
  const usersStr = localStorage.getItem('pso_users_v3'); 

  let teams = teamsStr ? JSON.parse(teamsStr) : INITIAL_TEAMS;
  let players = playersStr ? JSON.parse(playersStr) : INITIAL_PLAYERS;
  let matches = matchesStr ? JSON.parse(matchesStr) : INITIAL_MATCHES;

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
  if (data.teams) localStorage.setItem('pso_teams_v2', JSON.stringify(data.teams));
  if (data.players) localStorage.setItem('pso_players_v2', JSON.stringify(data.players));
  if (data.matches) localStorage.setItem('pso_matches_v2', JSON.stringify(data.matches));
  if (data.users) localStorage.setItem('pso_users_v3', JSON.stringify(data.users));
  
  // BULUTA KAYDET (Otomatik Arka Planda)
  syncToCloud(data);
};

const syncToCloud = async (data) => {
    try {
        const current = getStorageData();
        const comments = localStorage.getItem('pso_comments');
        const chat = localStorage.getItem('pso_global_chat');

        const allData = {
            teams: data.teams || current.teams,
            players: data.players || current.players,
            matches: data.matches || current.matches,
            users: data.users || current.users,
            comments: data.comments || (comments ? JSON.parse(comments) : {}),
            chat: data.chat || (chat ? JSON.parse(chat) : [])
        };

        await fetch(CLOUD_STORAGE_URL, {
            method: 'POST',
            body: JSON.stringify(allData)
        });
    } catch (err) {
        console.error("Bulut kaydı başarısız:", err);
    }
};

export const initCloudSync = async () => {
    try {
        const response = await fetch(CLOUD_STORAGE_URL);
        if (response.ok) {
            const cloudData = await response.json();
            if (cloudData && cloudData.teams) {
                localStorage.setItem('pso_teams_v2', JSON.stringify(cloudData.teams));
                localStorage.setItem('pso_players_v2', JSON.stringify(cloudData.players || []));
                localStorage.setItem('pso_matches_v2', JSON.stringify(cloudData.matches || []));
                localStorage.setItem('pso_users_v3', JSON.stringify(cloudData.users || []));
                if (cloudData.comments) localStorage.setItem('pso_comments', JSON.stringify(cloudData.comments));
                if (cloudData.chat) localStorage.setItem('pso_global_chat', JSON.stringify(cloudData.chat));
                window.dispatchEvent(new Event('storage'));
                return true;
            }
        }
    } catch (err) {
        console.warn("Bulut verisi çekilemedi.");
    }
    return false;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('pso_current_user_v3');
  return user ? JSON.parse(user) : null;
};

export const loginUser = (psoId, password) => {
  const { users } = getStorageData();
  const user = users.find(u => u.psoId === psoId && u.password === password);
  if (user) {
    localStorage.setItem('pso_current_user_v3', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Geçersiz PSO ID veya şifre.' };
};

export const logoutUser = () => {
  localStorage.removeItem('pso_current_user_v3');
};

export const registerUser = (psoId, password) => {
  const { users, players } = getStorageData();
  if (users.find(u => u.psoId === psoId)) {
    return { success: false, message: 'Bu PSO ID zaten kayıtlı.' };
  }

  const existingPlayer = players.find(p => p.psoId === psoId) || INITIAL_PLAYERS.find(p => p.psoId === psoId);
  const psoUsername = existingPlayer ? existingPlayer.name : `Oyuncu_${psoId}`;

  const newUser = {
    psoId,
    psoUsername,
    password,
    avatar: null,
    stats: { played: 0, goals: 0, assists: 0 }
  };

  const updatedUsers = [...users, newUser];
  saveStorageData({ users: updatedUsers });
  localStorage.setItem('pso_current_user_v3', JSON.stringify(newUser));
  return { success: true, user: newUser };
};

export const updateUserProfile = (psoId, updates) => {
  const data = getStorageData();
  const userIndex = data.users.findIndex(u => u.psoId === psoId);
  if (userIndex !== -1) {
    data.users[userIndex] = { ...data.users[userIndex], ...updates };
    saveStorageData({ users: data.users });
    localStorage.setItem('pso_current_user_v3', JSON.stringify(data.users[userIndex]));
    return true;
  }
  return false;
};

export const cleanTeamName = (n) => n.toUpperCase().replace(/\s+FC$|\s+F\.C\.$/g, '').trim();

export const processMatchJSON = (jsonData, teamMappings = {}) => {
  const { teams, players, matches } = getStorageData();
  const match = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

  if (teamMappings.team1) match.team1Stats.teamName = teamMappings.team1;
  if (teamMappings.team2) match.team2Stats.teamName = teamMappings.team2;
  
  match.team1PlayerStats.forEach(p => p.team = match.team1Stats.teamName);
  match.team2PlayerStats.forEach(p => p.team = match.team2Stats.teamName);

  const t1 = match.team1Stats;
  const t2 = match.team2Stats;

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

  const allPlayerStats = [...match.team1PlayerStats, ...match.team2PlayerStats];
  const matchScorers = [];
  const matchAssists = [];

  allPlayerStats.forEach(ps => {
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
    
    let finalPos = 'CM';
    if (rawPos.includes('GK')) finalPos = 'GK';
    else if (rawPos.includes('LB')) finalPos = 'LB';
    else if (rawPos.includes('RB')) finalPos = 'RB';
    else if (rawPos.includes('LW')) finalPos = 'LW';
    else if (rawPos.includes('RW')) finalPos = 'RW';
    else if (rawPos.includes('CM') || rawPos.includes('MID')) finalPos = 'CM';
    else if (rawPos.includes('ATT') || rawPos.includes('ST')) finalPos = 'ATT';
    else if (rawPos !== '') finalPos = rawPos;

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

  matches.push({
    id: `match-${Date.now()}`,
    date: new Date().toISOString(),
    team1: t1.teamName,
    team2: t2.teamName,
    score1: t1.goals,
    score2: t2.goals,
    scorers: matchScorers,
    assists: matchAssists,
    playerStats: allPlayerStats.map(ps => ({
      name: ps.playerName,
      team: ps.team,
      position: ps.position || ps.postion || 'CM',
      goals: parseInt(ps.goals || 0),
      assists: parseInt(ps.assists || 0),
      saves: parseInt(ps.gKSaves || ps.saves || 0),
      tackles: parseInt(ps.tackles || 0),
      interceptions: parseInt(ps.interceptions || 0)
    }))
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
  const commentsStr = localStorage.getItem('pso_comments');
  const allComments = commentsStr ? JSON.parse(commentsStr) : {};
  if (!allComments[matchId]) allComments[matchId] = [];
  
  allComments[matchId].push({
    id: `comment-${Date.now()}`,
    user: user.psoUsername,
    avatar: user.avatar,
    text,
    date: new Date().toISOString()
  });
  
  localStorage.setItem('pso_comments', JSON.stringify(allComments));
  syncToCloud({ comments: allComments });
};

export const deleteComment = (matchId, commentId) => {
  const commentsStr = localStorage.getItem('pso_comments');
  if (!commentsStr) return;
  const allComments = JSON.parse(commentsStr);
  if (!allComments[matchId]) return;
  
  allComments[matchId] = allComments[matchId].filter(c => c.id !== commentId);
  localStorage.setItem('pso_comments', JSON.stringify(allComments));
  syncToCloud({ comments: allComments });
};

export const updateComment = (matchId, commentId, newText) => {
  const commentsStr = localStorage.getItem('pso_comments');
  if (!commentsStr) return;
  const allComments = JSON.parse(commentsStr);
  if (!allComments[matchId]) return;
  
  const comment = allComments[matchId].find(c => c.id === commentId);
  if (comment) {
    comment.text = newText;
    comment.date = new Date().toISOString();
    localStorage.setItem('pso_comments', JSON.stringify(allComments));
    syncToCloud({ comments: allComments });
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
  
  const limitedChat = chat.slice(-100);
  localStorage.setItem('pso_global_chat', JSON.stringify(limitedChat));
  syncToCloud({ chat: limitedChat });
};

export const deleteGlobalChatMessage = (messageId) => {
  const chat = getGlobalChat();
  const updatedChat = chat.filter(m => m.id !== messageId);
  localStorage.setItem('pso_global_chat', JSON.stringify(updatedChat));
  syncToCloud({ chat: updatedChat });
};

export const resetAllData = async () => {
  const { teams, users } = getStorageData();
  
  const resetTeams = teams.map(t => ({
    ...t,
    played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0
  }));

  const resetUsers = users.map(u => ({
    ...u,
    stats: { played: 0, goals: 0, assists: 0 }
  }));

  const emptyData = {
    teams: resetTeams,
    players: [],
    matches: [],
    users: resetUsers,
    comments: {},
    chat: []
  };

  localStorage.setItem('pso_teams_v2', JSON.stringify(resetTeams));
  localStorage.setItem('pso_players_v2', JSON.stringify([]));
  localStorage.setItem('pso_matches_v2', JSON.stringify([]));
  localStorage.setItem('pso_users_v3', JSON.stringify(resetUsers));
  localStorage.removeItem('pso_comments');
  localStorage.removeItem('pso_global_chat');

  await fetch(CLOUD_STORAGE_URL, {
      method: 'POST',
      body: JSON.stringify(emptyData)
  });
};
