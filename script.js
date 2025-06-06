let emoji = ["🍒", "🍌", "🍎", "🥝", "🍇", "🍉", "🧋", "🍺"];
let cards = [...emoji, ...emoji].sort(() => Math.random() - 0.5);

const stepsUI = document.querySelector(".steps");
const matchesUI = document.querySelector(".matches");
const resultUI = document.querySelector(".result");
const board = document.querySelector(".gameBoard");

const resetbtn = document.querySelector(".reset");

let card1 = null,
  card2 = null,
  lock = false;

let steps = 0,
  matches = 0;
let result = "Flip a card";

function updateUI() {
  stepsUI.textContent = `Steps: ${steps}`;
  matchesUI.textContent = `Matches: ${matches}`;
  resultUI.textContent = `${result}`;
}

function createCard(emoji, index) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("hidden");
  card.dataset.image = emoji;
  card.dataset.index = index;

  const inner = document.createElement("div");
  inner.className = "inner";

  const front = document.createElement("div");
  front.className = "front";
  front.textContent = emoji;

  const back = document.createElement("div");
  back.className = "back";

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  const flipSound = new Audio("FLIP.mp3");
  const winSound = new Audio("win.mp3");

  card.addEventListener("click", () => {
    if (lock || card.classList.contains("matched") || card === card1) return;

    flipSound.play(); // play flip sound on click
    card.classList.remove("hidden");

    if (!card1) {
      card1 = card;
      steps++;
      updateUI();
    } else {
      card2 = card;
      steps++;
      lock = true;

      if (card1.dataset.image === card2.dataset.image) {
        card1.classList.remove("hidden");
        card2.classList.remove("hidden");
        card1.classList.add("matched");
        card2.classList.add("matched");
        matches++;

        if (matches === cards.length / 2) {
          result = "🥳 You won";
          updateUI();
          winSound.play(); // play win sound
          setTimeout(() => {
            lock = false;
            resetTurn();
          }, 500);
        } else {
          result = "Yay, its a match";
          updateUI(); // fix: update UI here too
          lock = false;
          resetTurn();
        }
      } else {
        setTimeout(() => {
          card1.classList.add("hidden");
          card2.classList.add("hidden");
          result = "Try another";
          updateUI(); // also update UI here for "Try another"
          lock = false;
          resetTurn();
        }, 800);
      }
    }
  });

  return card;
}
updateUI();

function resetTurn() {
  (card1 = null), (card2 = null);
  lock = false;
  updateUI();
}

function createBorad() {
  board.innerHTML = "";
  cards.forEach((emoji, index) => {
    const card = createCard(emoji, index);
    board.appendChild(card);
  });
}

resetbtn.addEventListener("click", () => {
  cards = [...emoji, ...emoji].sort(() => Math.random() - 0.5);
  matches = 0;
  steps = 0;
  result = "Flip a card";
  resetTurn();
  createBorad();
});

createBorad();
