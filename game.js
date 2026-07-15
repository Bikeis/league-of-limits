"use strict";

const SUPABASE_URL = "https://wnbxdoesaaafesvpkbvv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DbsYeFZT8kQdY4euO5PSTw_c8566AiQ";
const realtimeClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) || null;

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
const tableLayoutElement = document.querySelector("#table-layout");
const topOpponentElement = document.querySelector("#top-opponent");
const leftOpponentElement = document.querySelector("#left-opponent");
const rightOpponentElement = document.querySelector("#right-opponent");
const activeHandElement = document.querySelector("#active-hand");
const currentCardElement = document.querySelector("#current-card");
const deckCountElement = document.querySelector("#deck-count");
const discardCountElement = document.querySelector("#discard-count");
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
    description: "Blocks the next damage received.",
    image: imagePaths.shield,
  },
  {
    id: "double-damage",
    title: "Double Damage",
    concept: "One-sided Limits",
    description: "The next correct attack deals double damage.",
    image: imagePaths.doubleDamage,
  },
  {
    id: "freeze",
    title: "Freeze",
    concept: "Discontinuous Functions and Infinite Limits",
    description: "The next opponent misses one turn.",
    image: imagePaths.freeze,
  },
  {
    id: "steal",
    title: "Steal",
    concept: "Indeterminate Forms",
    description: "Take 1 CP from the opponent if possible.",
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
    title: "Draw a card",
    description: "Press Draw Card to reveal a limit or continuity question.",
  },
  {
    title: "Solve before time runs out",
    description: "Enter your answer using the answer box on the table.",
  },
  {
    title: "Collect your reward",
    description: "A correct answer gives you CP, damages an opponent, and activates the card's effect.",
  },
  {
    title: "Pass the turn",
    description: "A wrong answer costs the card's HP penalty. A timeout costs 1 HP. The card returns to the deck.",
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
let toastTimer = null;
let lobbyMode = null;
let lobbyPlayers = ["Player 1", null, null, null];
let npcTimeout = null;
let rollCountdownTimer = null;
let rollCountdown = 15;
let roomChannel = null;
let roomCode = null;
let isRoomHost = false;
let roomPlayers = [];
const localRoomPlayerId = sessionStorage.getItem("league-player-id") || crypto.randomUUID();
sessionStorage.setItem("league-player-id", localRoomPlayerId);

const turnState = {
  orderedPlayerIds: [],
  orderIndex: 0,
  turnNumber: 1,
  isStarted: false,
  rollingPlayerIndex: 0,
  isRolling: false,
};

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
  const aliveOpponents = getAlivePlayers().filter((player) => player.id !== activePlayer.id);
  return aliveOpponents[0] || null;
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
  const healthPercent = Math.max(0, Math.min(100, (player.health / 8) * 100));
  const cpPercent = Math.max(0, Math.min(100, (player.calculusPoints / 15) * 100));

  return `
    <div class="vitals" aria-label="${player.health} health and ${player.calculusPoints} calculus points">
      <div class="vital-row health-vital">
        <span><b>HP</b><em>${player.health}/8</em></span>
        <div class="vital-track"><i style="width: ${healthPercent}%"></i></div>
      </div>
      <div class="vital-row cp-vital">
        <span><b>CP</b><em>${player.calculusPoints}/15</em></span>
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
    toastElement.className = "toast";
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
  const cards = [];
  let questionIndex = 0;

  actionTypes.forEach((action) => {
    difficultyTiers.forEach((tier) => {
      for (let copy = 1; copy <= 2; copy += 1) {
        const questionsInTier = questionBank.filter((question) => question.tier === tier.name);
        const question = questionsInTier[questionIndex % questionsInTier.length];
        questionIndex += 1;

        cards.push({
          id: `${action.id}-${tier.name.toLowerCase()}-${copy}`,
          type: "action-question",
          actionId: action.id,
          actionTitle: action.title,
          concept: action.concept,
          description: action.description,
          image: action.image,
          difficulty: tier.name,
          prompt: question.prompt,
          answer: question.answer,
          method: question.method,
        });
      }
    });
  });

  return shuffle(cards);
}

function createPlayers(names) {
  return names.map((name, index) => ({
    id: index + 1,
    name,
    health: 8,
    calculusPoints: 0,
    hand: [],
    dice: null,
    diceValues: [],
    shield: false,
    doubleDamage: false,
    frozen: false,
    isEliminated: false,
  }));
}

function getJoinedLobbyPlayers() {
  return lobbyPlayers.filter(Boolean);
}

function resetGame(playerNames = getJoinedLobbyPlayers()) {
  clearNpcTimeout();
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
  scheduleNpcTurn();
}

function rollTurnOrder() {
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
  const firstDie = rollDie();
  const secondDie = rollDie();
  rollingPlayer.diceValues = [firstDie, secondDie];
  rollingPlayer.dice = firstDie + secondDie;
  setFeedback(`${rollingPlayer.name} rolled ${rollingPlayer.dice}.`, "Lowest roll goes first.");
  renderAll();

  window.setTimeout(() => {
    turnState.rollingPlayerIndex += 1;
    turnState.isRolling = false;

    if (turnState.rollingPlayerIndex >= players.length) {
      finishRollOrder();
      return;
    }

    const nextRoller = getRollingPlayer();
    setFeedback("Roll the dice", `${nextRoller.name} rolls next. Lowest roll goes first.`);
    renderAll();

    if (lobbyMode === "npc" && isNpcPlayer(nextRoller)) {
      npcTimeout = window.setTimeout(rollTurnOrder, 2200);
    } else {
      startRollCountdown();
    }
  }, 2200);
}

function drawCard() {
  if (!turnState.isStarted || currentCard) {
    return;
  }

  const activePlayer = getActivePlayer();

  if (!activePlayer || activePlayer.isEliminated) {
    nextTurn();
    return;
  }

  if (activePlayer.frozen) {
    activePlayer.frozen = false;
    feedbackElement.textContent = `${activePlayer.name} is frozen and skips this turn.`;
    nextTurn();
    return;
  }

  if (deck.length === 0) {
    deck = shuffle(discardPile);
    discardPile = [];
  }

  const card = deck.pop();
  activePlayer.hand.push(card);
  selectedHandIndex = activePlayer.hand.length - 1;
  currentCard = card;
  document.body.classList.add("card-drawn");
  window.setTimeout(() => document.body.classList.remove("card-drawn"), 500);
  startTimer(getTierByName(card.difficulty).timeLimit);
  feedbackElement.textContent = `${activePlayer.name} drew ${card.actionTitle} ${card.difficulty}.`;
  showToast(`${card.difficulty} problem: ${getTierByName(card.difficulty).calculusPoints} CP / ${getTierByName(card.difficulty).damage} DMG`, "info");
  renderAll();
}

function playSelectedCard(index) {
  const activePlayer = getActivePlayer();

  if (!activePlayer || !activePlayer.hand[index]) {
    return;
  }

  selectedHandIndex = index;
  currentCard = activePlayer.hand[index];
  startTimer(getTierByName(currentCard.difficulty).timeLimit);
  feedbackElement.textContent = `${activePlayer.name} is solving: ${currentCard.prompt}`;
  renderAll();
}

function returnCardToDeck(card) {
  deck = shuffle([card, ...deck]);
}

function discardUsedCard(card) {
  discardPile.push(card);
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

function applyActionEffect(player, target, card) {
  if (!target) {
    return;
  }

  if (card.actionId === "shield") {
    player.shield = true;
  }

  if (card.actionId === "double-damage") {
    player.doubleDamage = true;
  }

  if (card.actionId === "freeze") {
    target.frozen = true;
  }

  if (card.actionId === "steal" && target.calculusPoints > 0) {
    target.calculusPoints -= 1;
    player.calculusPoints += 1;
  }
}

function damagePlayer(target, amount) {
  if (!target) {
    return 0;
  }

  if (target.shield) {
    target.shield = false;
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
  if (!currentCard) {
    return;
  }

  stopTimer();
  const activePlayer = getActivePlayer();
  const target = getTargetPlayer();
  const card = removeCurrentCardFromHand();
  const tier = getTierByName(card.difficulty);
  const damage = activePlayer.doubleDamage ? tier.damage * 2 : tier.damage;
  activePlayer.doubleDamage = false;
  activePlayer.calculusPoints += tier.calculusPoints;
  const damageDealt = damagePlayer(target, damage);
  applyActionEffect(activePlayer, target, card);
  discardUsedCard(card);
  feedbackElement.textContent = `${feedbackMessages.correct} ${feedbackMessages.gained} ${feedbackMessages.damage} (+${tier.calculusPoints} CP, ${damageDealt} damage)`;
  showToast(`${feedbackMessages.correct} +${tier.calculusPoints} CP, ${damageDealt} damage dealt.`, "good");
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

  if (!currentCard) {
    return;
  }

  const formData = new FormData(event.currentTarget);
  const submittedAnswer = normalizeAnswer(String(formData.get("answer") || ""));
  const correctAnswer = normalizeAnswer(currentCard.answer);

  if (submittedAnswer === correctAnswer) {
    answerCorrect();
    return;
  }

  answerWrong();
}

function answerWrong() {
  if (!currentCard) {
    return;
  }

  stopTimer();
  const activePlayer = getActivePlayer();
  const card = removeCurrentCardFromHand();
  const tier = getTierByName(card.difficulty);
  activePlayer.health = Math.max(0, activePlayer.health - tier.wrongPenalty);
  returnCardToDeck(card);
  feedbackElement.textContent = `${feedbackMessages.wrong} ${activePlayer.name} lost ${tier.wrongPenalty} HP.`;
  showToast(`${feedbackMessages.wrong} -${tier.wrongPenalty} HP.`, "bad");
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function timerOut() {
  if (!currentCard) {
    return;
  }

  stopTimer();
  const activePlayer = getActivePlayer();
  const card = removeCurrentCardFromHand();
  activePlayer.health = Math.max(0, activePlayer.health - 1);
  returnCardToDeck(card);
  feedbackElement.textContent = `Time is up. ${activePlayer.name} lost 1 HP.`;
  showToast("Timer ran out. -1 HP.", "bad");
  checkWinConditions();
  renderAll();
  scheduleAutoAdvance();
}

function useInfinityFeedback() {
  feedbackElement.textContent = feedbackMessages.infinity;
  showToast(feedbackMessages.infinity, "info");
}

function checkWinConditions() {
  players.forEach((player) => {
    if (player.health <= 0 && !player.isEliminated) {
      player.isEliminated = true;
      placements.unshift(player.name);
    }
  });

  const cpWinner = players.find((player) => !player.isEliminated && player.calculusPoints >= 15);
  const alivePlayers = getAlivePlayers();

  if (cpWinner) {
    feedbackElement.textContent = `${cpWinner.name} reached 15 CP and wins a placement.`;
    showToast(`${cpWinner.name} reached 15 CP.`, "good");
  }

  if (alivePlayers.length === 1) {
    feedbackElement.textContent = `${alivePlayers[0].name} wins as the last player remaining.`;
    showToast(`${alivePlayers[0].name} wins the match.`, "good");
  }
}

function nextTurn() {
  if (!turnState.isStarted) {
    return;
  }

  clearNpcTimeout();
  stopTimer();
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
  feedbackElement.textContent = `${getActivePlayer().name}'s turn. Draw a card.`;
  renderAll();
  scheduleNpcTurn();
}

function startTimer(seconds) {
  stopTimer();
  let remaining = seconds;
  timerDisplayElement.textContent = `${remaining}s`;
  timerDisplayElement.classList.remove("is-urgent");

  timer = window.setInterval(() => {
    remaining -= 1;
    timerDisplayElement.textContent = `${remaining}s`;
    timerDisplayElement.classList.toggle("is-urgent", remaining <= 5);

    if (remaining <= 0) {
      timerOut();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }

  timerDisplayElement.textContent = "--";
  timerDisplayElement.classList.remove("is-urgent");
}

function clearNpcTimeout() {
  if (npcTimeout) {
    window.clearTimeout(npcTimeout);
    npcTimeout = null;
  }
}

function isNpcPlayer(player) {
  return Boolean(player && player.name.startsWith("NPC"));
}

function scheduleNpcTurn() {
  clearNpcTimeout();
  const activePlayer = getActivePlayer();

  if (lobbyMode !== "npc" || !turnState.isStarted || !isNpcPlayer(activePlayer) || currentCard) {
    return;
  }

  npcTimeout = window.setTimeout(() => {
    feedbackElement.textContent = `${activePlayer.name} is thinking...`;
    showToast(`${activePlayer.name} is thinking...`, "info");
    drawCard();

    npcTimeout = window.setTimeout(() => {
      const currentActivePlayer = getActivePlayer();

      if (!currentActivePlayer || currentActivePlayer.id !== activePlayer.id || !isNpcPlayer(currentActivePlayer) || !currentCard) {
        return;
      }

      feedbackElement.textContent = `${currentActivePlayer.name} is solving the problem...`;
      const accuracy = npcAccuracyByTier[currentCard.difficulty] ?? 0.6;
      const shouldAnswerCorrectly = Math.random() < accuracy;

      if (shouldAnswerCorrectly) {
        answerCorrect();
      } else {
        answerWrong();
      }
    }, 3000);
  }, 1800);
}

function scheduleAutoAdvance() {
  clearNpcTimeout();
  const activePlayer = getActivePlayer();

  if (!turnState.isStarted || !activePlayer || currentCard || getAlivePlayers().length <= 1) {
    return;
  }

  npcTimeout = window.setTimeout(nextTurn, 1800);
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
  drawCardButton.disabled = !turnState.isStarted || Boolean(currentCard) || isNpcTurn;
  deckStackButton.disabled = drawCardButton.disabled;
  deckStackButton.classList.toggle("is-ready", !deckStackButton.disabled);
  rollOrderButton.hidden = turnState.isStarted || turnState.isRolling || (lobbyMode === "npc" && isNpcPlayer(rollingPlayer));
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
}

function renderDie(value) {
  const dots = Array.from({ length: value }, (_, index) => `<span class="pip pip-${index + 1}"></span>`).join("");
  return `<span class="die face-${value}" aria-label="${value}">${dots}</span>`;
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
      <div class="dice-center">
        <div class="dice-title">${visiblePlayer.name}</div>
        <div class="dice-row">
          ${(visiblePlayer.diceValues.length === 2 ? visiblePlayer.diceValues : [1, 1]).map(renderDie).join("")}
        </div>
        <strong>${visiblePlayer.dice ? `${visiblePlayer.name} rolled ${visiblePlayer.dice}` : "Ready to roll"}</strong>
      </div>
      <div class="roll-results">
        ${rolledPlayers.map((player) => `<p>${player.name}: <strong>${player.dice}</strong></p>`).join("")}
      </div>
    `
    : "";
}

function renderLobby() {
  lobbySlotsElement.innerHTML = lobbyPlayers
    .map((playerName, index) => `
      <article class="lobby-slot${playerName ? " is-filled" : ""}">
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
  if (roomChannel && realtimeClient) {
    await realtimeClient.removeChannel(roomChannel);
  }

  roomChannel = null;
  roomCode = null;
  roomPlayers = [];
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
    },
  });

  roomChannel
    .on("presence", { event: "sync" }, () => {
      roomPlayers = getPresencePlayers();
      lobbyPlayers = Array.from({ length: 4 }, (_, index) => roomPlayers[index] ? `Player ${index + 1}` : null);
      renderLobby();
    })
    .on("presence", { event: "leave" }, () => {
      roomPlayers = getPresencePlayers();
      lobbyPlayers = Array.from({ length: 4 }, (_, index) => roomPlayers[index] ? `Player ${index + 1}` : null);
      renderLobby();
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await roomChannel.track({
          playerId: localRoomPlayerId,
          isHost: isRoomHost,
          joinedAt: Date.now(),
        });
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

function renderCardBacks(count, imagePath) {
  const visibleCount = Math.min(count, 5);

  return Array.from({ length: visibleCount }, (_, index) => `
    <img style="--card-index: ${index}" src="${imagePath}" alt="Card back">
  `).join("");
}

function renderTable() {
  const activePlayer = getActivePlayer();
  const bottomPlayer = lobbyMode === "npc"
    ? players.find((player) => player.id === 1)
    : activePlayer;
  const opponents = players.filter((player) => !bottomPlayer || player.id !== bottomPlayer.id);
  tableLayoutElement.dataset.players = String(players.length);

  renderOpponentSlot(topOpponentElement, opponents[0], "horizontal");
  renderOpponentSlot(leftOpponentElement, opponents[1], "vertical");
  renderOpponentSlot(rightOpponentElement, opponents[2], "vertical");

  const handCards = bottomPlayer
    ? bottomPlayer.hand
      .map((card, index) => `
        <button class="hand-card${activePlayer && bottomPlayer.id === activePlayer.id && index === selectedHandIndex ? " is-selected" : ""}" type="button" data-hand-index="${index}" ${activePlayer && bottomPlayer.id === activePlayer.id ? "" : "disabled"}>
          <img src="${card.image}" alt="${card.actionTitle} card">
          <span>${card.actionTitle} ${card.difficulty}</span>
        </button>
      `)
      .join("")
    : "";
  const canAnswerCurrentCard = Boolean(currentCard && activePlayer && bottomPlayer && activePlayer.id === bottomPlayer.id && !isNpcPlayer(activePlayer));
  const answerForm = canAnswerCurrentCard
    ? `
      <form class="answer-form">
        <label for="answer-input">Your answer</label>
        <input id="answer-input" name="answer" type="text" autocomplete="off" placeholder="Type the answer..." required>
        <button type="submit">Submit answer</button>
      </form>
    `
    : "";

  activeHandElement.innerHTML = activePlayer
    ? `
      <article class="active-seat${bottomPlayer.isEliminated ? " is-eliminated" : ""}${activePlayer.id === bottomPlayer.id ? " is-active" : ""}">
        <header class="active-player-header">
          <div class="player-avatar" aria-hidden="true">${getPlayerInitials(bottomPlayer.name)}</div>
          <div class="active-player-identity">
            <span>You are playing as</span>
            <p>${bottomPlayer.name}</p>
          </div>
          <span class="turn-pill">${activePlayer.id === bottomPlayer.id ? "Your turn" : "Waiting"}</span>
        </header>
        ${renderPlayerVitals(bottomPlayer)}
      </article>
      <div class="hand-cards">
        ${handCards || `<p class="empty-card">Draw a card to start your turn.</p>`}
      </div>
    `
    : "";

  currentCardElement.innerHTML = currentCard
    ? `
      <article class="featured-card">
        <img src="${currentCard.image}" alt="${currentCard.actionTitle} card">
        <div>
          <p class="card-label action-label">${currentCard.actionTitle} ${currentCard.difficulty}</p>
          <h4>${currentCard.prompt}</h4>
          <p>Method: ${currentCard.method}</p>
          ${isNpcPlayer(activePlayer) ? `<p class="solver-status">${activePlayer.name} is calculating...</p>` : answerForm}
        </div>
      </article>
    `
    : `<div class="empty-card empty-card-state"><span>01</span><strong>Draw a card</strong><p>Reveal a calculus problem and earn your advantage.</p></div>`;

  currentCardElement.querySelector(".answer-form")?.addEventListener("submit", submitAnswer);
  currentCardElement.querySelector(".answer-form input")?.focus();

  activeHandElement.querySelectorAll(".hand-card").forEach((button) => {
    button.addEventListener("click", () => {
      playSelectedCard(Number(button.dataset.handIndex));
    });
  });
}

function renderOpponentSlot(element, player, direction) {
  if (!player) {
    element.innerHTML = "";
    return;
  }

  const isActive = getActivePlayer()?.id === player.id;

  element.innerHTML = `
    <article class="table-player ${direction}${player.isEliminated ? " is-eliminated" : ""}${isActive ? " is-active" : ""}">
      <div class="player-badge">
        <div class="player-title"><p>${player.name}</p></div>
        ${renderPlayerVitals(player)}
        <small>${getPlayerStatus(player)}</small>
      </div>
      <div class="mini-hand ${direction}" aria-label="${player.name} hand">
        ${renderCardBacks(Math.max(player.hand.length, 7), imagePaths.actionBack)}
      </div>
    </article>
  `;
}

function renderAll() {
  renderTurnSystem();
  renderDiceRollPanel();
  renderDifficultyTiers();
  renderRules();
  renderConcepts();
  renderDeckCounts();
  renderTable();
}

startButton.addEventListener("click", () => {
  startScreen.hidden = true;
  lobbyScreen.hidden = false;
  document.body.classList.remove("is-match");
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

backButton.addEventListener("click", () => {
  gameScreen.hidden = true;
  lobbyScreen.hidden = false;
  document.body.classList.remove("is-match");
  document.body.classList.remove("is-roll-phase");
  clearNpcTimeout();
  clearRollCountdown();
  stopTimer();
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
  resetGame(getJoinedLobbyPlayers());
});

rollOrderButton.addEventListener("click", rollTurnOrder);
drawCardButton.addEventListener("click", drawCard);
deckStackButton.addEventListener("click", drawCard);

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
