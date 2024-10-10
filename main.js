let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By <span>Thaier Assaf<span>`;
const restartButton = document.createElement("button");


let numberOfTries = 5;
let numberOfLetters = 5;
let currentTry = 1;
let numberOfHints=2;
document.querySelector(".hint span").innerHTML=numberOfHints;
const getHintButton=document.querySelector(".hint");
getHintButton.addEventListener("click",getHint);
let wordToGuess = "";
const words = [
  "Apple", "Bread", "Brain", "Clown", "Cloud", "Dream", "Earth", "Flute", 
  "Fruit", "Ghost", "Giant", "Heart", "Horse", "Light", "Night", "Plane", 
  "River", "Shark", "Stone", "Toast", "Whale", "Zebra", "Tiger", "Piano"
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");

  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i != 1) tryDiv.classList.add("disabled-input");

    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }
  inputsContainer.children[0].children[1].focus();

  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-input input"
  );
  inputsInDisabledDiv.forEach((input) => (input.disabled = true));

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    if (letter === actualLetter) {
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("not-in-word");
      successGuess = false;
    }
  }
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-input"));
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-input");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));
    currentTry++;
    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));
    let element = document.querySelector(`.try-${currentTry}`);
    if (element) {
      element.classList.remove("disabled-input");
      element.children[1].focus();
    } else {
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
      guessButton.disabled = true;
      getHintButton.disabled = true;
    }
  }

  // التأكد من إضافة زر إعادة التشغيل مرة واحدة
  restartButton.textContent = "Play Again";
  restartButton.classList.add("restart");

  if (!document.body.contains(restartButton)) {
    restartButton.addEventListener("click", () => location.reload());
    document.body.appendChild(restartButton);
  }

  if (currentTry > numberOfTries) {
    for (let i = 0; i < wordToGuess.length; i++) {
      const inputField = document.querySelector(
        `#guess-${numberOfTries}-letter-${i + 1}`
      );
      inputField.value = wordToGuess[i].toUpperCase();
      inputField.classList.add("in-place");
    }
    messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) getHintButton.disabled = true;

  const enabledInputs = document.querySelectorAll(`.try-${currentTry} input`);
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
      randomInput.classList.add("in-place");
    }
  }
}

document.addEventListener("keydown", handleBackspace);

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll(`.try-${currentTry} input`);
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

window.onload = function () {
  generateInput();
};
