/*
 * Created by Amin Norollah
 *
 * For more information, see the following github page:
 * https://amin-norollah.github.io/JS-code
 */

"use strict";

///////////////////////////////
//selectors
const highScorePlayer1 = document.querySelector("#player1-score");
const currentPlayer1 = document.querySelector("#player1-current");
const highScorePlayer2 = document.querySelector("#player2-score");
const currentPlayer2 = document.querySelector("#player2-current");

const totalWinPlayer1 = document.querySelector("#player1-total-win");
const totalWinPlayer2 = document.querySelector("#player2-total-win");

const crownPlayer1 = document.querySelector("#player1-crown-image");
const crownPlayer2 = document.querySelector("#player2-crown-image");

const btn_reset = document.querySelector("#btn-reset");
const div_dice = document.querySelector(".dice-div");
const image_dice = document.querySelector("#dice-image");
const btn_roll = document.querySelector("#btn-roll");
const btn_hold = document.querySelector("#btn-hold");

const side_left = document.querySelector(".side-left");
const side_right = document.querySelector(".side-right");

//information
const btn_info = document.querySelector(".information");
const container_information = document.querySelector(".container-information");
const container_overlay = document.querySelector(".container-overlay");
const btn_close = document.querySelector(".close-information-window");

///////////////////////////////
//functions

//cache images
function preloadImages(array) {
  if (!preloadImages.list) {
    preloadImages.list = [];
  }
  const list = preloadImages.list;
  for (let i = 0; i < array.length; i++) {
    const img = new Image();
    img.onload = function () {
      const index = list.indexOf(this);
      if (index !== -1) {
        // remove image from the array once it's loaded
        // for memory consumption reasons
        list.splice(index, 1);
      }
    };
    list.push(img);
    img.src = array[i];
  }
}
preloadImages(Array.from({ length: 7 }, (_, i) => `img/dice-${i}.svg`));

const resetPartial = function () {
  player1.reset();
  player2.reset();

  SwitchPlayers();
  RenderDisplay();
};

const resetGlobal = function () {
  totalWinPlayer1.textContent = 0;
  totalWinPlayer2.textContent = 0;
  resetPartial();
};

const RollFunction = function () {
  const newDice = Math.ceil(Math.random() * 6);
  image_dice.src = `img/dice-${newDice}.svg`;

  if (newDice !== 1) {
    if (player1.isEnable) player1.currentScore += newDice;
    else {
      player2.currentScore += newDice;
      setTimeout(CPUgame, 1000);
    }
  } else {
    HoldFunction(false);
  }
  RenderDisplay();

  //animation
  div_dice.classList.remove("dice-anim");
  void div_dice.offsetWidth;
  div_dice.classList.add("dice-anim");
};

const HoldFunction = function (condition) {
  if (player1.isEnable) {
    player1.highScore = condition
      ? player1.highScore + player1.currentScore
      : player1.highScore - player1.currentScore;
    player1.currentScore = 0;

    setTimeout(CPUgame, 1500);
  } else {
    player2.highScore = condition
      ? player2.highScore + player2.currentScore
      : player2.highScore - player2.currentScore;
    player2.currentScore = 0;
  }

  //detect winner
  if (player1.highScore >= winScore) {
    alert("Player 1 win!");
    totalWinPlayer1.textContent = Number(totalWinPlayer1.textContent) + 1;
    resetPartial();
  } else if (player2.highScore >= winScore) {
    alert("CPU win!");
    totalWinPlayer2.textContent = Number(totalWinPlayer2.textContent) + 1;
    resetPartial();
  } else {
    SwitchPlayers();
    RenderDisplay();
  }
};

const CPUgame = function () {
  if (player2.highScore + player2.currentScore < winScore)
    if (player1.highScore > player2.highScore) {
      if (player2.currentScore < 14) RollFunction();
      else HoldFunction(true);
    } else {
      if (player2.currentScore < 9) RollFunction();
      else HoldFunction(true);
    }
  else HoldFunction(true);
};

const SwitchPlayers = function () {
  if (player1.isEnable) {
    player1.isEnable = false;
    player2.isEnable = true;
    btn_roll.disabled = true;
    btn_hold.disabled = true;
    side_left.style.opacity = "40%";
    side_right.style.opacity = "90%";
  } else {
    player1.isEnable = true;
    player2.isEnable = false;
    btn_roll.disabled = false;
    btn_hold.disabled = false;
    side_left.style.opacity = "90%";
    side_right.style.opacity = "40%";
  }
};

const RenderDisplay = function () {
  highScorePlayer1.textContent = `Score: ${String(player1.highScore).padStart(
    2,
    0
  )}`;
  currentPlayer1.textContent = player1.currentScore;
  highScorePlayer2.textContent = `Score: ${String(player2.highScore).padStart(
    2,
    0
  )}`;
  currentPlayer2.textContent = player2.currentScore;

  //set crown
  if (
    Number(totalWinPlayer1.textContent) === Number(totalWinPlayer2.textContent)
  )
    crownPlayer1.style.opacity = crownPlayer2.style.opacity = 0;
  else if (
    Number(totalWinPlayer1.textContent) > Number(totalWinPlayer2.textContent)
  ) {
    crownPlayer1.style.opacity = 100;
    crownPlayer2.style.opacity = 0;
  } else {
    {
      crownPlayer1.style.opacity = 0;
      crownPlayer2.style.opacity = 100;
    }
  }

  //delete btn-anim class from btn-roll
  btn_roll.classList.remove("btn-anim");
};

///////////////////////////////
//main
const winScore = 50;

let player1 = {
  isEnable: true,
  highScore: 0,
  currentScore: 0,

  reset() {
    this.highScore = 0;
    this.currentScore = 0;
  },
};

let player2 = {
  isEnable: false,
  highScore: 0,
  currentScore: 0,

  reset() {
    this.highScore = 0;
    this.currentScore = 0;
  },
};

const eventReset = btn_reset.addEventListener("click", resetGlobal);
const eventRollDice = btn_roll.addEventListener("click", RollFunction);
const eventHold = btn_hold.addEventListener("click", HoldFunction);

///////////////////////////////////
//modal
const eventInfo = btn_info.addEventListener("click", () => {
  container_information.classList.remove("hidden");
  container_overlay.classList.remove("hidden");
});
const eventClose = btn_close.addEventListener("click", () => {
  container_information.classList.add("hidden");
  container_overlay.classList.add("hidden");
});
