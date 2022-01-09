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
preloadImages(Array.from({ length: 7 }, (_, i) => `img/dice-${i}.png`));

const action_reset = function () {
  player1 = {
    highScore: 0,
    currentScore: 0,
  };

  player2 = {
    highScore: 0,
    currentScore: 0,
  };

  Switch();
  Update();
};

const action_resetGlobal = function () {
  totalWinPlayer1.textContent = 0;
  totalWinPlayer2.textContent = 0;
  action_reset();
};

const action_roll = function () {
  const newDice = Math.ceil(Math.random() * 6);
  image_dice.src = `img/dice-${newDice}.png`;

  if (newDice !== 1) {
    if (player1.isEnable) player1.currentScore += newDice;
    else {
      player2.currentScore += newDice;
      setTimeout(CPUgame, 1000);
    }
  } else {
    action_hold(false);
  }
  Update();

  div_dice.classList.remove("dice-anim");
  void div_dice.offsetWidth;
  div_dice.classList.add("dice-anim");
};

const action_hold = function (condition) {
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
    action_reset();
  } else if (player2.highScore >= winScore) {
    alert("CPU win!");
    totalWinPlayer2.textContent = Number(totalWinPlayer2.textContent) + 1;
    action_reset();
  } else {
    Switch();
    Update();
  }
};

const CPUgame = function () {
  if (player2.highScore + player2.currentScore < winScore)
    if (player1.highScore > player2.highScore) {
      if (player2.currentScore < 14) action_roll();
      else action_hold(true);
    } else {
      if (player2.currentScore < 9) action_roll();
      else action_hold(true);
    }
  else action_hold(true);
};

const Switch = function () {
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

const Update = function () {
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

const action_info = function () {
  container_information.classList.remove("hidden");
  container_overlay.classList.remove("hidden");
};
const action_close = function () {
  container_information.classList.add("hidden");
  container_overlay.classList.add("hidden");
};

///////////////////////////////
//main
const winScore = 50;

let player1 = {
  isEnable: true,
  highScore: 0,
  currentScore: 0,
};

let player2 = {
  isEnable: false,
  highScore: 0,
  currentScore: 0,
};

const eventReset = btn_reset.addEventListener("click", action_resetGlobal);
const eventRollDice = btn_roll.addEventListener("click", action_roll);
const eventHold = btn_hold.addEventListener("click", action_hold);
const eventInfo = btn_info.addEventListener("click", action_info);
const eventClose = btn_close.addEventListener("click", action_close);
