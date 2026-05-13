const INITIAL_TEAMS = [
  { name: 'BAY FC', logo: '/logos/bay_fc.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'HAYAT OKULU FC', logo: '/logos/hayat_okulu.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'OOG FC', logo: '/logos/oog.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  { name: 'ANTONY ULTRAS FC', logo: '/logos/antony_ultras.png', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
];

const INITIAL_PLAYERS = [];
const INITIAL_MATCHES = [];

const CLOUD_STORAGE_URL = "https://kvdb.io/Tz9Kj8y1Z5m2p1X5m2p1/pso_league_v3_stable";

export const getStorageData = () => {
  try {
    const teamsStr = localStorage.getItem('pso_teams_v2');
    const playersStr = localStorage.getItem('pso_players_v2');
    const matchesStr = localStorage.getItem('pso_matches_v2');
    const usersStr = localStorage.getItem('pso_users_v3'); 

    return {
      teams: teamsStr ? JSON.parse(teamsStr) : INITIAL_TEAMS,
      players: playersStr ? JSON.parse(playersStr) : INITIAL_PLAYERS,
      matches: matchesStr ? JSON.parse(matchesStr) : INITIAL_MATCHES,
      users: usersStr ? JSON.parse(usersStr) : [],
    };
  } catch (e) {
    return { teams: INITIAL_TEAMS, players: INITIAL_PLAYERS, matches: INITIAL_MATCHES, users: [] };
  }
};

export const saveStorageData = (data) => {
  if (data.teams) localStorage.setItem('pso_teams_v2', JSON.stringify(data.teams));
  if (data.players) localStorage.setItem('pso_players_v2', JSON.stringify(data.players));
  if (data.matches) localStorage.setItem('pso_matches_v2', JSON.stringify(data.matches));
  if (data.users) localStorage.setItem('pso_users_v3', JSON.stringify(data.users));
  
  window.dispatchEvent(new Event('storage'));
  syncToCloud(data);
};

const syncToCloud = async (data) => {
    try {
        const current = getStorageData();
        const comments = localStorage.getItem('pso_comments');
        const chat = localStorage.getItem('pso_global_chat');
        const totw = localStorage.getItem('pso_totw_v1');

        const allData = {
            teams: data.teams || current.teams,
            players: data.players || current.players,
            matches: data.matches || current.matches,
            users: data.users || current.users,
            comments: comments ? JSON.parse(comments) : {},
            chat: chat ? JSON.parse(chat) : [],
            totw: totw ? JSON.parse(totw) : {}
        };

        await fetch(CLOUD_STORAGE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allData)
        });
    } catch (err) {
        console.error("Cloud sync failed:", err);
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
                if (cloudData.totw) localStorage.setItem('pso_totw_v1', JSON.stringify(cloudData.totw));
                
                window.dispatchEvent(new Event('storage'));
                return true;
            }
        }
    } catch (err) {
        console.warn("Cloud sync error.");
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
  return { success: false, message: 'Gecersiz PSO ID veya sifre.' };
};

export const logoutUser = () => {
  localStorage.removeItem('pso_current_user_v3');
};

export const registerUser = (psoId, password) => {
  const { users, players } = getStorageData();
  if (users.find(u => u.psoId === psoId)) {
    return { success: false, message: 'Bu PSO ID zaten kayitli.' };
  }
  const existingPlayer = players.find(p => p.psoId === psoId);
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
  
  const t1 = match.team1Stats;
  const t2 = match.team2Stats;

  const updateTeam = (name, goalsFor, goalsAgainst) => {
    const searchName = cleanTeamName(name);
    let team = teams.find(t => cleanTeamName(t.name) === searchName);
    if (!team) {
      team = { name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, logo: '/logos/default.png' };
      teams.push(team);
    }
    team.played += 1;
    team.gf += goalsFor;
    team.ga += goalsAgainst;
    if (goalsFor > goalsAgainst) { team.won += 1; team.points += 3; }
    else if (goalsFor === goalsAgainst) { team.drawn += 1; team.points += 1; }
    else { team.lost += 1; }
  };

  updateTeam(t1.teamName, t1.goals, t2.goals);
  updateTeam(t2.teamName, t2.goals, t1.goals);

  const allPlayerStats = [...(match.team1PlayerStats || []), ...(match.team2PlayerStats || [])];
  allPlayerStats.forEach(ps => {
    let player = players.find(p => p.name.toLowerCase() === ps.playerName.toLowerCase());
    if (!player) {
      player = { 
        name: ps.playerName, psoId: ps.playerId || '', team: ps.team || '', position: ps.position || 'CM',
        goals: 0, assists: 0, saves: 0, tackles: 0, interceptions: 0, matches: 0 
      };
      players.push(player);
    }
    player.matches += 1;
    player.goals += (ps.goals || 0);
    player.assists += (ps.assists || 0);
    player.saves += (ps.saves || ps.gKSaves || 0);
    player.tackles += (ps.tackles || 0);
    player.interceptions += (ps.interceptions || 0);
  });

  matches.push({
    id: `match-${Date.now()}`,
    date: new Date().toISOString(),
    team1: t1.teamName,
    team2: t2.teamName,
    score1: t1.goals,
    score2: t2.goals,
    playerStats: allPlayerStats
  });

  saveStorageData({ teams, players, matches });
  return { teams, players, matches };
};

export const resetAllData = async () => {
  const { teams, users } = getStorageData();
  const resetTeams = teams.map(t => ({ ...t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }));
  const resetUsers = users.map(u => ({ ...u, stats: { played: 0, goals: 0, assists: 0 } }));
  const emptyData = { teams: resetTeams, players: [], matches: [], users: resetUsers, comments: {}, chat: [], totw: {} };
  localStorage.setItem('pso_teams_v2', JSON.stringify(resetTeams));
  localStorage.setItem('pso_players_v2', JSON.stringify([]));
  localStorage.setItem('pso_matches_v2', JSON.stringify([]));
  localStorage.setItem('pso_users_v3', JSON.stringify(resetUsers));
  await fetch(CLOUD_STORAGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emptyData)
  });
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
  syncToCloud({});
};

export const deleteComment = (matchId, commentId) => {
  const commentsStr = localStorage.getItem('pso_comments');
  if (!commentsStr) return;
  const allComments = JSON.parse(commentsStr);
  if (!allComments[matchId]) return;
  allComments[matchId] = allComments[matchId].filter(c => c.id !== commentId);
  localStorage.setItem('pso_comments', JSON.stringify(allComments));
  syncToCloud({});
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
    syncToCloud({});
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
  syncToCloud({});
};

export const deleteGlobalChatMessage = (messageId) => {
  const chat = getGlobalChat();
  const updatedChat = chat.filter(m => m.id !== messageId);
  localStorage.setItem('pso_global_chat', JSON.stringify(updatedChat));
  syncToCloud({});
};

export const saveTOTW = (week, totw) => {
  const totwStr = localStorage.getItem('pso_totw_v1');
  const allTotw = totwStr ? JSON.parse(totwStr) : {};
  allTotw[week] = totw;
  localStorage.setItem('pso_totw_v1', JSON.stringify(allTotw));
  syncToCloud({ totw: allTotw });
};

export const getTOTW = (week) => {
  const totwStr = localStorage.getItem('pso_totw_v1');
  return totwStr ? (JSON.parse(totwStr)[week] || null) : null;
};

export const restorePastMatches = async () => {
  const matches = [
    {"team1Stats":{"teamName":"ANTONY ULTRAS FC","goals":3},"team2Stats":{"teamName":"BAY FC","goals":6},"team1PlayerStats":[{"playerName":"MAURO ICARDI","goals":1,"score":270},{"playerName":"Wolfi","goals":2,"score":905}] },
    {"team1Stats":{"teamName":"ANTONY ULTRAS FC","goals":4},"team2Stats":{"teamName":"OOG FC","goals":4},"team1PlayerStats":[{"playerName":"drass","goals":1,"score":850},{"playerName":"Xsaer","goals":2,"score":910}] },
    {"team1Stats":{"teamName":"HAYAT OKULU FC","goals":3},"team2Stats":{"teamName":"BAY FC","goals":2},"team1PlayerStats":[{"playerName":"saksafoncihazi","goals":2,"score":685}] },
    {"team1Stats":{"teamName":"OOG FC","goals":4},"team2Stats":{"teamName":"HAYAT OKULU FC","goals":2},"team1PlayerStats":[{"playerName":"riyal komus","goals":1,"score":675}] }
  ];
  await resetAllData();
  for (const m of matches) { processMatchJSON(m); }
  return true;
};
