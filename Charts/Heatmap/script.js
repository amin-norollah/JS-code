/*
 * Created by Amin Norollah
 *
 * For more information, see the following github page:
 * https://amin-norollah.github.io/JS-code
 */

"use strict";

////////////////////////////
//selectors
const Dom_root = document.querySelector(":root");

const Dom_items = document.querySelector(".gallery-items-l1");
const Dom_btnMenu = document.querySelector("#btn-menu");

//nav
const Dom_sideNave = document.querySelector(".side-nav");
const Dom_btnSideNaveClose = document.querySelector(".side-nav-close-btn");
const Dom_inputBackColor = document.querySelector("#input-b-color");
const Dom_inputFontColor = document.querySelector("#input-f-color");
const Dom_btnGenerate = document.querySelector("#btn-generate");

////////////////////////////
//variables
let database = [];

////////////////////////////
//functions

const ToRGB = function (value) {
  let [r, g, b] = [0, 0, 0];
  if (value < 255) {
    r = value;
    g = 255;
  } else {
    r = 255;
    g = 511 - value;
  }
  return `rgb(${r},${g},${b})`;
};

//creating the database
const Display = function (rows, columns, variation = 0) {
  const dbClass = new CreateDatabase(rows, columns, [10, 80], variation);
  database = dbClass.Create;

  Dom_items.innerHTML = "";
  database.data.forEach((itemY) => {
    itemY.forEach((itemX) => {
      Dom_items.insertAdjacentHTML(
        "beforeend",
        `
        <div style="grid-row: ${`${itemX.coordinate.x}/${
          itemX.coordinate.x + 1
        }`}; grid-column: ${`${itemX.coordinate.y}/${
          itemX.coordinate.y + 1
        }`}; background-color:${ToRGB(
          itemX.value
        )}" id="gallery-item" data-item-coordinate="${JSON.stringify(
          itemX.coordinate
        )}">           
        </div>
      `
      );
    });
  });
};

Display(40, 40, 1);

///////////////////////////////////////////////
///////////////////////////////////////////////
// side navigator
Dom_btnMenu.addEventListener("click", () => {
  Dom_sideNave.style.width = "250px";
});

Dom_btnSideNaveClose.addEventListener("click", () => {
  Dom_sideNave.style.width = "0";
});

///////////////////////////
// color change
Dom_inputBackColor.addEventListener("change", () => {
  Dom_root.style.setProperty("--color-background", Dom_inputBackColor.value);
});
Dom_inputFontColor.addEventListener("change", () => {
  //hex to RGB
  const rgb = Dom_inputFontColor.value
    .match(/[A-Za-z0-9]{2}/g)
    .map(function (v) {
      return parseInt(v, 16);
    });

  const [r, g, b] = [...rgb];
  const g2 = g < 150 ? g + 100 : g - 100;

  //change font colors
  Dom_root.style.setProperty("--color-font", `rgb(${r},${g},${b})`);
  Dom_root.style.setProperty("--color-font-hover", `rgb(${r},${g2},${b})`);
});

///////////////////////////
// change the generated data

const DOM_inputRows = document.querySelector("#input-rows");
const DOM_inputColumns = document.querySelector("#input-columns");
const DOM_inputVariation = document.querySelector("#input-variation");
const DOM_inputBlur = document.querySelector("#input-blur");

DOM_inputRows.addEventListener("change", () => {
  document.querySelector(
    "#label-rows"
  ).innerHTML = `Num. of rows (current: ${DOM_inputRows.value})`;
});
DOM_inputColumns.addEventListener("change", () => {
  document.querySelector(
    "#label-columns"
  ).innerHTML = `Num. of columns (current: ${DOM_inputColumns.value})`;
});
DOM_inputVariation.addEventListener("change", () => {
  document.querySelector(
    "#label-variation"
  ).innerHTML = `Variation (current: ${DOM_inputVariation.value})`;
});
DOM_inputBlur.addEventListener("change", () => {
  document.querySelector(
    "#label-blur"
  ).innerHTML = `Blur (current: ${DOM_inputBlur.value})`;

  Dom_items.style.filter = `blur(${DOM_inputBlur.value}px)`;
});

Dom_btnGenerate.addEventListener("click", () => {
  const rows = +DOM_inputRows.value;
  const columns = +DOM_inputColumns.value;
  const variation = +DOM_inputVariation.value;

  Display(rows, columns, variation);
});
