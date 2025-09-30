const board = document.getElementById('gameBoard');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let emojis = ['😀', '😁', '😂', '😎', '😢', '😡', '😱', '😴'];
let cardArray = [];
let flippedCards = [];
let score = 0;
let timeLeft = 60;
let timer = null;
let timerStarted = false;

startBtn.addEventListener('click', startGame);

function startGame() {
  board.innerHTML = '';
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  cardArray = [...emojis, ...emojis];
  shuffle(cardArray);

  cardArray.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  document.body.classList.add('game-started');
  document.body.classList.remove('won');

  clearInterval(timer);
  timeLeft = 60;
  timerDisplay.textContent = `Time: 1:00`;
  timerDisplay.classList.remove('blink');
  timerStarted = false;
}

function flipCard() {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }

  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    this.textContent = this.dataset.emoji;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '';
    card2.textContent = '';
  }

  flippedCards = [];

  if (score === emojis.length) {
    clearInterval(timer);
    document.body.classList.add('won');
    setTimeout(() => alert('🎉 You won!'), 300);
  }
}

// Timer functions
function startTimer() {
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert('⏰ Time up! Game over!');
      board.innerHTML = '';
    }
  }, 1000);
}

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  timerDisplay.textContent = `Time: ${minutes}:${formattedSeconds}`;

  // Blink timer in last 10 seconds
  if (timeLeft <= 10) {
    timerDisplay.classList.add('blink');
  } else {
    timerDisplay.classList.remove('blink');
  }
}

// Shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
