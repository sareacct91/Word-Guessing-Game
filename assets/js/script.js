const startBtn = document.querySelector("#startBtn");
const wordDisplay = document.querySelector("#wordDisplay");
const timeDisplay = document.querySelector("#timeDisplay");
const resultDisplay = document.querySelector("#resultDisplay");
const winDisplay = document.querySelector("#winDisplay");
const loseDisplay = document.querySelector("#loseDisplay");

let wordsArr, divArr = [];
let score = JSON.parse(localStorage.getItem("score")) || {win: 0, lose: 0};
let intervalId;
let isStart = false;

// Get words list from words.json file
async function fetchWordsArr() {
  const response = await fetch("./assets/words.JSON");
  wordsArr = await response.json();
  console.log(wordsArr);
}
fetchWordsArr();

// Display score on screen
function displayScore() {
  winDisplay.textContent = score.win;
  loseDisplay.textContent = score.lose;
}
displayScore();

// Return random word from the words array
function getRandomWord() {
  return wordsArr[Math.floor(Math.random() * wordsArr.length)];
}

// Display word on screen
function displayWord() {
  divArr.forEach((element, i) => {
    wordDisplay.appendChild(element);
  });
}

function finishGame(isWin = false) {
  isStart = false;
  clearInterval(intervalId);
  timeDisplay.textContent = '';

  isWin ? (resultDisplay.textContent = "You Win", score.win++) : (resultDisplay.textContent = "You Lose", score.lose++);
  localStorage.setItem("score", JSON.stringify(score));

  displayScore();
  startBtn.textContent = "Play again";
  startBtn.classList.remove("hide");
}

// Start the timer, end game if time is 0
function startTimer() {
  let totalTime = 10;

  intervalId = setInterval(function time() {
    return totalTime === 0 ? finishGame() : (timeDisplay.textContent = totalTime--, time);
  }(),1000);
}

function resetGame() {
  resultDisplay.textContent = '';
  wordDisplay.innerHTML = '';
  divArr = [];
}

// Start the gameas
function startGame() {
  isStart = true;
  resetGame();

  const word = getRandomWord();
  console.log(word);

  for (let i = 0; i < word.length; i++) {
    const divEl = document.createElement("div");

    divEl.dataset.state = "hide";
    divEl.dataset.char = word[i];
    divEl.textContent = "_";

    divArr.push(divEl);
  }
  displayWord();
  startTimer();
}

// When clicked, start the game
startBtn.addEventListener('click', () => {
  startBtn.classList.add("hide");
  startGame();
});

// Check for keypress, 
document.addEventListener('keydown', (event) => {
  if (isStart) {
    let correctArr = divArr.filter(element => event.key.toLowerCase() === element.dataset.char.toLowerCase());

    if (correctArr.length !== 0) {
      correctArr.forEach(element => element.textContent = element.dataset.char);
      displayWord();
    }

    if (divArr.filter(element => element.textContent === "_").length === 0) {
      console.log('finish');
      finishGame(true); 
    }
  }
});
