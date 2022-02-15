"use strict";
const DOM_body = document.querySelector("body");
const DOM_img = document.querySelector("#img-nastaligh");

DOM_img.addEventListener("mouseover", () => {
  DOM_body.style.setProperty("background-position", "0% 50%");
});

DOM_img.addEventListener("mouseout", () => {
  DOM_body.style.setProperty("background-position", "50% 100%");
});
