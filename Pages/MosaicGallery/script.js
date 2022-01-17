"use strict";

////////////////////////////
//selectors
const Dom_root = document.querySelector(":root");

const Dom_items = document.querySelector(".gallery-items");
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

//creating the database
const Display = function (rows, columns) {
  const dbClass = new CreateDatabase(rows, columns);
  database = dbClass.Create;

  Dom_items.innerHTML = "";
  database.forEach((el, i) => {
    let row = "";
    let column = "";

    switch (el.type) {
      case "Level-5":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 5}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 5}`;
        break;
      case "Level-4":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 4}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 4}`;
        break;
      case "Level-3":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 3}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 3}`;
        break;
      case "Level-2":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 2}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 2}`;
        break;
      case "rect-0":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 1}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 2}`;
        break;
      case "rect-1":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 2}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 1}`;
        break;
      case "normal":
        row = `${el.coordinate[0]}/${el.coordinate[0] + 1}`;
        column = `${el.coordinate[1]}/${el.coordinate[1] + 1}`;
        break;
    }

    Dom_items.insertAdjacentHTML(
      "beforeend",
      `
    <div style="grid-row: ${row}; grid-column: ${column}" id="gallery-item" data-id="${i}">
        <img id="gallery-img" src="img/image-${el.imageId}-thumbnail.jpg"/>
    </div>
    `
    );
  });
};

Display(20, 20);

///////////////////////////////////////////////
///////////////////////////////////////////////
// side navigator
Dom_btnMenu.addEventListener("click", () => {
  Dom_sideNave.style.width = "250px";
});

Dom_btnSideNaveClose.addEventListener("click", () => {
  Dom_sideNave.style.width = "0";
});

///////////////////////////////////////////////
///////////////////////////////////////////////
// modal
Dom_items.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") !== "gallery-img") return;
  const entry = database[+e.target.parentElement.dataset.id];

  document.querySelector("#div-modal").insertAdjacentHTML(
    "afterbegin",
    `
    <div class="modal-main modal-hidden">
        <h2>Image-${entry.imageId}</h2>
        <img class="modal-blur" src="img/image-${entry.imageId}-thumbnail.jpg" width="400" height="400" />
      </div>
      <div class="modal-overlay modal-hidden"></div>
    `
  );
  setTimeout(() => {
    document.querySelectorAll(".modal-hidden").forEach((item) => {
      item.classList.remove("modal-hidden");
    });
  }, 2);

  document
    .querySelector(".modal-overlay")
    .addEventListener("click", modalClose);

  document.querySelector(".modal-main").addEventListener("click", modalClose);

  const imgTarget = document.querySelector(".modal-blur");
  imgObserver.observe(imgTarget);
});

const modalClose = function () {
  document.querySelector(".modal-main").classList.add("modal-hidden");
  document.querySelector(".modal-overlay").classList.add("modal-hidden");
  setTimeout(() => (document.querySelector("#div-modal").innerHTML = ""), 300);
};

////////////////////////
//lazy image
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.src.replace("-thumbnail", "");
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("modal-blur");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
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
Dom_btnGenerate.addEventListener("click", () => {
  const rows = +document.querySelector("#input-rows").value;
  const columns = +document.querySelector("#input-columns").value;

  Display(rows, columns);
});
