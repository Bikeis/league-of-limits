"use strict";

const SUPABASE_URL = "https://wnbxdoesaaafesvpkbvv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DbsYeFZT8kQdY4euO5PSTw_c8566AiQ";
const realtimeClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) || null;
const MULTIPLAYER_BUILD = "ui-9";
document.documentElement.dataset.multiplayerBuild = MULTIPLAYER_BUILD;

const startScreen = document.querySelector("#start-screen");
const lobbyScreen = document.querySelector("#lobby-screen");
const gameScreen = document.querySelector("#game-screen");
const startButton = document.querySelector("#start-button");
const howToPlayButton = document.querySelector("#how-to-play-button");
const howToPlayModal = document.querySelector("#how-to-play-modal");
const closeHowToPlayButton = document.querySelector("#close-how-to-play");
const lobbyBackButton = document.querySelector("#lobby-back-button");
const backButton = document.querySelector("#back-button");
const npcModeButton = document.querySelector("#npc-mode-button");
const friendsModeButton = document.querySelector("#friends-mode-button");
const startMatchButton = document.querySelector("#start-match-button");
const lobbyStatusElement = document.querySelector("#lobby-status");
const lobbySlotsElement = document.querySelector("#lobby-slots");
const invitePanel = document.querySelector("#invite-panel");
const inviteLinkInput = document.querySelector("#invite-link");
const copyLinkButton = document.querySelector("#copy-link-button");
const rollOrderButton = document.querySelector("#roll-order-button");
const drawCardButton = document.querySelector("#draw-card-button");
const difficultyTiersElement = document.querySelector("#difficulty-tiers");
const turnCounterElement = document.querySelector("#turn-counter");
const activePlayerElement = document.querySelector("#active-player");
const timerDisplayElement = document.querySelector("#timer-display");
const feedbackElement = document.querySelector("#feedback-message");
const diceRollPanelElement = document.querySelector("#dice-roll-panel");
const rulesListElement = document.querySelector("#rules-list");
const conceptListElement = document.querySelector("#concept-list");
const toastElement = document.querySelector("#toast");
const settingsButton = document.querySelector("#settings-button");
const menuSettingsButton = document.querySelector("#menu-settings-button");
const settingsModal = document.querySelector("#settings-modal");
const muteButton = document.querySelector("#mute-button");
const gameOverModal = document.querySelector("#game-over-modal");
const winnerNameElement = document.querySelector("#winner-name");
const victoryReasonElement = document.querySelector("#victory-reason");
const matchDurationElement = document.querySelector("#match-duration");
const matchTurnsElement = document.querySelector("#match-turns");
const matchPlayerCountElement = document.querySelector("#match-player-count");
const finalStandingsListElement = document.querySelector("#final-standings-list");
const playAgainButton = document.querySelector("#play-again-button");
const gameOverLobbyButton = document.querySelector("#game-over-lobby-button");
const playAgainNote = document.querySelector("#play-again-note");
const volumeInputs = {
  master: document.querySelector("#master-volume"),
  ui: document.querySelector("#ui-volume"),
  game: document.querySelector("#game-volume"),
  music: document.querySelector("#music-volume"),
};
const tableLayoutElement = document.querySelector("#table-layout");
const topOpponentElement = document.querySelector("#top-opponent");
const leftOpponentElement = document.querySelector("#left-opponent");
const rightOpponentElement = document.querySelector("#right-opponent");
const activeHandElement = document.querySelector("#active-hand");
const currentCardElement = document.querySelector("#current-card");
const deckCountElement = document.querySelector("#deck-count");
const discardCountElement = document.querySelector("#discard-count");
const playedCardPileElement = document.querySelector("#played-card-pile");
const deckStackButton = document.querySelector("#deck-stack-button");

const imagePaths = {
  questionBack: "assets/media/photos/action/yellow_back_card.jpg",
  actionBack: "assets/media/photos/action/blue_back_card.jpg",
  doubleDamage: "assets/media/photos/action/double_damage.jpg",
  freeze: "assets/media/photos/action/freeze.jpg",
  shield: "assets/media/photos/action/shield.jpg",
  steal: "assets/media/photos/action/steal.jpg",
};

const difficultyTiers = [
  {
    name: "Easy",
    calculusPoints: 1,
    damage: 1,
    wrongPenalty: 0.5,
    timeLimit: 15,
    description: "Basic limits and continuity checks.",
  },
  {
    name: "Medium",
    calculusPoints: 2,
    damage: 2,
    wrongPenalty: 1,
    timeLimit: 30,
    description: "Problems that usually need factoring, simplifying, or rationalizing.",
  },
  {
    name: "Hard",
    calculusPoints: 3,
    damage: 3,
    wrongPenalty: 2,
    timeLimit: 45,
    description: "Higher-stakes limits, one-sided limits, and indeterminate forms.",
  },
];

const actionTypes = [
  {
    id: "shield",
    title: "Shield",
    concept: "Continuous Functions",
    description: "Prevents damage during the round it is played.",
    image: imagePaths.shield,
  },
  {
    id: "double-damage",
    title: "Double Damage",
    concept: "One-sided Limits",
    description: "Doubles damage on your next turn, then expires.",
    image: imagePaths.doubleDamage,
  },
  {
    id: "freeze",
    title: "Freeze",
    concept: "Discontinuous Functions and Infinite Limits",
    description: "Choose an opponent. They skip their next turn.",
    image: imagePaths.freeze,
  },
  {
    id: "steal",
    title: "Steal",
    concept: "Indeterminate Forms",
    description: "Choose an opponent and steal one random card from their hand.",
    image: imagePaths.steal,
  },
];

const npcAccuracyByTier = {
  Easy: 0.78,
  Medium: 0.64,
  Hard: 0.48,
};

const questionBank = [
  {
    tier: "Easy",
    prompt: "lim x->2 (x + 3)",
    answer: "5",
    method: "Direct Substitution",
  },
  {
    tier: "Easy",
    prompt: "lim x->1 (x^2 + 2x)",
    answer: "3",
    method: "Direct Substitution",
  },
  {
    tier: "Easy",
    prompt: "lim x->4 (12 / x)",
    answer: "3",
    method: "Direct Substitution",
  },
  {
    tier: "Easy",
    prompt: "Is f(x) = x + 1 continuous at x = 2?",
    answer: "Yes",
    method: "Continuity Test",
  },
  {
    tier: "Medium",
    prompt: "lim x->3 ((x^2 - 9) / (x - 3))",
    answer: "6",
    method: "Factoring",
  },
  {
    tier: "Medium",
    prompt: "lim x->0 ((3x^2 + 6x) / x)",
    answer: "6",
    method: "Factoring",
  },
  {
    tier: "Medium",
    prompt: "lim x->0 ((sqrt(x + 9) - 3) / x)",
    answer: "1/6",
    method: "Rationalization",
  },
  {
    tier: "Medium",
    prompt: "lim x->2 ((x^2 - 4) / (x - 2))",
    answer: "4",
    method: "Factoring",
  },
  {
    tier: "Hard",
    prompt: "lim x->0 (sin x / x)",
    answer: "1",
    method: "Special Limit",
  },
  {
    tier: "Hard",
    prompt: "lim x->1 ((x^3 - 1) / (x - 1))",
    answer: "3",
    method: "Factoring",
  },
  {
    tier: "Hard",
    prompt: "lim x->0+ (1 / x)",
    answer: "Infinity",
    method: "One-Sided Limit",
  },
  {
    tier: "Hard",
    prompt: "lim x->0 ((1 - cos x) / x^2)",
    answer: "1/2",
    method: "Special Limit",
  },
];

const gameRules = [
  {
    title: "Choose your move",
    description: "On your first turn, draw one card. After that, either draw one card or play one from your hand.",
  },
  {
    title: "Drawing ends the turn",
    description: "Build your hand for later, or spend your turn playing a question or action card.",
  },
  {
    title: "Resolve its effect",
    description: "Choose question difficulty and solve it, or select a target for your action card.",
  },
  {
    title: "Build the played pile",
    description: "Used cards stack face-up at the center. When the deck empties, the pile is shuffled into a fresh deck.",
  },
];

const feedbackMessages = {
  correct: "Correct!",
  wrong: "Not quite.",
  gained: "You gained points!",
  damage: "You dealt damage!",
  infinity: "Infinity Card used!",
};

let players = [];
let deck = [];
let discardPile = [];
let placements = [];
let currentCard = null;
let selectedHandIndex = -1;
let timer = null;
let timerMode = null;
let rollAnimationTimer = null;
let usedQuestionPrompts = new Set();
let audioContext = null;
let savedAudioSettings = null;
try {
  savedAudioSettings = JSON.parse(localStorage.getItem("league-audio-settings") || "null");
} catch {
  savedAudioSettings = null;
}
let audioSettings = { master: 0.7, ui: 0.65, game: 0.75, music: 0.35, muted: false, ...(savedAudioSettings || {}) };
let musicTimer = null;
let musicStep = 0;
let musicMode = "menu";
let toastTimer = null;
let lobbyMode = null;
let lobbyPlayers = ["Player 1", null, null, null];
let npcTimeout = null;
let turnAdvanceTimeout = null;
let rollCountdownTimer = null;
let rollCountdown = 15;
let roomChannel = null;
let roomCode = null;
let isRoomHost = false;
let roomPlayers = [];
let roomSeatPlayerIds = [];
let roomSyncTimer = null;
let matchStartedAt = 0;
let gameOverShown = false;
let isApplyingRoomState = false;
const localRoomPlayerId = sessionStorage.getItem("league-player-id") || crypto.randomUUID();
sessionStorage.setItem("league-player-id", localRoomPlayerId);

const turnState = {
  orderedPlayerIds: [],
  orderIndex: 0,
  turnNumber: 1,
  isStarted: false,
  rollingPlayerIndex: 0,
  isRolling: false,
  isMatchOver: false,
  hasDrawn: false,
  isResolving: false,
};

const DRAW_TIME_LIMIT = 12;
const PLAY_TIME_LIMIT = 15;
const CHOICE_TIME_LIMIT = 12;
const MAX_HEALTH = 8;
const CP_TO_WIN = 15;

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = AudioContextClass ? new AudioContextClass() : null;
  }

  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency, duration, options = {}) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startAt = context.currentTime + (options.delay || 0);
  const channelVolume = audioSettings[options.channel || "game"] ?? 1;
  const volume = Math.min(0.28, (options.volume || 0.045) * 5 * audioSettings.master * channelVolume * (audioSettings.muted ? 0 : 1));

  if (volume <= 0.0001) {
    return;
  }
  oscillator.type = options.type || "sine";
  oscillator.frequency.setValueAtTime(frequency, startAt);

  if (options.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(options.endFrequency, startAt + duration);
  }

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function playSound(name) {
  const sounds = {
    hover: () => playTone(520, 0.035, { channel: "ui", volume: 0.012 }),
    click: () => playTone(310, 0.055, { channel: "ui", type: "triangle", endFrequency: 390, volume: 0.022 }),
    select: () => { playTone(420, 0.06, { channel: "ui", type: "triangle", volume: 0.025 }); playTone(560, 0.07, { channel: "ui", delay: 0.04, volume: 0.02 }); },
    draw: () => { playTone(260, 0.09, { channel: "ui", type: "triangle", endFrequency: 420 }); playTone(520, 0.08, { channel: "ui", delay: 0.07, volume: 0.03 }); },
    shuffle: () => [0, .045, .09, .135].forEach((delay, index) => playTone(180 + index * 35, .04, { channel: "ui", delay, type: "triangle", volume: .018 })),
    action: () => { playTone(330, 0.1, { type: "square", volume: 0.025 }); playTone(494, 0.13, { delay: 0.08 }); },
    shield: () => { playTone(360, .15, { type: "sine", endFrequency: 620 }); playTone(720, .18, { delay: .08, volume: .03 }); },
    freeze: () => [880, 740, 620].forEach((tone, index) => playTone(tone, .13, { delay: index * .06, type: "sine", volume: .026 })),
    steal: () => { playTone(240, .08, { type: "triangle" }); playTone(520, .1, { delay: .08, type: "triangle" }); },
    damage: () => { playTone(125, .16, { type: "sawtooth", endFrequency: 82, volume: .04 }); },
    correct: () => [392, 494, 659].forEach((tone, index) => playTone(tone, 0.16, { delay: index * 0.07 })),
    wrong: () => { playTone(220, 0.18, { type: "sawtooth", endFrequency: 145, volume: 0.035 }); },
    timeout: () => { playTone(180, 0.16, { type: "square", volume: 0.03 }); playTone(145, 0.2, { delay: 0.16, type: "square", volume: 0.03 }); },
    dice: () => { playTone(150, 0.07, { type: "triangle", endFrequency: 240 }); playTone(190, 0.07, { delay: 0.1, type: "triangle" }); },
    turn: () => { playTone(440, 0.1, { volume: 0.03 }); playTone(587, 0.12, { delay: 0.08, volume: 0.03 }); },
    win: () => [392, 494, 587, 784].forEach((tone, index) => playTone(tone, .22, { delay: index * .1, volume: .04 })),
  };

  sounds[name]?.();
}

function playMusicNote(frequency, duration, delay = 0, volume = 0.018) {
  playTone(frequency, duration, {
    channel: "music",
    delay,
    type: "sine",
    volume,
  });
  playTone(frequency / 2, duration * 1.05, {
    channel: "music",
    delay,
    type: "triangle",
    volume: volume * 0.32,
  });
}

function scheduleMusicPhrase() {
  if (!audioContext || audioSettings.muted || audioSettings.music <= 0) {
    return;
  }

  const menuChords = [
    [196, 246.94, 293.66],
    [174.61, 220, 261.63],
    [146.83, 196, 246.94],
    [164.81, 207.65, 246.94],
  ];
  const matchChords = [
    [146.83, 174.61, 220],
    [130.81, 164.81, 196],
    [123.47, 146.83, 196],
    [138.59, 174.61, 207.65],
  ];
  const chords = musicMode === "match" ? matchChords : menuChords;
  const chord = chords[musicStep % chords.length];
  const beat = musicMode === "match" ? 0.52 : 0.72;

  chord.forEach((tone, index) => playMusicNote(tone, beat * 3.4, index * 0.035, musicMode === "match" ? 0.013 : 0.011));
  playMusicNote(chord[2] * 2, beat * 0.72, beat * 1.4, 0.008);
  musicStep += 1;
}

function startBackgroundMusic(mode = document.body.classList.contains("is-match") ? "match" : "menu") {
  musicMode = mode;
  getAudioContext();

  if (musicTimer) {
    window.clearInterval(musicTimer);
  }

  musicStep = 0;
  scheduleMusicPhrase();
  musicTimer = window.setInterval(scheduleMusicPhrase, mode === "match" ? 2100 : 2900);
}

function syncBackgroundMusic() {
  const nextMode = document.body.classList.contains("is-match") ? "match" : "menu";
  if (!musicTimer || nextMode !== musicMode) startBackgroundMusic(nextMode);
}

function saveAudioSettings() {
  localStorage.setItem("league-audio-settings", JSON.stringify(audioSettings));
}

function renderAudioSettings() {
  Object.entries(volumeInputs).forEach(([name, input]) => {
    const percentage = Math.round(audioSettings[name] * 100);
    input.value = percentage;
    document.querySelector(`#${name}-volume-value`).textContent = `${percentage}%`;
  });
  muteButton.textContent = audioSettings.muted ? "Sound muted" : "Mute all";
  muteButton.setAttribute("aria-pressed", String(audioSettings.muted));
  settingsModal.classList.toggle("is-muted", audioSettings.muted);
}

function unlockAudio() {
  getAudioContext();
  syncBackgroundMusic();
}

function isLocalHumanPlayer(player) {
  return Boolean(player && !isNpcPlayer(player) && (lobbyMode === "npc" ? player.id === 1 : true));
}

function isFriendsGuest() {
  return lobbyMode === "friends" && roomChannel && !isRoomHost;
}

function getLocalGamePlayer() {
  if (lobbyMode !== "friends") {
    return players.find((player) => player.id === 1) || null;
  }

  const seatIndex = roomSeatPlayerIds.indexOf(localRoomPlayerId);
  return players[seatIndex] || null;
}

async function sendRoomEvent(event, payload) {
  if (!roomChannel) return;
  await roomChannel.send({ type: "broadcast", event, payload });
}

function buildRoomState() {
  return {
    build: MULTIPLAYER_BUILD,
    roomSeatPlayerIds,
    players,
    deck,
    discardPile,
    placements,
    currentCard,
    selectedHandIndex,
    turnState: { ...turnState },
    usedQuestionPrompts: [...usedQuestionPrompts],
    feedbackHtml: feedbackElement.innerHTML,
    timerText: timerDisplayElement.textContent,
    timerUrgent: timerDisplayElement.classList.contains("is-urgent"),
    matchStartedAt,
    gameOverShown,
  };
}

function broadcastRoomState() {
  if (lobbyMode === "friends" && isRoomHost && roomChannel && !isApplyingRoomState) {
    sendRoomEvent("match_state", buildRoomState());
  }
}

function applyRoomState(state) {
  if (!state || isRoomHost) return;
  isApplyingRoomState = true;
  const wasRollPhase = !turnState.isStarted;
  if (state.turnState?.isStarted || state.players?.length) {
    lobbyScreen.hidden = true;
    gameScreen.hidden = false;
    document.body.classList.add("is-match");
    syncBackgroundMusic();
  }
  clearNpcTimeout();
  clearTurnAdvanceTimeout();
  stopTimer();
  players = state.players || [];
  roomSeatPlayerIds = state.roomSeatPlayerIds || roomSeatPlayerIds;
  deck = state.deck || [];
  discardPile = state.discardPile || [];
  placements = state.placements || [];
  currentCard = state.currentCard || null;
  selectedHandIndex = state.selectedHandIndex ?? -1;
  matchStartedAt = state.matchStartedAt || matchStartedAt;
  const shouldShowGameOver = Boolean(state.turnState?.isMatchOver && !gameOverShown);
  Object.assign(turnState, state.turnState || {});
  usedQuestionPrompts = new Set(state.usedQuestionPrompts || []);
  feedbackElement.innerHTML = state.feedbackHtml || "";
  if (wasRollPhase && !turnState.isStarted) {
    renderRollPhase();
  } else {
    renderAll();
  }
  timerDisplayElement.textContent = state.timerText || "--";
  timerDisplayElement.classList.toggle("is-urgent", Boolean(state.timerUrgent));
  isApplyingRoomState = false;
  if (shouldShowGameOver) showGameOver();
}

function requestHostAction(action, data = {}) {
  sendRoomEvent("player_action", { action, data, playerId: localRoomPlayerId });
}

function getGamePlayerForRoomId(roomPlayerId) {
  const seatIndex = roomSeatPlayerIds.indexOf(roomPlayerId);
  return players[seatIndex] || null;
}

function replaceDisconnectedPlayersWithNpcs() {
  if (!isRoomHost || lobbyMode !== "friends" || gameScreen.hidden || players.length === 0) return;
  const connectedIds = new Set(roomPlayers.map((presence) => presence.playerId));
  const replacements = [];

  roomSeatPlayerIds.forEach((roomPlayerId, seatIndex) => {
    if (!roomPlayerId || connectedIds.has(roomPlayerId) || !players[seatIndex]) return;
    const player = players[seatIndex];
    player.name = `NPC ${seatIndex + 1}`;
    roomSeatPlayerIds[seatIndex] = null;
    replacements.push(player.name);
  });

  if (replacements.length === 0) return;
  const message = replacements.length === 1
    ? `${replacements[0]} has taken over the empty seat.`
    : `${replacements.join(" and ")} have taken over the empty seats.`;
  setFeedback("A player left the match", message);
  showToast(message, "info");
  renderAll();
  broadcastRoomState();

  if (isNpcPlayer(getActivePlayer()) && !turnState.isResolving) {
    scheduleNpcTurn();
  }
}

function resumeAuthoritativeTurn() {
  if (!isRoomHost || turnState.isMatchOver) return;
  const remaining = Number.parseInt(timerDisplayElement.textContent.match(/\d+/)?.[0] || "0", 10);

  if (!turnState.isStarted) {
    startRollCountdown();
    return;
  }

  if (isNpcPlayer(getActivePlayer())) {
    scheduleNpcTurn();
    return;
  }

  if (remaining <= 0) {
    startDrawTimer();
  } else if (currentCard?.isRevealed) {
    startTimer(remaining, "answer");
  } else if (currentCard) {
    startTimer(remaining, "choose");
  } else if (turnState.hasDrawn) {
    startTimer(remaining, "play");
  } else {
    startTimer(remaining, "draw");
  }
}

function startRoomSyncHeartbeat() {
  stopRoomSyncHeartbeat();
  if (!isRoomHost || lobbyMode !== "friends") return;
  roomSyncTimer = window.setInterval(() => {
    if (!gameScreen.hidden && players.length > 0) broadcastRoomState();
  }, 1200);
}

function stopRoomSyncHeartbeat() {
  if (roomSyncTimer) {
    window.clearInterval(roomSyncTimer);
    roomSyncTimer = null;
  }
}

function handleGuestAction(payload) {
  if (!isRoomHost || !payload) return;
  const requestingPlayer = getGamePlayerForRoomId(payload.playerId);
  const activePlayer = getActivePlayer();
  const { action, data = {} } = payload;
  const expectedPlayer = action === "roll" ? getRollingPlayer() : activePlayer;

  if (!requestingPlayer || requestingPlayer.id !== expectedPlayer?.id || turnState.isResolving) return;

  if (action === "roll") rollTurnOrder();
  if (action === "draw") drawCard();
  if (action === "play_card") playSelectedCard(Number(data.index));
  if (action === "difficulty") chooseQuestionDifficulty(String(data.tier));
  if (action === "target") playActionCard(Number(data.targetId));
  if (action === "answer") submitAnswerValue(String(data.answer || ""));
}

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function setFeedback(title, subtitle = "") {
  feedbackElement.innerHTML = `
    <strong>${title}</strong>
    ${subtitle ? `<span>${subtitle}</span>` : ""}
  `;
}

function getTierByName(tierName) {
  return difficultyTiers.find((tier) => tier.name === tierName);
}

function getActivePlayer() {
  return players.find((player) => player.id === turnState.orderedPlayerIds[turnState.orderIndex]);
}

function getAlivePlayers() {
  return players.filter((player) => !player.isEliminated);
}

function getTargetPlayer() {
  const activePlayer = getActivePlayer();
  const alivePlayers = getAlivePlayers();
  const activeIndex = alivePlayers.findIndex((player) => player.id === activePlayer?.id);

  if (activeIndex < 0 || alivePlayers.length < 2) {
    return null;
  }

  return alivePlayers[(activeIndex + 1) % alivePlayers.length];
}

function getPlayerStatus(player) {
  const status = [];

  if (player.shield) {
    status.push("Shield");
  }

  if (player.doubleDamage) {
    status.push("2x DMG");
  }

  if (player.frozen) {
    status.push("Frozen");
  }

  return status.length > 0 ? status.join(" | ") : "Ready";
}

function getPlayerInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderPlayerVitals(player) {
  const healthPercent = Math.max(0, Math.min(100, (player.health / MAX_HEALTH) * 100));
  const cpPercent = Math.max(0, Math.min(100, (player.calculusPoints / CP_TO_WIN) * 100));

  return `
    <div class="vitals" aria-label="${player.health} health and ${player.calculusPoints} calculus points">
      <div class="vital-row health-vital">
        <span><b>HP</b><em>${player.health}/${MAX_HEALTH}</em></span>
        <div class="vital-track"><i style="width: ${healthPercent}%"></i></div>
      </div>
      <div class="vital-row cp-vital">
        <span><b>CP</b><em>${player.calculusPoints}/${CP_TO_WIN}</em></span>
        <div class="vital-track"><i style="width: ${cpPercent}%"></i></div>
      </div>
    </div>
  `;
}

function showToast(message, type = "info") {
  if (!toastElement) {
    return;
  }

  window.clearTimeout(toastTimer);
  toastElement.textContent = message;
  toastElement.className = `toast is-visible ${type}`;
  toastTimer = window.setTimeout(() => {
    toastElement.className = `toast is-leaving ${type}`;
    toastTimer = window.setTimeout(() => {
      toastElement.className = "toast";
    }, 420);
  }, 3200);
}

function getRollingPlayer() {
  return players[turnState.rollingPlayerIndex] || null;
}

function clearRollCountdown() {
  if (rollCountdownTimer) {
    window.clearInterval(rollCountdownTimer);
    rollCountdownTimer = null;
  }
}

function startRollCountdown() {
  clearRollCountdown();

  if (lobbyMode !== "friends" || turnState.isStarted || turnState.isRolling) {
    return;
  }

  rollCountdown = 15;
  renderAll();
  rollCountdownTimer = window.setInterval(() => {
    rollCountdown -= 1;
    renderAll();

    if (rollCountdown <= 0) {
      clearRollCountdown();
      rollTurnOrder();
    }
  }, 1000);
}

function createDeck() {
  const cards = Array.from({ length: 10 }, (_, index) => ({
    id: `question-${index + 1}`,
    type: "question",
    title: "Question",
    image: imagePaths.questionBack,
  }));

  actionTypes.forEach((action) => {
    for (let copy = 1; copy <= 3; copy += 1) {
      cards.push({
        id: `${action.id}-${copy}`,
        type: "action",
        actionId: action.id,
        title: action.title,
        description: action.description,
        image: action.image,
      });
    }
  });

  return shuffle(cards);
}

function createPlayers(names) {
  return names.map((name, index) => ({
    id: index + 1,
    name,
    health: MAX_HEALTH,
    calculusPoints: 0,
    hand: [],
    dice: null,
    diceValues: [],
    shield: false,
    doubleDamage: false,
    frozen: false,
    doubleDamagePending: false,
    isEliminated: false,
    turnsTaken: 0,
  }));
}

function getJoinedLobbyPlayers() {
  return lobbyPlayers.filter(Boolean);
}

function resetGame(playerNames = getJoinedLobbyPlayers()) {
  clearNpcTimeout();
  clearTurnAdvanceTimeout();
  clearRollCountdown();
  players = createPlayers(playerNames);
  deck = createDeck();
  discardPile = [];
  placements = [];
  currentCard = null;
  selectedHandIndex = -1;
  stopTimer();
  turnState.orderedPlayerIds = players.map((player) => player.id);
  turnState.orderIndex = 0;
  turnState.turnNumber = 1;
  turnState.isStarted = false;
  turnState.rollingPlayerIndex = 0;
  turnState.isRolling = false;
  turnState.isMatchOver = false;
  turnState.hasDrawn = false;
  turnState.isResolving = false;
  usedQuestionPrompts = new Set();
  matchStartedAt = Date.now();
  gameOverShown = false;
  if (gameOverModal.open) gameOverModal.close();
  players.forEach((player) => {
    for (let count = 0; count < 3; count += 1) {
      player.hand.push(deck.pop());
    }
  });
  setFeedback("Roll the dice", "Lowest roll goes first.");
  renderAll();
  startRollCountdown();
}

function finishRollOrder() {
  const rolledOrder = [...players]
    .sort((a, b) => a.dice - b.dice || a.id - b.id)
    .map((player) => player.id);

  turnState.orderedPlayerIds = rolledOrder;
  turnState.orderIndex = 0;
  turnState.turnNumber = 1;
  turnState.isStarted = true;
  turnState.isRolling = false;
  clearRollCountdown();
  timerDisplayElement.textContent = "--";
  setFeedback("Turn order set.", `${getActivePlayer().name} rolled lowest and goes first.`);
  showToast(`${getActivePlayer().name} goes first.`, "info");
  renderAll();
  startDrawTimer();
  scheduleNpcTurn();
}

function rollTurnOrder() {
  if (isFriendsGuest()) {
    requestHostAction("roll");
    return;
  }
  if (turnState.isStarted || turnState.isRolling) {
    return;
  }

  clearRollCountdown();
  const rollingPlayer = getRollingPlayer();

  if (!rollingPlayer) {
    finishRollOrder();
    return;
  }

  turnState.isRolling = true;
  playSound("dice");
  rollingPlayer.dice = null;
  rollingPlayer.diceValues = [rollDie(), rollDie()];
  setFeedback(`${rollingPlayer.name} is rolling...`, "Lowest roll goes first.");
  renderRollPhase();

  window.setTimeout(() => {
    const firstDie = rollDie();
    const secondDie = rollDie();
    rollingPlayer.diceValues = [firstDie, secondDie];
    rollingPlayer.dice = firstDie + secondDie;
    setFeedback(`${rollingPlayer.name} rolled ${rollingPlayer.dice}.`, "Lowest roll goes first.");
    renderRollPhase();

    window.setTimeout(() => {
    turnState.rollingPlayerIndex += 1;
    turnState.isRolling = false;

    if (turnState.rollingPlayerIndex >= players.length) {
      finishRollOrder();
      return;
    }

    const nextRoller = getRollingPlayer();
    setFeedback("Roll the dice", `${nextRoller.name} rolls next. Lowest roll goes first.`);
    renderRollPhase();

    if (lobbyMode === "npc" && isNpcPlayer(nextRoller)) {
      npcTimeout = window.setTimeout(rollTurnOrder, 2200);
    } else {
      startRollCountdown();
    }
    }, 1800);
  }, 1650);
}

function drawCard() {
  if (isFriendsGuest()) {
    requestHostAction("draw");
    return;
  }
  if (!turnState.isStarted || turnState.isMatchOver || turnState.isResolving || turnState.hasDrawn || currentCard) {
    return;
  }

  const activePlayer = getActivePlayer();
  stopTimer();

  if (!activePlayer || activePlayer.isEliminated) {
    nextTurn();
    return;
  }

  if (deck.length === 0) {
    if (discardPile.length === 0) {
      setFeedback("Deck is empty", "Play a card from your hand to continue.");
      showToast("No cards left to draw. Play from your hand.", "info");
      return;
    }
    deck = shuffle(discardPile);
    discardPile = [];
    playSound("shuffle");
  }

  const card = deck.pop();
  turnState.isResolving = true;
  activePlayer.hand.push(card);
  turnState.hasDrawn = true;
  document.body.classList.add("card-drawn");
  window.setTimeout(() => document.body.classList.remove("card-drawn"), 500);
  feedbackElement.textContent = `${activePlayer.name} drew a ${card.type} card. Choose a card from your hand.`;
  if (isLocalHumanPlayer(activePlayer)) {
    showToast(`${card.type === "question" ? "Question card" : card.title} added to your hand.`, "private");
    playSound("draw");
  }
  renderAll();
  scheduleAutoAdvance();
}

function playSelectedCard(index) {
  if (isFriendsGuest()) {
    requestHostAction("play_card", { index });
    return;
  }
  const activePlayer = getActivePlayer();

  if (turnState.isResolving || !activePlayer || !activePlayer.hand[index] || currentCard || activePlayer.turnsTaken === 0 || turnState.hasDrawn) {
    return;
  }

  selectedHandIndex = index;
  currentCard = activePlayer.hand[index];
  stopTimer();
  feedbackElement.textContent = currentCard.type === "question"
    ? "Choose a difficulty for this question."
    : `Choose a target for ${currentCard.title}.`;
  renderAll();
  startTimer(CHOICE_TIME_LIMIT, "choose");
}

function chooseQuestionDifficulty(tierName) {
  if (isFriendsGuest()) {
    requestHostAction("difficulty", { tier: tierName });
    return;
  }
  if (!currentCard || currentCard.type !== "question") {
    return;
  }

  let availableQuestions = questionBank.filter((question) => question.tier === tierName && !usedQuestionPrompts.has(question.prompt));

  if (availableQuestions.length === 0) {
    questionBank.filter((question) => question.tier === tierName).forEach((question) => usedQuestionPrompts.delete(question.prompt));
    availableQuestions = questionBank.filter((question) => question.tier === tierName);
  }
  const question = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  usedQuestionPrompts.add(question.prompt);
  Object.assign(currentCard, question, { difficulty: tierName, isRevealed: true });
  startTimer(getTierByName(tierName).timeLimit, "answer");
  setFeedback(`${tierName} question`, "Solve it before the timer ends.");
  renderAll();
}

function playActionCard(targetId) {
  if (isFriendsGuest()) {
    requestHostAction("target", { targetId });
    return;
  }
  if (turnState.isResolving || !currentCard || currentCard.type !== "action") {
    return;
  }

  const activePlayer = getActivePlayer();
  turnState.isResolving = true;
  const target = players.find((player) => player.id === targetId) || activePlayer;
  const card = removeCurrentCardFromHand();
  const expiringDoubleDamage = activePlayer.doubleDamage;

  if (card.actionId === "shield") {
    activePlayer.shield = true;
  } else if (card.actionId === "double-damage") {
    activePlayer.doubleDamagePending = true;
  } else if (card.actionId === "freeze" && target.id !== activePlayer.id) {
    target.frozen = true;
  } else if (card.actionId === "steal" && target.id !== activePlayer.id && target.hand.length > 0) {
    const stolenIndex = Math.floor(Math.random() * target.hand.length);
    activePlayer.hand.push(target.hand.splice(stolenIndex, 1)[0]);
  }

  discardUsedCard(card);
  activePlayer.doubleDamage = false;
  playSound(card.actionId === "double-damage" ? "action" : card.actionId);
  showToast(`${activePlayer.name} played ${card.title}.`, "good");
  setFeedback(`${activePlayer.name} played ${card.title}.`, `${expiringDoubleDamage ? "Their Double Damage effect expired. " : ""}The card was shuffled back into the deck.`);
  renderAll();
  scheduleAutoAdvance();
}

function returnCardToDeck(card) {
  discardUsedCard(card);
}

function discardUsedCard(card) {
  discardPile.push(card.type === "question"
    ? { id: card.id, type: "question", title: "Question", image: imagePaths.questionBack }
    : card);
}

function removeCurrentCardFromHand() {
  const activePlayer = getActivePlayer();

  if (!activePlayer || selectedHandIndex < 0) {
    return currentCard;
  }

  const [card] = activePlayer.hand.splice(selectedHandIndex, 1);
  selectedHandIndex = -1;
  currentCard = null;
  return card;
}

function damagePlayer(target, amount) {
  if (!target) {
    return 0;
  }

  if (target.shield) {
    target.shield = false;
    playSound("shield");
    return 0;
  }

  target.health = Math.max(0, target.health - amount);

  if (target.health <= 0 && !target.isEliminated) {
    target.isEliminated = true;
    placements.unshift(target.name);
  }

  return amount;
}

function answerCorrect() {
  if (turnState.isResolving || !currentCard) {
    return;
  }

  turnState.isResolving = true;
  stopTimer();
  const activePlayer = getActivePlayer();
  const target = getTargetPlayer();
  const card = removeCurrentCardFromHand();
  const tier = getTierByName(card.difficulty);
  const damage = activePlayer.doubleDamage ? tier.damage * 2 : tier.damage;
  activePlayer.doubleDamage = false;
  activePlayer.calculusPoints += tier.calculusPoints;
  const damageDealt = damagePlayer(target, damage);
  discardUsedCard(card);
  feedbackElement.textContent = `${activePlayer.name} answered correctly and earned ${tier.calculusPoints} CP.`;
  showToast(`${activePlayer.name} answered correctly: +${tier.calculusPoints} CP and ${damageDealt} damage.`, "good");
  playSound("correct");
  if (damageDealt > 0) window.setTimeout(() => playSound("damage"), 260);
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function normalizeAnswer(answer) {
  return answer
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace("\u221e", "infinity");
}

function submitAnswer(event) {
  event.preventDefault();

  if (turnState.isResolving || !currentCard) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const submittedAnswer = normalizeAnswer(String(formData.get("answer") || ""));
  if (isFriendsGuest()) {
    requestHostAction("answer", { answer: submittedAnswer });
    return;
  }
  submitAnswerValue(submittedAnswer);
}

function submitAnswerValue(answer) {
  if (!currentCard || turnState.isResolving) return;
  const submittedAnswer = normalizeAnswer(answer);
  const correctAnswer = normalizeAnswer(currentCard.answer);

  if (submittedAnswer === correctAnswer) {
    answerCorrect();
    return;
  }

  answerWrong();
}

function answerWrong() {
  if (turnState.isResolving || !currentCard) {
    return;
  }

  turnState.isResolving = true;
  stopTimer();
  const activePlayer = getActivePlayer();
  const card = removeCurrentCardFromHand();
  const tier = getTierByName(card.difficulty);
  activePlayer.doubleDamage = false;
  activePlayer.health = Math.max(0, activePlayer.health - tier.wrongPenalty);
  discardUsedCard(card);
  feedbackElement.textContent = `${feedbackMessages.wrong} ${activePlayer.name} lost ${tier.wrongPenalty} HP.`;
  showToast(`${feedbackMessages.wrong} -${tier.wrongPenalty} HP.`, "bad");
  playSound("wrong");
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function timerOut() {
  if (turnState.isResolving || !currentCard) {
    return;
  }

  turnState.isResolving = true;
  stopTimer();
  const activePlayer = getActivePlayer();
  const card = removeCurrentCardFromHand();
  activePlayer.doubleDamage = false;
  activePlayer.health = Math.max(0, activePlayer.health - 1);
  discardUsedCard(card);
  feedbackElement.textContent = `Time is up. ${activePlayer.name} lost 1 HP.`;
  showToast("Timer ran out. -1 HP.", "bad");
  playSound("timeout");
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function useInfinityFeedback() {
  feedbackElement.textContent = feedbackMessages.infinity;
  showToast(feedbackMessages.infinity, "info");
}

function formatMatchDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getMatchWinner() {
  return players.find((player) => player.calculusPoints >= CP_TO_WIN)
    || getAlivePlayers()[0]
    || [...players].sort((a, b) => b.calculusPoints - a.calculusPoints || b.health - a.health)[0];
}

function showGameOver() {
  if (gameOverShown || !turnState.isMatchOver || players.length === 0) return;
  gameOverShown = true;
  const winner = getMatchWinner();
  const wonByPoints = winner.calculusPoints >= CP_TO_WIN;
  const standings = [...players].sort((a, b) => {
    if (a.id === winner.id) return -1;
    if (b.id === winner.id) return 1;
    return Number(a.isEliminated) - Number(b.isEliminated) || b.calculusPoints - a.calculusPoints || b.health - a.health;
  });

  winnerNameElement.textContent = winner.name;
  victoryReasonElement.textContent = wonByPoints
    ? `Won by reaching ${CP_TO_WIN} Calculus Points`
    : "Won as the last player standing";
  matchDurationElement.textContent = formatMatchDuration(Date.now() - matchStartedAt);
  matchTurnsElement.textContent = String(turnState.turnNumber);
  matchPlayerCountElement.textContent = String(players.length);
  finalStandingsListElement.innerHTML = standings.map((player, index) => `
    <article class="standing-row${player.id === winner.id ? " is-winner" : ""}" style="--standing-index:${index}">
      <span class="standing-place">${index + 1}</span>
      <span class="standing-avatar">${getPlayerInitials(player.name)}</span>
      <div><strong>${player.name}</strong><small>${player.isEliminated ? "Eliminated" : player.id === winner.id ? "Winner" : "Survived"}</small></div>
      <span><b>${player.calculusPoints}</b> CP</span>
      <span><b>${player.health}</b> HP</span>
    </article>
  `).join("");
  const guest = isFriendsGuest();
  playAgainButton.hidden = guest;
  playAgainNote.hidden = !guest;
  gameOverModal.showModal();
  playSound("win");
  broadcastRoomState();
}

function returnToLobbyFromGameOver() {
  if (gameOverModal.open) gameOverModal.close();
  gameScreen.hidden = true;
  lobbyScreen.hidden = false;
  document.body.classList.remove("is-match", "is-roll-phase");
  clearNpcTimeout();
  clearTurnAdvanceTimeout();
  clearRollCountdown();
  stopTimer();
  syncBackgroundMusic();
  renderLobby();
}

function checkWinConditions() {
  players.forEach((player) => {
    if (player.health <= 0 && !player.isEliminated) {
      player.isEliminated = true;
      placements.unshift(player.name);
    }
  });

  const cpWinner = players.find((player) => !player.isEliminated && player.calculusPoints >= CP_TO_WIN);
  const alivePlayers = getAlivePlayers();

  if (cpWinner) {
    turnState.isMatchOver = true;
    stopTimer();
    feedbackElement.textContent = `${cpWinner.name} reached ${CP_TO_WIN} CP and wins the match.`;
    showToast(`${cpWinner.name} reached ${CP_TO_WIN} CP.`, "good");
    playSound("win");
    window.setTimeout(showGameOver, 900);
  }

  if (alivePlayers.length === 1) {
    turnState.isMatchOver = true;
    stopTimer();
    feedbackElement.textContent = `${alivePlayers[0].name} wins as the last player remaining.`;
    showToast(`${alivePlayers[0].name} wins the match.`, "good");
    playSound("win");
    window.setTimeout(showGameOver, 900);
  }
}

function nextTurn() {
  if (!turnState.isStarted || turnState.isMatchOver) {
    return;
  }

  clearNpcTimeout();
  clearTurnAdvanceTimeout();
  stopTimer();
  const previousPlayer = getActivePlayer();
  if (previousPlayer) previousPlayer.turnsTaken += 1;
  currentCard = null;
  selectedHandIndex = -1;

  const aliveIds = getAlivePlayers().map((player) => player.id);
  turnState.orderedPlayerIds = turnState.orderedPlayerIds.filter((id) => aliveIds.includes(id));

  if (turnState.orderedPlayerIds.length <= 1) {
    checkWinConditions();
    renderAll();
    return;
  }

  turnState.orderIndex = (turnState.orderIndex + 1) % turnState.orderedPlayerIds.length;
  turnState.turnNumber += 1;
  turnState.hasDrawn = false;
  turnState.isResolving = false;
  const nextPlayer = getActivePlayer();
  nextPlayer.shield = false;
  nextPlayer.doubleDamage = nextPlayer.doubleDamagePending;
  nextPlayer.doubleDamagePending = false;

  if (nextPlayer.frozen) {
    nextPlayer.frozen = false;
    nextPlayer.doubleDamage = false;
    setFeedback(`${nextPlayer.name} is frozen`, "Their turn is skipped.");
    showToast(`${nextPlayer.name} misses this turn.`, "info");
    renderAll();
    npcTimeout = window.setTimeout(nextTurn, 1300);
    return;
  }
  feedbackElement.textContent = `${getActivePlayer().name}'s turn. Draw a card.`;
  renderAll();
  if (isLocalHumanPlayer(getActivePlayer())) {
    playSound("turn");
  }
  startDrawTimer();
  scheduleNpcTurn();
}

function startDrawTimer() {
  if (!turnState.isStarted || turnState.isMatchOver || currentCard || !getActivePlayer()) {
    return;
  }

  const activePlayer = getActivePlayer();
  const instruction = activePlayer.turnsTaken === 0
    ? `First turn: draw a card within ${DRAW_TIME_LIMIT} seconds.`
    : `Draw from the deck or play a card within ${DRAW_TIME_LIMIT} seconds.`;
  setFeedback(`${activePlayer.name}'s turn`, instruction);
  startTimer(DRAW_TIME_LIMIT, "draw");
}

function drawTimerOut() {
  const activePlayer = getActivePlayer();

  if (!activePlayer || currentCard) {
    return;
  }

  turnState.isResolving = true;
  stopTimer();
  activePlayer.health = Math.max(0, activePlayer.health - 1);
  showToast(`${activePlayer.name} waited too long. -1 HP.`, "bad");
  playSound("timeout");
  setFeedback("Turn missed", `${activePlayer.name} lost 1 HP for not drawing.`);
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function playTimerOut() {
  const activePlayer = getActivePlayer();

  if (!activePlayer || currentCard || !turnState.hasDrawn) {
    return;
  }

  turnState.isResolving = true;
  stopTimer();
  activePlayer.health = Math.max(0, activePlayer.health - 0.5);
  setFeedback("Decision timed out", `${activePlayer.name} lost 0.5 HP for not playing a card.`);
  showToast("No card played. -0.5 HP.", "bad");
  playSound("timeout");
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function choiceTimerOut() {
  const activePlayer = getActivePlayer();

  if (!activePlayer || !currentCard || currentCard.isRevealed) {
    return;
  }

  turnState.isResolving = true;
  stopTimer();
  currentCard = null;
  selectedHandIndex = -1;
  activePlayer.doubleDamage = false;
  activePlayer.health = Math.max(0, activePlayer.health - 0.5);
  setFeedback("Choice timed out", `${activePlayer.name} kept the card but lost 0.5 HP.`);
  showToast("No choice made. -0.5 HP.", "bad");
  playSound("timeout");
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function startTimer(seconds, mode = "answer") {
  stopTimer();
  timerMode = mode;
  const timerLabels = { draw: "Draw", play: "Play", choose: "Choose", answer: "Solve" };
  const timerLabel = timerLabels[mode] || "Time";
  let remaining = seconds;
  timerDisplayElement.textContent = `${timerLabel} ${remaining}s`;
  timerDisplayElement.dataset.phase = mode;
  timerDisplayElement.classList.remove("is-urgent");

  timer = window.setInterval(() => {
    remaining -= 1;
    timerDisplayElement.textContent = `${timerLabel} ${remaining}s`;
    timerDisplayElement.classList.toggle("is-urgent", remaining <= 5);
    broadcastRoomState();

    if (remaining <= 0) {
      if (timerMode === "draw") {
        drawTimerOut();
      } else if (timerMode === "play") {
        playTimerOut();
      } else if (timerMode === "choose") {
        choiceTimerOut();
      } else {
        timerOut();
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }

  timerDisplayElement.textContent = "--";
  delete timerDisplayElement.dataset.phase;
  timerDisplayElement.classList.remove("is-urgent");
  timerMode = null;
}

function clearNpcTimeout() {
  if (npcTimeout) {
    window.clearTimeout(npcTimeout);
    npcTimeout = null;
  }
}

function clearTurnAdvanceTimeout() {
  if (turnAdvanceTimeout) {
    window.clearTimeout(turnAdvanceTimeout);
    turnAdvanceTimeout = null;
  }
}

function isNpcPlayer(player) {
  return Boolean(player && player.name.startsWith("NPC"));
}

function scheduleNpcTurn() {
  clearNpcTimeout();
  const activePlayer = getActivePlayer();

  if (!turnState.isStarted || !isNpcPlayer(activePlayer) || currentCard) {
    return;
  }

  setFeedback(`${activePlayer.name}'s turn`, "They are considering their options...");

  npcTimeout = window.setTimeout(() => {
    setFeedback(`${activePlayer.name} is choosing`, "Draw a new card or play from their hand?");
    const canDraw = deck.length > 0 || discardPile.length > 0;
    const shouldDraw = canDraw && (activePlayer.turnsTaken === 0 || activePlayer.hand.length < 2 || Math.random() < 0.34);

    if (shouldDraw) {
      npcTimeout = window.setTimeout(() => drawCard(), 1100);
      return;
    }

    const cardIndex = Math.floor(Math.random() * activePlayer.hand.length);
    const chosenCard = activePlayer.hand[cardIndex];
    setFeedback(`${activePlayer.name} chose a card`, chosenCard.type === "question" ? "Preparing a question..." : `Preparing ${chosenCard.title}...`);

    npcTimeout = window.setTimeout(() => {
      const currentActivePlayer = getActivePlayer();

      if (!currentActivePlayer || currentActivePlayer.id !== activePlayer.id || !isNpcPlayer(currentActivePlayer) || currentCard) {
        return;
      }

      playSelectedCard(cardIndex);

      if (currentCard.type === "action") {
        const target = getTargetPlayer();
        const targetId = currentCard.actionId === "shield" || currentCard.actionId === "double-damage" ? currentActivePlayer.id : target.id;
        const targetName = targetId === currentActivePlayer.id ? "themselves" : target.name;
        setFeedback(`${currentActivePlayer.name} is using ${currentCard.title}`, `Target: ${targetName}`);
        npcTimeout = window.setTimeout(() => playActionCard(targetId), 1400);
        return;
      }

      const tierName = Math.random() < 0.5 ? "Easy" : Math.random() < 0.75 ? "Medium" : "Hard";
      setFeedback(`${currentActivePlayer.name} chose ${tierName}`, "The question is being revealed...");
      npcTimeout = window.setTimeout(() => {
        chooseQuestionDifficulty(tierName);
        setFeedback(`${currentActivePlayer.name} is solving`, "Waiting for their answer...");
        npcTimeout = window.setTimeout(() => {
        const accuracy = npcAccuracyByTier[tierName] ?? 0.6;
        if (Math.random() < accuracy) answerCorrect(); else answerWrong();
        }, 2800);
      }, 1200);
    }, 1500);
  }, 1700);
}

function scheduleAutoAdvance() {
  clearTurnAdvanceTimeout();
  const activePlayer = getActivePlayer();

  if (!turnState.isStarted || turnState.isMatchOver || !activePlayer || currentCard || getAlivePlayers().length <= 1) {
    return;
  }

  turnAdvanceTimeout = window.setTimeout(() => {
    turnAdvanceTimeout = null;
    nextTurn();
  }, isNpcPlayer(activePlayer) ? 2300 : 1700);
}

function renderDifficultyTiers() {
  difficultyTiersElement.innerHTML = difficultyTiers
    .map((tier) => `
      <article class="tier-row">
        <div>
          <p class="tier-name">${tier.name}</p>
          <p class="tier-description">${tier.description}</p>
          <p class="tier-description">Timer: ${tier.timeLimit}s | Wrong: -${tier.wrongPenalty} HP</p>
        </div>
        <span class="tier-value">${tier.calculusPoints} CP<br>${tier.damage} DMG</span>
      </article>
    `)
    .join("");
}

function renderTurnSystem() {
  const activePlayer = getActivePlayer();
  const isNpcTurn = isNpcPlayer(activePlayer);
  const localPlayer = getLocalGamePlayer();
  const isLocalTurn = lobbyMode !== "friends" || activePlayer?.id === localPlayer?.id;
  const rollingPlayer = getRollingPlayer();
  document.body.classList.toggle("is-roll-phase", !turnState.isStarted);
  turnCounterElement.textContent = turnState.isStarted
    ? `Turn ${turnState.turnNumber}`
    : rollingPlayer ? `${rollingPlayer.name}'s roll` : "Roll Phase";
  activePlayerElement.textContent = turnState.isStarted
    ? activePlayer.name
    : "Roll the dice";
  timerDisplayElement.textContent = turnState.isStarted
    ? timerDisplayElement.textContent
    : lobbyMode === "friends" ? `Lowest roll goes first | ${rollCountdown}s` : "Lowest roll goes first";
  const canDraw = deck.length > 0 || discardPile.length > 0;
  drawCardButton.disabled = !turnState.isStarted || turnState.isMatchOver || turnState.isResolving || turnState.hasDrawn || Boolean(currentCard) || isNpcTurn || !isLocalTurn || !canDraw;
  deckStackButton.disabled = drawCardButton.disabled;
  deckStackButton.classList.toggle("is-ready", !deckStackButton.disabled);
  const isLocalRoll = lobbyMode !== "friends" || rollingPlayer?.id === localPlayer?.id;
  rollOrderButton.hidden = turnState.isStarted || turnState.isRolling || !isLocalRoll || (lobbyMode === "npc" && isNpcPlayer(rollingPlayer));
  rollOrderButton.disabled = rollOrderButton.hidden;
  rollOrderButton.textContent = turnState.isStarted ? "Dice Rolled" : "Roll Dice";
}

function renderRules() {
  rulesListElement.innerHTML = gameRules
    .map((rule, index) => `
      <li>
        <span class="rule-number">${index + 1}</span>
        <div>
          <strong>${rule.title}</strong>
          <p>${rule.description}</p>
        </div>
      </li>
    `)
    .join("");
}

function renderConcepts() {
  conceptListElement.innerHTML = actionTypes
    .map((action) => `
      <article class="concept-row">
        <img src="${action.image}" alt="${action.title} card">
        <div>
          <p class="tier-name">${action.title}</p>
          <p class="tier-description">${action.concept}</p>
          <p class="tier-description">${action.description}</p>
        </div>
      </article>
    `)
    .join("");
}

function renderDeckCounts() {
  deckCountElement.textContent = deck.length;
  discardCountElement.textContent = discardPile.length;
  const visibleCards = discardPile.slice(-5);
  playedCardPileElement.innerHTML = visibleCards.length
    ? visibleCards.map((card, index) => `<img style="--pile-x:${(index - 2) * 1.5}px;--pile-y:${(index - 2) * -1}px;--pile-rotation:${(index - 2) * 1.2}deg" src="${card.image}" alt="${index === visibleCards.length - 1 ? `${card.title || "Question"} card on top of the played pile` : "Played card"}">`).join("")
    : `<span class="pile-empty">Empty</span>`;
}


function renderDie(value) {
  const dots = Array.from({ length: value }, (_, index) => `<span class="pip pip-${index + 1}"></span>`).join("");
  return `<span class="die face-${value}" aria-label="${value}">${dots}</span>`;
}

function updateRollingDice(values) {
  const diceRow = diceRollPanelElement.querySelector(".dice-row");

  if (diceRow) {
    diceRow.innerHTML = values.map(renderDie).join("");
  }
}

function renderDiceRollPanel() {
  if (turnState.isStarted) {
    diceRollPanelElement.innerHTML = "";
    return;
  }

  const rollingPlayer = getRollingPlayer();
  const visiblePlayer = rollingPlayer || players[players.length - 1];
  const rolledPlayers = players.filter((player) => player.dice);

  diceRollPanelElement.innerHTML = visiblePlayer
    ? `
      <div class="dice-center${turnState.isRolling ? " is-rolling" : ""}">
        <div class="dice-copy">
          <div class="dice-phase-label">Turn order</div>
          <div class="dice-title">${visiblePlayer.name}</div>
          <p class="dice-instruction">${visiblePlayer.dice ? "Roll complete" : turnState.isRolling ? "Rolling the dice..." : "Lowest total takes the first turn"}</p>
        </div>
        <div class="dice-row">
          ${(visiblePlayer.diceValues.length === 2 ? visiblePlayer.diceValues : [1, 1]).map(renderDie).join("")}
        </div>
        <strong>${visiblePlayer.dice ? `<span class="roll-total">${visiblePlayer.dice}</span><span>Total rolled</span>` : turnState.isRolling ? "Let them roll..." : "Ready when you are"}</strong>
      </div>
      <div class="roll-results">
        ${rolledPlayers.map((player, index) => `<p><span>${index + 1}</span>${player.name}<strong>${player.dice}</strong></p>`).join("")}
      </div>
    `
    : "";
}

function renderLobby() {
  lobbySlotsElement.innerHTML = lobbyPlayers
    .map((playerName, index) => `
      <article class="lobby-slot${playerName ? " is-filled" : ""}" style="--slot-index:${index}">
        <span>Seat ${index + 1}</span>
        <strong>${playerName || "Empty"}</strong>
      </article>
    `)
    .join("");

  const joinedCount = getJoinedLobbyPlayers().length;
  startMatchButton.disabled = joinedCount < 2 || (lobbyMode === "friends" && !isRoomHost);

  if (!lobbyMode) {
    lobbyStatusElement.textContent = "Choose NPCs or Friends.";
    return;
  }

  if (lobbyMode === "friends" && !isRoomHost) {
    lobbyStatusElement.textContent = `${joinedCount} player${joinedCount === 1 ? "" : "s"} connected. Waiting for the host to start.`;
    return;
  }

  lobbyStatusElement.textContent = joinedCount >= 2
    ? `${joinedCount} players connected. The room is ready.`
    : "Share the invite link and wait for another player.";
}

function createRoomCode() {
  return crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
}

function buildRoomLink(code) {
  const url = new URL(location.href);
  url.searchParams.set("room", code);
  url.hash = "";
  return url.href;
}

function getPresencePlayers() {
  if (!roomChannel) {
    return [];
  }

  return Object.values(roomChannel.presenceState())
    .flat()
    .filter((presence) => presence.playerId)
    .sort((a, b) => Number(b.isHost) - Number(a.isHost) || a.joinedAt - b.joinedAt)
    .slice(0, 4);
}

async function leaveRealtimeRoom() {
  stopRoomSyncHeartbeat();
  if (roomChannel && realtimeClient) {
    await realtimeClient.removeChannel(roomChannel);
  }

  roomChannel = null;
  roomCode = null;
  roomPlayers = [];
  roomSeatPlayerIds = [];
  isRoomHost = false;
}

async function connectToRoom(code, hostRoom = false) {
  if (!realtimeClient) {
    lobbyStatusElement.textContent = "Could not load the multiplayer connection. Check your internet connection.";
    return;
  }

  await leaveRealtimeRoom();
  roomCode = code.toUpperCase();
  isRoomHost = hostRoom;
  lobbyMode = "friends";
  invitePanel.hidden = false;
  inviteLinkInput.value = buildRoomLink(roomCode);
  lobbyPlayers = ["Connecting...", null, null, null];
  renderLobby();

  roomChannel = realtimeClient.channel(`league-room:${roomCode}`, {
    config: {
      presence: { key: localRoomPlayerId },
      broadcast: { ack: true, self: false },
    },
  });

  roomChannel
    .on("presence", { event: "sync" }, () => {
      roomPlayers = getPresencePlayers();
      lobbyPlayers = Array.from({ length: 4 }, (_, index) => roomPlayers[index] ? `Player ${index + 1}` : null);
      renderLobby();
      replaceDisconnectedPlayersWithNpcs();
    })
    .on("presence", { event: "leave" }, () => {
      roomPlayers = getPresencePlayers();
      lobbyPlayers = Array.from({ length: 4 }, (_, index) => roomPlayers[index] ? `Player ${index + 1}` : null);
      renderLobby();
      replaceDisconnectedPlayersWithNpcs();
    })
    .on("broadcast", { event: "match_start" }, ({ payload }) => {
      if (isRoomHost) return;
      lobbyScreen.hidden = true;
      gameScreen.hidden = false;
      document.body.classList.add("is-match");
      syncBackgroundMusic();
      applyRoomState(payload.state);
    })
    .on("broadcast", { event: "match_state" }, ({ payload }) => {
      applyRoomState(payload);
    })
    .on("broadcast", { event: "player_action" }, ({ payload }) => {
      handleGuestAction(payload);
    })
    .on("broadcast", { event: "state_request" }, () => {
      if (isRoomHost && !gameScreen.hidden && players.length > 0) broadcastRoomState();
    })
    .on("broadcast", { event: "host_transfer" }, ({ payload }) => {
      if (!payload || payload.successorId !== localRoomPlayerId) return;
      applyRoomState(payload.state);
      isRoomHost = true;
      startRoomSyncHeartbeat();
      window.setTimeout(() => {
        roomPlayers = getPresencePlayers();
        replaceDisconnectedPlayersWithNpcs();
        resumeAuthoritativeTurn();
      }, 500);
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await roomChannel.track({
          playerId: localRoomPlayerId,
          isHost: isRoomHost,
          joinedAt: Date.now(),
        });
        if (!isRoomHost) sendRoomEvent("state_request", { playerId: localRoomPlayerId });
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        lobbyStatusElement.textContent = "The room connection failed. Refresh and try again.";
      }
    });
}

function selectNpcMode() {
  leaveRealtimeRoom();
  lobbyMode = "npc";
  lobbyPlayers = ["Player 1", "NPC 1", "NPC 2", "NPC 3"];
  invitePanel.hidden = true;
  renderLobby();
}

async function selectFriendsMode() {
  await connectToRoom(createRoomCode(), true);
}

function renderCardBacks(cards) {
  return cards.map((card, index) => `
    <img style="--card-index:${index};--deal-delay:${index * 55}ms" src="${card.type === "question" ? imagePaths.questionBack : imagePaths.actionBack}" alt="Hidden card back">
  `).join("");
}

function getHandSignature(player) {
  if (!player) return "";
  return `${player.id}:${player.hand.map((card) => `${card.type}:${card.actionId || card.title || card.image}`).join("|")}`;
}

function getHandCardKeys(player) {
  if (!player) return [];
  const occurrences = new Map();
  return player.hand.map((card) => {
    const identity = `${card.type}:${card.actionId || card.title || card.image}`;
    const occurrence = occurrences.get(identity) || 0;
    occurrences.set(identity, occurrence + 1);
    return `${identity}:${occurrence}`;
  });
}

function renderTable() {
  const activePlayer = getActivePlayer();
  const bottomPlayer = lobbyMode === "npc"
    ? players.find((player) => player.id === 1)
    : getLocalGamePlayer() || activePlayer;
  const opponents = players.filter((player) => !bottomPlayer || player.id !== bottomPlayer.id);
  const previousHandCards = activeHandElement.querySelector(".hand-cards");
  const handSignature = getHandSignature(bottomPlayer);
  const handCardKeys = getHandCardKeys(bottomPlayer);
  tableLayoutElement.dataset.players = String(players.length);

  renderOpponentSlot(topOpponentElement, opponents[0], "horizontal");
  renderOpponentSlot(leftOpponentElement, opponents[1], "vertical");
  renderOpponentSlot(rightOpponentElement, opponents[2], "vertical");

  const handCards = bottomPlayer
    ? bottomPlayer.hand
      .map((card, index) => `
        <button class="hand-card ${card.type}${index >= 6 ? " is-overflow" : ""}${activePlayer && bottomPlayer.id === activePlayer.id && index === selectedHandIndex ? " is-selected" : ""}" style="--hand-index:${index};--overflow-index:${Math.max(0, index - 6)};--deal-delay:${index * 55}ms" type="button" data-hand-index="${index}" ${activePlayer && bottomPlayer.id === activePlayer.id && activePlayer.turnsTaken > 0 && !turnState.hasDrawn && !turnState.isResolving && !currentCard ? "" : "disabled"}>
          <img src="${card.image}" alt="${card.title || "Question"} card">
          <span>${card.title || "Question"}</span>
        </button>
      `)
      .join("")
    : "";
  const canControlCurrentTurn = Boolean(activePlayer && bottomPlayer && activePlayer.id === bottomPlayer.id && !isNpcPlayer(activePlayer));
  const canPlayHand = Boolean(canControlCurrentTurn && activePlayer.turnsTaken > 0 && !turnState.hasDrawn && !turnState.isResolving && !currentCard);
  const canAnswerCurrentCard = Boolean(currentCard?.isRevealed && canControlCurrentTurn);
  const answerForm = canAnswerCurrentCard
    ? `
      <form class="answer-form">
        <label for="answer-input">Your answer</label>
        <input id="answer-input" name="answer" type="text" autocomplete="off" placeholder="Type the answer..." required>
        <button type="submit" ${turnState.isResolving ? "disabled" : ""}>Submit answer</button>
      </form>
    `
    : "";

  const activeHandHtml = activePlayer
    ? `
      <article class="active-seat${bottomPlayer.isEliminated ? " is-eliminated" : ""}${activePlayer.id === bottomPlayer.id ? " is-active" : ""}">
        <header class="active-player-header">
          <div class="active-player-identity">
            <span>Player status</span>
            <p>${bottomPlayer.name}</p>
          </div>
          <span class="turn-pill">${activePlayer.id === bottomPlayer.id ? "Your turn" : "Waiting"}</span>
        </header>
        ${renderPlayerVitals(bottomPlayer)}
      </article>
      <div class="personal-hand">
        <div class="hand-heading">
          <span>Your hand</span>
          <small class="your-card-count"><strong>${bottomPlayer.hand.length}</strong> card${bottomPlayer.hand.length === 1 ? "" : "s"}</small>
        </div>
        <div class="hand-cards">
          ${handCards || `<p class="empty-card">Your cards will wait here.</p>`}
        </div>
      </div>
    `
    : "";

  if (!activePlayer) {
    activeHandElement.innerHTML = "";
    delete activeHandElement.dataset.playerId;
  } else if (activeHandElement.dataset.playerId !== String(bottomPlayer.id) || !previousHandCards) {
    activeHandElement.innerHTML = activeHandHtml;
    activeHandElement.dataset.playerId = String(bottomPlayer.id);
    activeHandElement.querySelector(".hand-cards")._handSignature = handSignature;
  } else {
    const nextHandContent = document.createElement("div");
    nextHandContent.innerHTML = activeHandHtml;
    const currentActiveSeat = activeHandElement.querySelector(".active-seat");
    const nextActiveSeat = nextHandContent.querySelector(".active-seat");
    if (currentActiveSeat && nextActiveSeat) {
      currentActiveSeat.className = nextActiveSeat.className;
      currentActiveSeat.querySelector(".active-player-identity p").textContent = nextActiveSeat.querySelector(".active-player-identity p").textContent;
      currentActiveSeat.querySelector(".turn-pill").textContent = nextActiveSeat.querySelector(".turn-pill").textContent;
      currentActiveSeat.querySelectorAll(".vital-row").forEach((vitalRow, index) => {
        const nextVitalRow = nextActiveSeat.querySelectorAll(".vital-row")[index];
        vitalRow.querySelector("em").textContent = nextVitalRow.querySelector("em").textContent;
        vitalRow.querySelector(".vital-track i").style.width = nextVitalRow.querySelector(".vital-track i").style.width;
      });
    }

    if (previousHandCards._handSignature !== handSignature) {
      const nextHandCards = nextHandContent.querySelector(".hand-cards");
      const previousCardsByKey = new Map(
        [...previousHandCards.querySelectorAll(".hand-card")].map((button) => [button._cardKey, button]),
      );
      nextHandCards.querySelectorAll(".hand-card").forEach((nextButton, index) => {
        const previousButton = previousCardsByKey.get(handCardKeys[index]);
        if (!previousButton) return;
        previousButton.className = nextButton.className;
        previousButton.style.cssText = nextButton.style.cssText;
        previousButton.dataset.handIndex = String(index);
        nextButton.replaceWith(previousButton);
      });
      nextHandCards._handSignature = handSignature;
      previousHandCards.replaceWith(nextHandCards);
      activeHandElement.querySelector(".your-card-count").innerHTML = `<strong>${bottomPlayer.hand.length}</strong> card${bottomPlayer.hand.length === 1 ? "" : "s"}`;
    }
  }

  activeHandElement.querySelectorAll(".hand-card").forEach((button, index) => {
    button._cardKey = handCardKeys[index];
    button.disabled = !canPlayHand;
    button.classList.toggle("is-selected", canControlCurrentTurn && index === selectedHandIndex);
  });

  const difficultyPicker = currentCard?.type === "question" && !currentCard.isRevealed
    ? `<div class="choice-panel"><span class="challenge-kicker">Choose your stakes</span><h4>How difficult should this question be?</h4><div class="difficulty-choices">${difficultyTiers.map((tier) => `<button type="button" data-tier="${tier.name}" ${canControlCurrentTurn && !turnState.isResolving ? "" : "disabled"}><strong>${tier.name}</strong><span>${tier.calculusPoints} CP · ${tier.damage} DMG · ${tier.timeLimit}s</span></button>`).join("")}</div></div>`
    : "";
  const targetPicker = currentCard?.type === "action"
    ? `<div class="choice-panel"><span class="challenge-kicker">${currentCard.title}</span><h4>${currentCard.description}</h4><div class="target-choices${currentCard.actionId === "shield" || currentCard.actionId === "double-damage" ? " is-self-only" : ""}">${(currentCard.actionId === "shield" || currentCard.actionId === "double-damage" ? [activePlayer] : getAlivePlayers().filter((player) => player.id !== activePlayer.id)).map((player) => `<button type="button" data-target-id="${player.id}" ${canControlCurrentTurn && !turnState.isResolving ? "" : "disabled"}>${player.id === activePlayer.id ? "Use on yourself" : player.name}</button>`).join("")}</div></div>`
    : "";

  const currentCardHtml = currentCard
    ? currentCard.isRevealed ? `
      <article class="featured-card">
        <img src="${currentCard.image}" alt="Question card">
        <div class="challenge-copy">
          <span class="challenge-kicker">Table challenge</span>
          <p class="card-label action-label">${currentCard.difficulty}</p>
          <h4>${currentCard.prompt}</h4>
          <p class="method-note"><span>Suggested method</span>${currentCard.method}</p>
          ${isNpcPlayer(activePlayer) ? `<p class="solver-status">${activePlayer.name} is calculating...</p>` : answerForm}
        </div>
      </article>
    ` : difficultyPicker || targetPicker
    : `<div class="empty-card empty-card-state"><span>01</span><strong>${activePlayer?.turnsTaken === 0 ? "Draw a card" : "Choose your move"}</strong><p>${activePlayer?.turnsTaken === 0 ? "Every player's first turn begins with a draw." : "Draw to build your hand, or play a card from it."}</p></div>`;

  if (currentCardElement._renderedHtml !== currentCardHtml) {
    currentCardElement.innerHTML = currentCardHtml;
    currentCardElement._renderedHtml = currentCardHtml;
    currentCardElement.querySelector(".answer-form")?.addEventListener("submit", submitAnswer);
    currentCardElement.querySelector(".answer-form input")?.focus();
    currentCardElement.querySelectorAll("[data-tier]").forEach((button) => button.addEventListener("click", () => chooseQuestionDifficulty(button.dataset.tier)));
    currentCardElement.querySelectorAll("[data-target-id]").forEach((button) => button.addEventListener("click", () => playActionCard(Number(button.dataset.targetId))));
  }

  activeHandElement.querySelectorAll(".hand-card").forEach((button) => {
    if (button.dataset.clickBound === "true") return;
    button.dataset.clickBound = "true";
    button.addEventListener("click", () => {
      playSound("select");
      playSelectedCard(Number(button.dataset.handIndex));
    });
  });
}

function renderOpponentSlot(element, player, direction) {
  if (!player) {
    element.innerHTML = "";
    delete element.dataset.playerId;
    return;
  }

  const isActive = getActivePlayer()?.id === player.id;
  const previousMiniHand = element.querySelector(".mini-hand");
  const handSignature = getHandSignature(player);

  const opponentHtml = `
    <article class="table-player ${direction}${player.isEliminated ? " is-eliminated" : ""}${isActive ? " is-active" : ""}">
      <div class="player-badge">
        <div class="opponent-identity">
          <div class="player-title"><span>${isActive ? "Current turn" : "Player status"}</span><p>${player.name}</p></div>
        </div>
        ${renderPlayerVitals(player)}
        ${getPlayerStatus(player) === "Ready" ? "" : `<small class="status-chip">${getPlayerStatus(player)}</small>`}
      </div>
      <div class="mini-hand ${direction}" aria-label="${player.name} has ${player.hand.length} cards">
        ${renderCardBacks(player.hand)}
        <span class="hand-count"><strong>${player.hand.length}</strong><small>cards</small></span>
      </div>
    </article>
  `;

  if (element.dataset.playerId !== String(player.id) || !previousMiniHand) {
    element.innerHTML = opponentHtml;
    element.dataset.playerId = String(player.id);
    element.querySelector(".mini-hand")._handSignature = handSignature;
    return;
  }

  const nextOpponentContent = document.createElement("div");
  nextOpponentContent.innerHTML = opponentHtml;
  const currentPlayerArticle = element.querySelector(".table-player");
  const nextPlayerArticle = nextOpponentContent.querySelector(".table-player");
  currentPlayerArticle.className = nextPlayerArticle.className;
  const currentPlayerBadge = currentPlayerArticle.querySelector(".player-badge");
  const nextPlayerBadge = nextPlayerArticle.querySelector(".player-badge");
  currentPlayerBadge.querySelector(".player-title span").textContent = nextPlayerBadge.querySelector(".player-title span").textContent;
  currentPlayerBadge.querySelector(".player-title p").textContent = nextPlayerBadge.querySelector(".player-title p").textContent;
  currentPlayerBadge.querySelectorAll(".vital-row").forEach((vitalRow, index) => {
    const nextVitalRow = nextPlayerBadge.querySelectorAll(".vital-row")[index];
    vitalRow.querySelector("em").textContent = nextVitalRow.querySelector("em").textContent;
    vitalRow.querySelector(".vital-track i").style.width = nextVitalRow.querySelector(".vital-track i").style.width;
  });
  currentPlayerBadge.querySelector(".status-chip")?.remove();
  if (nextPlayerBadge.querySelector(".status-chip")) {
    currentPlayerBadge.append(nextPlayerBadge.querySelector(".status-chip"));
  }

  if (previousMiniHand._handSignature !== handSignature) {
    const nextMiniHand = nextPlayerArticle.querySelector(".mini-hand");
    nextMiniHand._handSignature = handSignature;
    previousMiniHand.replaceWith(nextMiniHand);
  }
}

function renderAll() {
  renderTurnSystem();
  renderDiceRollPanel();
  renderDifficultyTiers();
  renderRules();
  renderConcepts();
  renderDeckCounts();
  renderTable();
  broadcastRoomState();
}

function renderRollPhase() {
  renderTurnSystem();
  renderDiceRollPanel();
  broadcastRoomState();
}

startButton.addEventListener("click", () => {
  startScreen.hidden = true;
  lobbyScreen.hidden = false;
  document.body.classList.remove("is-match");
  syncBackgroundMusic();
  renderLobby();
});

howToPlayButton.addEventListener("click", () => {
  renderDifficultyTiers();
  renderRules();
  renderConcepts();
  howToPlayModal.showModal();
});


closeHowToPlayButton.addEventListener("click", () => {
  howToPlayModal.close();
});

howToPlayModal.addEventListener("click", (event) => {
  if (event.target === howToPlayModal) {
    howToPlayModal.close();
  }
});

backButton.addEventListener("click", async () => {
  if (lobbyMode === "friends" && roomChannel) {
    if (isRoomHost) {
      const successor = roomPlayers.find((presence) => presence.playerId !== localRoomPlayerId);
      if (successor) {
        await sendRoomEvent("host_transfer", { successorId: successor.playerId, state: buildRoomState() });
      }
    }
    await leaveRealtimeRoom();
  }
  gameScreen.hidden = true;
  lobbyScreen.hidden = false;
  document.body.classList.remove("is-match");
  document.body.classList.remove("is-roll-phase");
  clearNpcTimeout();
  clearTurnAdvanceTimeout();
  clearRollCountdown();
  stopTimer();
  syncBackgroundMusic();
});

lobbyBackButton.addEventListener("click", () => {
  leaveRealtimeRoom();
  const url = new URL(location.href);
  url.searchParams.delete("room");
  history.replaceState({}, "", url);
  lobbyScreen.hidden = true;
  startScreen.hidden = false;
  document.body.classList.remove("is-match");
  document.body.classList.remove("is-roll-phase");
  clearTurnAdvanceTimeout();
  syncBackgroundMusic();
});

npcModeButton.addEventListener("click", selectNpcMode);
friendsModeButton.addEventListener("click", selectFriendsMode);
copyLinkButton.addEventListener("click", () => {
  inviteLinkInput.select();
  document.execCommand("copy");
  lobbyStatusElement.textContent = "Invite link copied.";
});

startMatchButton.addEventListener("click", () => {
  if (getJoinedLobbyPlayers().length < 2) {
    return;
  }

  lobbyScreen.hidden = true;
  gameScreen.hidden = false;
  document.body.classList.add("is-match");
  syncBackgroundMusic();
  if (lobbyMode === "friends") {
    roomPlayers = getPresencePlayers();
    roomSeatPlayerIds = roomPlayers.map((presence) => presence.playerId);
  }
  resetGame(getJoinedLobbyPlayers());
  if (lobbyMode === "friends" && isRoomHost) {
    sendRoomEvent("match_start", { state: buildRoomState() });
    startRoomSyncHeartbeat();
  }
});

rollOrderButton.addEventListener("click", rollTurnOrder);
drawCardButton.addEventListener("click", drawCard);
deckStackButton.addEventListener("click", drawCard);

playAgainButton.addEventListener("click", () => {
  if (isFriendsGuest()) return;
  resetGame(players.map((player) => player.name));
  if (lobbyMode === "friends" && isRoomHost) {
    sendRoomEvent("match_start", { state: buildRoomState() });
    startRoomSyncHeartbeat();
  }
});

gameOverLobbyButton.addEventListener("click", returnToLobbyFromGameOver);

settingsButton.addEventListener("click", () => {
  renderAudioSettings();
  settingsModal.showModal();
});

menuSettingsButton.addEventListener("click", () => {
  renderAudioSettings();
  settingsModal.showModal();
});

settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) settingsModal.close();
});

muteButton.addEventListener("click", () => {
  audioSettings.muted = !audioSettings.muted;
  saveAudioSettings();
  renderAudioSettings();
  if (!audioSettings.muted) {
    syncBackgroundMusic();
    playSound("click");
  }
});

Object.entries(volumeInputs).forEach(([name, input]) => {
  input.addEventListener("input", () => {
    audioSettings[name] = Number(input.value) / 100;
    document.querySelector(`#${name}-volume-value`).textContent = `${input.value}%`;
    saveAudioSettings();
    if (name === "music" && audioSettings[name] > 0) syncBackgroundMusic();
  });
  input.addEventListener("change", () => playSound(name === "game" ? "turn" : "click"));
});

document.addEventListener("click", (event) => {
  if (event.target.closest("button") && !event.target.closest("#mute-button")) playSound("click");
});

document.addEventListener("pointerover", (event) => {
  const button = event.target.closest("button:not(:disabled)");
  if (button && !button.contains(event.relatedTarget)) playSound("hover");
});

document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = null;
    return;
  }
  if (audioContext) syncBackgroundMusic();
});

const invitedRoomCode = new URL(location.href).searchParams.get("room");

if (invitedRoomCode) {
  startScreen.hidden = true;
  lobbyScreen.hidden = false;
  connectToRoom(invitedRoomCode, false);
}

renderLobby();
renderDifficultyTiers();
renderRules();
renderConcepts();
renderAudioSettings();
