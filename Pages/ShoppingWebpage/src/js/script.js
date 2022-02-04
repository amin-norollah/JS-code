"use strict";

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// Selectors

const DOM_items = document.querySelectorAll(".main-item");
const DOM_headerSecondary = document.querySelector(".header-nav-secondary");

///////////////////////////////////////////////////////////////////////////
// header buttons
DOM_headerSecondary.addEventListener("click", (e) => {
  const children = e.currentTarget.children;

  //add effect
  for (let item of children) {
    item.classList.remove("header-nav-secondary-btn--active");
  }
  e.target.classList.add("header-nav-secondary-btn--active");

  //other
});

///////////////////////////////////////////////////////////////////////////
// effect
DOM_items.forEach((item) => {
  item.addEventListener("mouseover", (e) => {
    const children = e.currentTarget.parentElement.children;

    for (let item of children) {
      if (item !== e.currentTarget) item.classList.add("main-item-overlay");
    }

    e.currentTarget.querySelector(".main-item-hide").style.opacity = "1";
  });
});

DOM_items.forEach((item) => {
  item.addEventListener("mouseout", (e) => {
    const children = e.currentTarget.parentElement.children;

    for (let item of children) {
      if (item !== e.currentTarget) item.classList.remove("main-item-overlay");
    }

    e.currentTarget.querySelector(".main-item-hide").style.opacity = "0";
  });
});

///////////////////////////////////////////////////////////////////////////
// APIs
const AllFood = async function () {};
