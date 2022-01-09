"use strict";

/////////////////////////////////////////
//selectors and initialization
const scorePlayer1 = document.querySelector("#score-player1");
const scorePlayer2 = document.querySelector("#score-player2");

const mainContainer = document.querySelector(".main-container");
const scoreItems = document.querySelectorAll(".score-item");

const DisplayMainElements = function () {
  mainContainer.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const tmp = `
        <div class="main-item">
            <image
            class="images"
            src="img/empty.png"
            width="60"
            height="60"
            ></image>
        </div>`;

    mainContainer.insertAdjacentHTML("afterbegin", tmp);
  }
};
DisplayMainElements();

const mainCells = document.querySelectorAll(".images");

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
preloadImages(["img/empty.png", "img/select_cpu.png", "img/select_user.png"]);

/////////////////////////////////////////
//functions

const switchPlayers = function () {
  [scoreItems[0].style.opacity, scoreItems[1].style.opacity] = [
    scoreItems[1].style.opacity,
    scoreItems[0].style.opacity,
  ];

  [GameData[0].isPlay, GameData[1].isPlay] = [
    GameData[1].isPlay,
    GameData[0].isPlay,
  ];
};

const EventClickCell = function (cur, index) {
  return (e) => {
    const tmp = cur.src.split("/");
    if (tmp[tmp.length - 1] === "empty.png") {
      if (GameData[0].isPlay) {
        cur.src = "img/select_user.png";
        GameData[0].SelectedCell[index] = 1;
      } else {
        cur.src = "img/select_cpu.png";
        GameData[1].SelectedCell[index] = 1;
      }
      switchPlayers();
      AutoReset();
      setTimeout(winChecker, 500);
    }
  };
};

const winChecker = function () {
  patternChecker(GameData[0].SelectedCell) && DisplayUpdateAndReset(0);
  patternChecker(GameData[1].SelectedCell) && DisplayUpdateAndReset(1);
};

const patternChecker = function (sc) {
  let tmp = false;
  WinPattern.forEach((pattern) => {
    if (sc[pattern[0]] === 1 && sc[pattern[1]] === 1 && sc[pattern[2]] === 1)
      tmp = true;
  });
  return tmp;
};

const DisplayUpdateAndReset = function (index) {
  if (isFinite(index)) GameData[index].score++;
  scorePlayer1.textContent = GameData[0].score;
  scorePlayer2.textContent = GameData[1].score;

  mainCells.forEach((cur) => (cur.src = "img/empty.png"));

  GameData[0].SelectedCell.fill(0);
  GameData[1].SelectedCell.fill(0);
};

const AutoReset = function () {
  if (
    GameData[0].SelectedCell.reduce((acc, mov) => acc + mov) +
      GameData[1].SelectedCell.reduce((acc, mov) => acc + mov) ===
    9
  )
    setTimeout(DisplayUpdateAndReset, 1000);
};

/////////////////////////////////////////
//main
const GameData = [
  {
    name: "Player1",
    score: 0,
    isPlay: true,
    SelectedCell: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "Player2",
    score: 0,
    isPlay: false,
    SelectedCell: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

const WinPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//select first player
scoreItems[0].style.opacity = 100;

//reset images in cells
DisplayUpdateAndReset();

//event handlers
mainCells.forEach((cur, i) => {
  cur.addEventListener("click", EventClickCell(cur, i));
});
mainContainer.addEventListener("contextmenu", (event) =>
  event.preventDefault()
);
