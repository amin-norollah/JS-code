"use strict";

///////////////////////////////////////////////
///////////////////////////////////////////////
// Selectors
// root variables
const DOM_root = document.querySelector(":root");
// nav
const DOM_nav = document.querySelector(".nav");
const DOM_nav_Items = document.querySelector(".nav-items");
const DOM_nav_iconResponsive = document.querySelector(".icon-responsive");
const DOM_nav_btnTheme = document.querySelector("#btn-theme");
//header
const DOM_sectionHeader = document.querySelector(".section-header");
const DOM_btnLearnMore = document.querySelector("#btn-learn-more");
//tabs
const DOM_tabsItems = document.querySelector(".tabs-items");
const DOM_tabsContent = document.querySelectorAll(".tabs-content");

///////////////////////////////////////////////
///////////////////////////////////////////////
// functions

///////////////////////////////////////////////
///////////////////////////////////////////////
// menu
// responsive icon
DOM_nav_iconResponsive.addEventListener("click", () => {
  if (DOM_nav_Items.className === "nav-items") {
    DOM_nav_Items.classList.add("responsive");
  } else {
    DOM_nav_Items.className = "nav-items";
  }
});

// fade in effect
DOM_nav.addEventListener("mouseover", (e) => {
  const target = e.target;
  const theme = target.closest(".nav-theme")?.className;

  if (
    theme !== "nav-theme" &&
    target.getAttribute("id") !== "nav-item" &&
    target.getAttribute("id") !== "btn-login"
  )
    return;

  //change opacity
  DOM_nav.querySelectorAll("#nav-item").forEach((item) => {
    if (target !== item) item.style.opacity = "0.5";
    if (target === item) item.style.fontWeight = "bold";
  });

  if (theme !== "nav-theme")
    DOM_nav.querySelector(".nav-theme").style.opacity = "0.5";
});

// fade out effect
DOM_nav.addEventListener("mouseout", (e) => {
  if (e.currentTarget.className !== DOM_nav.className) return;

  //reset opacity
  DOM_nav.querySelectorAll("#nav-item").forEach((item) => {
    item.style.opacity = "1";
    item.style.fontWeight = "Normal";
  });

  DOM_nav.querySelector(".nav-theme").style.opacity = "1";
});

// menus link activation
DOM_nav_Items.addEventListener("click", (e) => {
  e.preventDefault();

  console.log(e.target);
  if (e.target.getAttribute("id") === "nav-item") {
    const id = e.target.getAttribute("href");
    document.querySelector(`${id}`).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////////////
///////////////////////////////////////////////
// header
// smooth scrolling
DOM_btnLearnMore.addEventListener("click", () => {
  document.querySelector("#section--1").scrollIntoView({ behavior: "smooth" });
});

//sticky navigation
const menuObserverCallback = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    DOM_nav.classList.add("nav-sticky");
    RootUpdateProperty(1, 0.8);
  }
  if (entry.isIntersecting) {
    DOM_nav.classList.remove("nav-sticky");
    RootUpdateProperty(0.8, 1);
  }
};

const RootUpdateProperty = function (from, to) {
  const style = getComputedStyle(DOM_root);

  DOM_root.style.setProperty(
    "--color-background-1",
    style
      .getPropertyValue("--color-background-1")
      .replace(`, ${from}`, `, ${to}`)
  );
  DOM_root.style.setProperty(
    "--color-background-1-dark",
    style
      .getPropertyValue("--color-background-1-dark")
      .replace(`, ${from}`, `, ${to}`)
  );
};

const menuObserver = new IntersectionObserver(menuObserverCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${DOM_nav.getBoundingClientRect().height}px`,
});

menuObserver.observe(DOM_sectionHeader);

///////////////////////////////////////////////
///////////////////////////////////////////////
// section 1 (tab)
DOM_tabsItems.addEventListener("click", (e) => {
  if (e.target.className !== "tabs-item") return;

  //remove transition effects
  document
    .querySelectorAll(".tabs-item")
    .forEach((item) => item.classList.remove("tabs-item-selected"));

  DOM_tabsContent.forEach((item) => {
    item.classList.add("tabs-content-hidden");

    if (item.getAttribute("id") === e.target.dataset.tab) {
      item.classList.remove("tabs-content-hidden");
      e.target.classList.add("tabs-item-selected");
    }
  });
});

///////////////////////////////////////////////
///////////////////////////////////////////////
// theme
DOM_nav_btnTheme.addEventListener("click", (e) => {
  for (let i = 0; i < 3; i++)
    RootSwapProperty(`--color-background-${i}`, `--color-background-${i}-dark`);
  for (let i = 0; i < 4; i++)
    RootSwapProperty(`--color-font-${i}`, `--color-font-${i}-dark`);
});

const RootSwapProperty = function (item1, item2) {
  const style = getComputedStyle(DOM_root);
  const tmp = style.getPropertyValue(item1);

  DOM_root.style.setProperty(item1, style.getPropertyValue(item2));
  DOM_root.style.setProperty(item2, tmp);
};
