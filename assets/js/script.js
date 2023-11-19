// querySelectors
const startBtn = document.querySelector("#startBtn");
const wordDisplayEl = document.querySelector("#wordDisplay");
const timeDisplayEl = document.querySelector("#timeDisplay");
const resultDisplayEl = document.querySelector("#resultDisplay");
const winDisplayEl = document.querySelector("#winDisplay");
const loseDisplayEl = document.querySelector("#loseDisplay");

// Global variables
let wordObjArr = [];
let score = JSON.parse(localStorage.getItem("score")) || {win: 0, lose: 0};
let intervalId, wordObj, totalTime;
let isStart = false;
let difficulty = document.querySelector("#selectDif").value || "easy";


function init() {
  fetchWordsArr(difficulty, true);
  displayScore();
  getTime();
}

// fetch words list from words.json file
async function fetchWordsArr(str, isFirst = false) {
  const response = await fetch(`./assets/data/${str}.json`);
  wordObjArr = await response.json();
  // wordsArr = wordsArr.concat(wordsArr);
  console.log(wordObjArr);

  // Start the game if not the first call
  isFirst ? null : startGame();
}

// Display score on screen
function displayScore() {
  winDisplayEl.textContent = score.win;
  loseDisplayEl.textContent = score.lose;
}

// get time from user selection
function getTime() {
  totalTime = document.querySelector("#selectTime").value;
  timeDisplayEl.textContent = `${totalTime} seconds`;
}

// End the game, isWin = true when the function is called from the eventListener
function endGame(isWin = false) {
  // Set game state to false and stop the timer
  isStart = false;
  clearInterval(intervalId);

  // if you win, show winning text and win++, 
  if (isWin) {
    resultDisplayEl.textContent = "You Win";
    score.win++;
    
  // Else show losing text, correct word and lose++
  } else {
    resultDisplayEl.innerHTML = "GameOver. The correct word is: ";
    score.lose++;
  }
  // Display link to the documentation for the word
  resultDisplayEl.innerHTML += `<br><a href="${wordObj.link}" target="_Blank">${wordObj.word.join('')}`;

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
  resultDisplayEl.innerHTML = '';
  wordDisplayEl.innerHTML = '';
  document.querySelector("#playAgain").textContent = "";

  // Return random word from the words array
  wordObj = wordObjArr[Math.floor(Math.random() * wordObjArr.length)];
  console.log(wordObj.word);
  wordObj.word = wordObj.word.split('');

  // Add div elements equal to the length of the chosen word to divArr
  wordObj.show = [];
  wordObj.word.forEach((elm) => elm === "_" ? wordObj.show.push(" ") : wordObj.show.push("_"));

  // display div elements on the page
  wordDisplayEl.textContent = wordObj.show.join('');
  
  // Start the timer, end game if time is 0
  getTime();
  intervalId = setInterval(function time() {
    return totalTime === 0 ? (timeDisplayEl.textContent = `0 second`, endGame()) : (timeDisplayEl.textContent = `${totalTime--} seconds`, time);
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
    wordObj.word.forEach((elm, i) => event.key.toLowerCase() === elm.toLowerCase() ? wordObj.show[i] = elm : null);

    // display div elements on the page
    wordDisplayEl.textContent = wordObj.show.join('');

    // If there's no more element that's "hidden", end game
    if (!wordObj.show.includes("_")) {
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
  winDisplayEl.textContent = "0";
  loseDisplayEl.textContent = "0";
});

// User select total time
document.querySelector("#selectTime").addEventListener("change", getTime);

init();