const startBtn = document.querySelector("#startBtn");
const wordDisplay = document.querySelector("#wordDisplay");


let wordsArr = [];
let divArr = [];


async function getWordsArr() {
  const response = await fetch("./assets/words.JSON");
  wordsArr = await response.json();
  console.log(wordsArr);
}
getWordsArr();

function randomWord() {
  return wordsArr[Math.floor(Math.random() * wordsArr.length)];
}

function displayWord() {
  divArr.forEach((element, i) => {
    wordDisplay.appendChild(element);
  });
}

function startGame() {
  const word = randomWord();
  console.log(word);

  for (let i = 0; i < word.length; i++) {
    const divEl = document.createElement("div");

    divEl.dataset.state = "hide";
    divEl.dataset.char = word[i];
    divEl.textContent = "_";

    divArr.push(divEl);
  }
  displayWord();
}

function finishGame() {

}



startBtn.addEventListener('click', () => {
  startBtn.classList.add("hide");
  startGame();
});

document.addEventListener('keydown', (event) => {
  let correctArr = divArr.filter(element => event.key.toLowerCase() === element.dataset.char.toLowerCase());

  correctArr ? ( correctArr.forEach(element => element.textContent = element.dataset.char), displayWord()) : null;

  let testArr = divArr.filter(element => element.textContent === "_");

  testArr.length === 0 ? (finishGame(), console.log('finish')) : null;



});