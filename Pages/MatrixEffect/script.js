// copyright: Amin Norollah
// I developed and optimized the existing code from: Clive Cooper
// and I used matrix font from e-RBi (e-rbi.com).

"use strict";
// Initializing the canvas
const DOM_canvas = document.querySelector("canvas"),
  ctx = DOM_canvas.getContext("2d");

// Setting the width and height of the canvas
DOM_canvas.width = window.innerWidth;
DOM_canvas.height = window.innerHeight;

// Setting up the letters
const letters = "ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ".split("");

// Setting up the columns
const fontSize = 12;
const columns = DOM_canvas.width / fontSize;

// Setting up the drops
let drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

//set font
ctx.font = "normal 12px MatrixFont";

// Setting up the draw function
function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, .02)";
  ctx.fillRect(0, 0, DOM_canvas.width, DOM_canvas.height);
  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillStyle = "#0f0";
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    drops[i]++;
    if (drops[i] * fontSize > DOM_canvas.height && Math.random() > 0.95) {
      drops[i] = 0;
    }
  }
}

// Loop the animation
setInterval(draw, 33);
