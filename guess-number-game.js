'use strict';

/**
 * The Guess Number Bot which is capable of guessing a number.
 */
class GuessNumber {
  /**
   * Constructor that initializes
   *    - Pool of numbers that are candidates.
   *    - Round number which records number of guesses.
   *    - Previous guessed number used for elimination for next round.
   * @param {Number} n Number of digits of the number to be guessed.
   */
  constructor(n) {
    this.numbers = this.generateAllNumbers(n);
    this.round = 0;
    this.previousGuess = null;
  }

  /**
   * Generate all possible numbers.
   * @param {Number} n Number of digits of the number to be guessed.
   * @returns {Array} All possible numbers.
   */
  generateAllNumbers = (n) => {
    // initialize
    let numbers = [];

    for (let i = 0; i < Math.pow(10, n); i++) {
      let candidate = i.toString();
      while (candidate.length !== n) {
        candidate = '0' + candidate;
      }

      // remove numbers with duplicate digits
      const numberSet = new Set(candidate);
      if (numberSet.size === n) {
        numbers = [...numbers, candidate];
      }
    }

    return numbers;
  };

  /**
   * Guess the number by randomly selecting from the numbers array.
   * @returns {String} The guessed number.
   */
  guess = () => {
    this.previousGuess = this.getRandomElement(this.numbers);
    this.round++;
    return this.previousGuess;
  };

  /**
   * Get a random element (represented in String) from the input array.
   * @param {Array<T>} array The input array.
   * @returns {T} The selected element.
   */
  getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  /**
   * Eliminate numbers from `this.numbers` that do not share the same feature (hint) as the previously guessed number.
   * @param {String} hint Hint that is represented by 'XAXB'.
   */
  eliminate = (hint) => {
    this.numbers = this.numbers.filter((number) => {
      return this.checkSimilarity(this.previousGuess, number, hint);
    });
  };

  /**
   * Check whether `guess` and `answer` results in the same feature as `hint`.
   * @param {String} guess The guessed number.
   * @param {String} answer The answer to be compared.
   * @param {String} hint THe hint represented by 'XAXB'.
   * @returns {Boolean} Whether `guess` and `answer` are similar.
   */
  checkSimilarity = (guess, answer, hint) => {
    return hint === this.getHint(guess, answer);
  };

  /**
   * Get the hint by passing a guessed number and the answer.
   * @param {String} guess The guessed number.
   * @param {String} answer The answer to be compared.
   * @returns {String} The hint represented by 'XAXB'.
   */
  getHint = (guess, answer) => {
    // initialize
    let countA = 0,
      countB = 0;
    let ASet = new Set();
    const answerSet = new Set(answer);

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        countA++;
        ASet.add(guess[i]);
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (!ASet.has(guess[i]) && answerSet.has(guess[i])) {
        countB++;
      }
    }

    return countA.toString() + 'A' + countB.toString() + 'B';
  };
}

/**
 * The hint machine holds an answer and generate hints by feeding a guess.
 */
class HintMachine {
  /**
   * Constructor the initializes the answer.
   * @param {String} answer The answer.
   */
  constructor(answer) {
    this.answer = answer;
    this.round = 0;
  }

  /**
   * Get the hint by passing a guessed number.
   * @param {String} guess The guessed number.
   * @returns {String} The hint represented by 'XAXB'.
   */
  getHint = (guess) => {
    // initialize
    let countA = 0;
    let countB = 0;
    let ASet = new Set();
    const answerSet = new Set(this.answer);

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === this.answer[i]) {
        countA++;
        ASet.add(guess[i]);
      }
    }

    for (let i = 0; i < guess.length; i++) {
      if (!ASet.has(guess[i]) && answerSet.has(guess[i])) {
        countB++;
      }
    }

    // update
    this.round++;

    return countA.toString() + 'A' + countB.toString() + 'B';
  };
}

const mode1 = () => {
  let gn;
  let playButton = document.getElementById('playButton');
  let hintInputA = document.getElementById('hintInputA'); 
  let hintInputB = document.getElementById('hintInputB'); 
  let submitButton = document.getElementById('submitButton');
  let warningMessage = document.getElementById('warningMessage');
  let guessDisplay = document.getElementById('guessDisplay');
  let numberOfGuesses = document.getElementById('numberOfGuesses');
  let winningMessage = document.getElementById('winningMessage');

  const initMode1 = () => {
    submitButton.disabled = true;
    playButton.innerHTML = 'Play';
  }

  playButton.addEventListener('click', () => {
    gn = new GuessNumber(4);
    guessDisplay.innerHTML = gn.guess();
    numberOfGuesses.innerHTML = 'Attempt ' + gn.round.toString() + ': ';
    submitButton.disabled = false;
    playButton.innerHTML = 'Replay';
    winningMessage.innerHTML = '';
    warningMessage.innerHTML = '';
    hintInputA.value = '';
    hintInputB.value = '';
  });

  submitButton.addEventListener('click', () => {
    if (gn.numbers.length === 1) {
      winningMessage.innerHTML = 'Bot used ' + gn.round.toString() + ' attempt(s) to guess the number';
      initMode1();
      return;
    }
    const hintInputAVal = hintInputA.value ? hintInputA.value : '0';
    const hintInputBVal = hintInputB.value ? hintInputB.value : '0';
    if (!/[0-9]/.test(hintInputAVal) || !/[0-9]/.test(hintInputBVal)) {
      warningMessage.innerHTML = 'Only 0 to 9 is allowed. Should not be empty.';
      return;
    } else {
      warningMessage.innerHTML = '';
    }

    const hint = hintInputAVal + 'A' + hintInputBVal + 'B';
    if (hint === '4A0B') {
      winningMessage.innerHTML = 'Bot used ' + gn.round.toString() + ' attempt(s) to guess the number';
      gn.eliminate(hint);
      initMode1();
    } else {
      gn.eliminate(hint);
      const guessedNumber = gn.guess();
      if (!guessedNumber) {
        numberOfGuesses.innerHTML = 'Error: ';
        guessDisplay.innerHTML = 'Your hint was wrong.';
        initMode1();
      } else {
        numberOfGuesses.innerHTML = 'Attempt ' + gn.round.toString() + ': ';
        guessDisplay.innerHTML = guessedNumber;
      }
    }

    hintInputA.value = '';
    hintInputB.value = '';
  });
}

const mode2 = () => {
  let gn = new GuessNumber(4);
  let hm;
  let playButtonMode2 = document.getElementById('playButtonMode2');
  let userGuess = document.getElementById('userGuess');
  let submitButtonMode2 = document.getElementById('submitButtonMode2');
  let warningMessageMode2 = document.getElementById('warningMessageMode2');
  let winningMessageMode2 = document.getElementById('winningMessageMode2');
  let numberOfGuessesMode2 = document.getElementById('numberOfGuessesMode2');
  let hintDisplay = document.getElementById('hintDisplay');
  let answerButtonMode2 = document.getElementById('answerButtonMode2');

  const initMode2 = () => {
    submitButtonMode2.disabled = true;
    answerButtonMode2.disabled = true;
    playButtonMode2.innerHTML = 'Play';
  }

  playButtonMode2.addEventListener('click', () => {
    hm = new HintMachine(gn.getRandomElement(gn.numbers)); 
    submitButtonMode2.disabled = false;
    answerButtonMode2.disabled = false;
    playButtonMode2.innerHTML = 'Replay';
    winningMessageMode2.innerHTML = '';
    warningMessageMode2.innerHTML = '';
    numberOfGuessesMode2.innerHTML = '';
    hintDisplay.innerHTML = '';
    userGuess.value = '';
  });

  submitButtonMode2.addEventListener('click', () => {
    const userGuessVal = userGuess.value;
    const numberSet = new Set(userGuessVal);
    if (!userGuessVal || !/[0-9][0-9][0-9][0-9]/.test(userGuessVal) || numberSet.size !== 4) {
      warningMessageMode2.innerHTML = 'Only numbers are allowed. Duplication is not allowed.';
      return;
    } else {
      warningMessageMode2.innerHTML = '';
    }

    const hint = hm.getHint(userGuessVal);
    if (hint === '4A0B') {
      numberOfGuessesMode2.innerHTML = 'Attempt ' + hm.round.toString() + ': ';
      hintDisplay.innerHTML = hint;
      winningMessageMode2.innerHTML = 'You used ' + hm.round.toString() + ' attempt(s) to guess the number';
      initMode2();
    } else {
      numberOfGuessesMode2.innerHTML = 'Attempt ' + hm.round.toString() + ': ';
      hintDisplay.innerHTML = hint;
    }

    userGuess.value = '';
  });

  answerButtonMode2.addEventListener('click', () => {
    numberOfGuessesMode2.innerHTML = 'Answer: ';
    hintDisplay.innerHTML = hm.answer;
    winningMessageMode2.innerHTML = 'You failed to guess the number using ' + hm.round.toString() + ' attempt(s)';
    initMode2();
  })
}

window.onload = () => {
  mode1();
  mode2();
};
