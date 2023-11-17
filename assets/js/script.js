// querySelectors
const startBtn = document.querySelector("#startBtn");
const wordDisplay = document.querySelector("#wordDisplay");
const correctWord = document.querySelector("#correctWord");
const timeDisplay = document.querySelector("#timeDisplay");
const resultDisplay = document.querySelector("#resultDisplay");
const winDisplay = document.querySelector("#winDisplay");
const loseDisplay = document.querySelector("#loseDisplay");

// Global variables
let wordsArr, divArr = [];
let score = JSON.parse(localStorage.getItem("score")) || {win: 0, lose: 0};
let intervalId;
let isStart = false;

// fetch words list from words.json file
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

// End the game, isWin = true when the function is called from the eventListener
function endGame(isWin = false) {
  // Set game state to false and stop the timer
  isStart = false;
  clearInterval(intervalId);

  // if you win, show winning text and win++, 
  if (isWin) {
    resultDisplay.textContent = "You Win";
    score.win++;
    
  // Else show losing text, correct word and lose++
  } else {
    resultDisplay.textContent = "You Lose";
    divArr.forEach(element => correctWord.textContent += element.dataset.char);
    score.lose++;
  }

  // Save the score to localStorage
  localStorage.setItem("score", JSON.stringify(score));

  // Display the new score
  displayScore();

  // Show the play button again
  startBtn.textContent = "Play again";
  startBtn.classList.remove("hide");
}

// Start the gameas
function startGame() {
  // Set game state to true
  isStart = true;

  // Return random word from the words array
  const word = wordsArr[Math.floor(Math.random() * wordsArr.length)];
  console.log(word);

  // Add div elements equal to the length of the chosen word to divArr
  for (let i = 0; i < word.length; i++) {
    const divEl = document.createElement("div");

    divEl.dataset.char = word[i];
    divEl.textContent = "_";

    divArr.push(divEl);
  }
  // display div elements on the page
  divArr.forEach(element => wordDisplay.appendChild(element));

  let totalTime = 10;
  // Start the timer, end game if time is 0
  intervalId = setInterval(function time() {
    return totalTime === 0 ? (timeDisplay.textContent = `0 second`, endGame()) : (timeDisplay.textContent = `${totalTime--} seconds`, time);
  }(),1000);
}

// When clicked, start the game
startBtn.addEventListener('click', () => {
  // Hide the start button 
  startBtn.classList.add("hide");

  // Reset the game
  resultDisplay.textContent = '';
  wordDisplay.innerHTML = '';
  correctWord.textContent = '';
  divArr = [];

  // Start the game
  startGame();
});

// Check for keypress, 
document.addEventListener('keydown', (event) => {
  if (!isStart) {return}

  // correctArr =  filter out elements from divArr that have the correct character
  let correctArr = divArr.filter(element => event.key.toLowerCase() === element.dataset.char.toLowerCase());

  // If correctArr have elements in it, set the textContent of those elements to the correct key
  if (correctArr.length !== 0) {
    correctArr.forEach(element => element.textContent = element.dataset.char);
  }

  // If there's no more element that's "hidden", end game
  if (!divArr.some(element => element.textContent === "_")) {
    console.log('finish');
    endGame(true); 
  }
});

// Reset the score in localStorage and on the page
document.querySelector("#resetBtn").addEventListener("click", () => {
  localStorage.clear();
  winDisplay.textContent = "0";
  loseDisplay.textContent = "0";
});