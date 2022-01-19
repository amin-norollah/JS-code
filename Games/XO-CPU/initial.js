/*
 * Created by Amin Norollah
 *
 * For more information, see the following github page:
 * https://amin-norollah.github.io/JS-code
 */

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
            src="img/empty.svg"
            width="60"
            height="60"
            data-index ="${i}"
            ></image>
        </div>`;

    mainContainer.insertAdjacentHTML("beforeend", tmp);
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
preloadImages(["img/empty.svg", "img/select_cpu.svg", "img/select_user.svg"]);
