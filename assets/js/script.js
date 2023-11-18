// querySelectors
const startBtn = document.querySelector("#startBtn");
const wordDisplay = document.querySelector("#wordDisplay");
const timeDisplay = document.querySelector("#timeDisplay");
const resultDisplay = document.querySelector("#resultDisplay");
const winDisplay = document.querySelector("#winDisplay");
const loseDisplay = document.querySelector("#loseDisplay");

// Global variables
let wordObjArr, divArr = [];
let score = JSON.parse(localStorage.getItem("score")) || {win: 0, lose: 0};
let intervalId, wordObj, totalTime;
let isStart = false;
let difficulty = "easy"


function init() {
  fetchWordsArr(difficulty, true);
  displayScore();
  getTime();
}

// fetch words list from words.json file
async function fetchWordsArr(urlPar, isFirst = false) {
  const response = await fetch(`./assets/data/${urlPar}.json`);
  wordObjArr = await response.json();
  // wordsArr = wordsArr.concat(wordsArr);
  console.log(wordObjArr);

  // Start the game if not the first call
  isFirst ? null : startGame();
}

// Display score on screen
function displayScore() {
  winDisplay.textContent = score.win;
  loseDisplay.textContent = score.lose;
}

// get time from user selection
function getTime() {
  totalTime = document.querySelector("#selectTime").value;
  timeDisplay.textContent = `${totalTime} seconds`;
}

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
    resultDisplay.innerHTML = "GameOver. The correct word is: ";
    score.lose++;
  }
  // Display link to the documentation for the word
  resultDisplay.innerHTML += `<br><a href="${wordObj.link}" target="_Blank">${wordObj.word}`;

  // Save the score to localStorage
  localStorage.setItem("score", JSON.stringify(score));

  // Display the new score
  displayScore();

  // Play again
  document.querySelector("#playAgain").textContent = "Press Enter to play again!";
}

// Start the gameas
function startGame() {
  // Set game state to true
  isStart = true;

  // Reset the game
  resultDisplay.innerHTML = '';
  wordDisplay.innerHTML = '';
  divArr = [];

  // Return random word from the words array
  wordObj = wordObjArr[Math.floor(Math.random() * wordObjArr.length)];
  const { word } = wordObj;
  console.log(word);

  // Add div elements equal to the length of the chosen word to divArr
  for (let i = 0; i < word.length; i++) {
    const divEl = document.createElement("div");

    divEl.dataset.char = word[i];
    word[i] === " " ? divEl.style.paddingRight = "15px" : divEl.textContent = "_";

    divArr.push(divEl);
  }
  // display div elements on the page
  divArr.forEach(element => wordDisplay.appendChild(element));

  // Start the timer, end game if time is 0
  getTime();
  intervalId = setInterval(function time() {
    return totalTime === 0 ? (timeDisplay.textContent = `0 second`, endGame()) : (timeDisplay.textContent = `${totalTime--} seconds`, time);
  }(),1000);
}

// When clicked, start the game
startBtn.addEventListener('click', () => {
  // Hide the start button 
  startBtn.classList.add("hide");

  // Start the game
  const userPick = document.querySelector("#selectDif").value
  
  // Fetch new words if user select different difficulty, else start the game 
  if (difficulty !== userPick) {
    difficulty = userPick;
    fetchWordsArr(difficulty);
  } else {
    startGame();
  }

});

// Check for keypress, 
document.addEventListener('keydown', (event) => {
  // If the game is running
  if (isStart) {
    // Check if the key.event is equal to the character in the div array
    // yes then set to the charcter
    divArr.forEach(element => event.key.toLowerCase() === element.dataset.char.toLowerCase() ? element.textContent = element.dataset.char : null);

    // If there's no more element that's "hidden", end game
    if (!divArr.some(element => element.textContent === "_")) {
      endGame(true); 
    }

  // If the game is over, press Enter to play again
  } else if (event.key === "Enter" && !isStart) {
    // Start the game
    startGame();
  }  
});

// Reset the score in localStorage and on the page
document.querySelector("#resetBtn").addEventListener("click", () => {
  localStorage.clear();
  winDisplay.textContent = "0";
  loseDisplay.textContent = "0";
});

// User select total time
document.querySelector("#selectTime").addEventListener("change", getTime);


init();