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
  const response = await fetch("./assets/data/words.JSON");
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

// When end condition is met
function endGame(isWin = false) {
  isStart = false;
  clearInterval(intervalId);
  timeDisplay.textContent = '';

  isWin ? (resultDisplay.textContent = "You Win", score.win++) : (resultDisplay.textContent = "You Lose", score.lose++);
  localStorage.setItem("score", JSON.stringify(score));

  displayScore();
  startBtn.textContent = "Play again";
  startBtn.classList.remove("hide");
}

// Start the gameas
function startGame() {
  isStart = true;

  // Return random word from the words array
  const word = wordsArr[Math.floor(Math.random() * wordsArr.length)];
  console.log(word);

  for (let i = 0; i < word.length; i++) {
    const divEl = document.createElement("div");

    divEl.dataset.state = "hide";
    divEl.dataset.char = word[i];
    divEl.textContent = "_";

    divArr.push(divEl);
  }
  // display word on screen
  divArr.forEach(element => wordDisplay.appendChild(element));

  // Start the timer, end game if time is 0
  let totalTime = 10;

  intervalId = setInterval(function time() {
    return totalTime === 0 ? endGame() : (timeDisplay.textContent = totalTime--, time);
  }(),1000);
}

// When clicked, start the game
startBtn.addEventListener('click', () => {
  startBtn.classList.add("hide");

  // Reset the game
  resultDisplay.textContent = '';
  wordDisplay.innerHTML = '';
  divArr = [];

  // Start the game
  startGame();
});

// Check for keypress, 
document.addEventListener('keydown', (event) => {
  if (isStart) {
    let correctArr = divArr.filter(element => event.key.toLowerCase() === element.dataset.char.toLowerCase());

    if (correctArr.length !== 0) {
      correctArr.forEach(element => element.textContent = element.dataset.char);
    }

    if (!divArr.some(element => element.textContent === "_")) {
      console.log('finish');
      endGame(true); 
    }
  }
});
