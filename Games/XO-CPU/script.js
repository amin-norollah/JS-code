"use strict";

/////////////////////////////////////////
//selectors and initialization
const scorePlayer1 = document.querySelector("#score-player1");
const scoreCPU = document.querySelector("#score-cpu");

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

  GameData[1].isPlay && setTimeout(CPUmove, 500);
};

const EventClickCell = function (cur, index) {
  return (e) => {
    if (AvailableCells[index] && GameData[0].isPlay) PlayOneStep(cur, index);
  };
};

const PlayOneStep = function (cur, index) {
  if (cur === undefined || cur === null) cur = mainCells[index];
  if (GameData[0].isPlay) {
    cur.src = "img/select_user.png";
    GameData[0].SelectedCell[index] = 1;
  } else {
    cur.src = "img/select_cpu.png";
    GameData[1].SelectedCell[index] = 1;
  }
  AvailableCells[index] = 0;
  switchPlayers();
  AutoReset();
  setTimeout(winChecker, 500);
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
  scoreCPU.textContent = GameData[1].score;

  mainCells.forEach((cur) => (cur.src = "img/empty.png"));

  GameData[0].SelectedCell.fill(0);
  GameData[1].SelectedCell.fill(0);
  AvailableCells.fill(1);
};

const AutoReset = function () {
  if (AvailableCells.reduce((acc, mov) => acc + mov) === 0)
    setTimeout(DisplayUpdateAndReset, 100);
};

//CPU
const CPUmove = function () {
  const [competitorLevel, competitorIndex] = CPUChecker(
    GameData[0].SelectedCell
  );
  const [myLevel, myIndex] = CPUChecker(GameData[1].SelectedCell);

  if (competitorLevel > myLevel) {
    PlayOneStep(null, competitorIndex);
  } else if (myLevel > 0) {
    PlayOneStep(null, myIndex);
  } else if (AvailableCells.reduce((acc, mov) => acc + mov) !== 0) {
    for (let i = 0; i < 9; i++) {
      if (AvailableCells[i]) {
        PlayOneStep(null, i);
        break;
      }
    }
  } else {
    AutoReset();
    setTimeout(winChecker, 500);
  }
};

const CPUChecker = function (sc) {
  let tmp = [-1, -1];
  WinPattern.forEach((pattern, i) => {
    const p1 = sc[pattern[0]] === 1 && sc[pattern[1]] === 1;
    const p2 = sc[pattern[1]] === 1 && sc[pattern[2]] === 1;
    const p3 = sc[pattern[0]] === 1 && sc[pattern[2]] === 1;
    if (p1 && AvailableCells[pattern[2]]) tmp = [2, pattern[2]];
    if (p2 && AvailableCells[pattern[0]]) tmp = [2, pattern[0]];
    if (p3 && AvailableCells[pattern[1]]) tmp = [2, pattern[1]];
  });
  if (tmp === -1) {
    WinPattern.forEach((pattern, i) => {
      if (sc[pattern[0]] === 1)
        if (AvailableCells[pattern[2]]) tmp = [1, pattern[2]];
        else if (AvailableCells[pattern[1]]) tmp = [1, pattern[1]];
      if (sc[pattern[1]] === 1)
        if (AvailableCells[pattern[0]]) tmp = [1, pattern[0]];
        else if (AvailableCells[pattern[2]]) tmp = [1, pattern[2]];
      if (sc[pattern[2]] === 1)
        if (AvailableCells[pattern[0]]) tmp = [1, pattern[0]];
        else if (AvailableCells[pattern[1]]) tmp = [1, pattern[1]];
    });
  }
  return tmp;
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
    name: "CPU",
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

const AvailableCells = [1, 1, 1, 1, 1, 1, 1, 1, 1];

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