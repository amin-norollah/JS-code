"use strict";

//Get the button
const DOM_scrollTop = document.querySelector("#scroll-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    DOM_scrollTop.style.opacity = 100;
  } else {
    DOM_scrollTop.style.opacity = 0;
  }
}

// When the user clicks on the button, scroll to the top of the document
DOM_scrollTop.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});
