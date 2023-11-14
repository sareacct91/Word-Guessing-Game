when the startBtn is pressed

gameStart

  pick a random word from an array of words
    const word = randomWord() -> string

  display that word as _ _ _ _ _

  start the countdown from 10seconds
    totalTime = 10;
    setInterval(f(), 1000)

  if the user guess correctly or time runs out
    display "you win" or "you lose"

    save the user score (win or lose) in local storage
    display the score to the user

    display button to play again
      if pressed
        gameStart()


(word is "test")
display that word as _ _ _ _

when user press the correct key
  (press t) show t _ _ t