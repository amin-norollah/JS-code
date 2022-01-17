/*
 * Created by Amin Norollah
 *
 * For more information, see the following github page:
 * https://amin-norollah.github.io/JS-code
 */

"use strict";

///////////////////////////////////////////////////
///////////////////////////////////////////////////
//selectors
//user
const DOM_UserBalance = document.querySelector("#user-balance");
const DOM_RequestMoney = document.querySelector("#input-user-money");
const DOM_btnRequestMoney = document.querySelector("#btn-user-request");
const DOM_btnRemove = document.querySelector("#btn-order-remove");

//main
const DOM_MainDate = document.querySelector("#main-date");
const DOM_searchDateFrom = document.querySelector("#date-search-from");
const DOM_searchDateTo = document.querySelector("#date-search-to");
const DOM_btnSearch = document.querySelector("#btn-search");
const DOM_modals = document.querySelector("#modal-div");

//Auto-generate HTMLs
const DOM_Generate_orderedList = document.querySelector(".menu-ordered-list");
const DOM_Generate_searchItems = document.querySelector("#main-items");

//sort
const DOM_sortPrice = document.querySelector("#btn-sort-price");
const DOM_sortCity = document.querySelector("#btn-sort-city");
const DOM_sortAirlines = document.querySelector("#btn-sort-airlines");
const DOM_sortDate = document.querySelector("#btn-sort-date");

///////////////////////////////////////////////////
///////////////////////////////////////////////////
//values
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MainData = {
  cities: [
    { name: "Tokyo", level: 0, available: ["Mon", "Tue"] },
    { name: "Delhi", level: 1, available: ["Tue", "Wed"] },
    { name: "Shanghai", level: 0, available: ["Mon", "Wed"] },
    { name: "Mexico City", level: 4, available: ["Thu", "Fri"] },
    { name: "São Paulo", level: 4, available: ["Mon", "Thu"] },
    { name: "Mumbai", level: 1, available: ["Wed", "Fri"] },
    { name: "Cairo", level: 2, available: ["Tue", "Sat"] },
    { name: "Osaka", level: 0, available: ["Mon", "Sun"] },
    { name: "Beijing", level: 0, available: ["Sat", "Sun"] },
    { name: "Dhaka", level: 1, available: ["Thu", "Sun"] },
    { name: "Tehran", level: 2, available: ["Tue", "Fri"] },
    { name: "Dubai", level: 2, available: ["Mon", "Sun"] },
    { name: "London", level: 3, available: ["Sat", "Sun"] },
    { name: "Paris", level: 3, available: ["Wed", "Sun"] },
    { name: "Los Angeles", level: 4, available: ["Tue", "Sat"] },
    { name: "California", level: 4, available: ["Thu", "Fri"] },
  ],

  airlines: [
    {
      name: "Sunwing",
      img: "img/al_1.png",
      level: 0,
      factor: 1.05,
    },
    {
      name: "British Airways",
      img: "img/al_2.png",
      level: 3,
      factor: 1.15,
    },
    {
      name: "China Airlines",
      img: "img/al_3.png",
      level: 0,
      factor: 0.98,
    },
    {
      name: "Czech Airlines",
      img: "img/al_4.png",
      level: 3,
      factor: 1.35,
    },
    {
      name: "Emirates",
      img: "img/al_5.png",
      level: 2,
      factor: 1.15,
    },
    {
      name: "Hainan Airlines",
      img: "img/al_6.png",
      level: 2,
      factor: 1,
    },
    {
      name: "HK Express",
      img: "img/al_7.png",
      level: 1,
      factor: 1.2,
    },
    {
      name: "FlyOne",
      img: "img/al_8.png",
      level: 1,
      factor: 0.95,
    },
  ],

  basePrice: 425.2,

  CreateOtherData() {
    this.cities.forEach((item) => {
      item.abbreviation = item.name.toUpperCase().slice(0, 3);
    });
  },
};
MainData.CreateOtherData();

const userData = {
  balance: 3500,
  maxRequest: 4,
  request: 0,
  maxOrder: 8,
  orders: [],
};

let totalSearchPages = 0;
let currentSearchPages = 1;

const CurrentSearch = [];

///////////////////////////////////////////////////
///////////////////////////////////////////////////
//functions

///////////////////////////////////////////////////
const randomTime = function (level) {
  const [rndHour1, rndMin1] = [
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 59),
  ];
  const [rndHour2, rndMin2] = [
    rndHour1 + (level + 1) * 2,
    rndMin1 + (level + 1) * 15,
  ];

  return [
    new Date("2020", "0", "1", rndHour1, rndMin1, "00"),
    new Date("2020", "0", "1", rndHour2, rndMin2, "00"),
  ];
};

///////////////////////////////////////////////////
const stringTimes = function ([time1, time2]) {
  return ` ${String(time1.getHours()).padStart(2, 0)}:${String(
    time1.getMinutes()
  ).padStart(2, 0)} - ${String(time2.getHours()).padStart(2, 0)}:${String(
    time2.getMinutes()
  ).padStart(2, 0)}`;
};

///////////////////////////////////////////////////
const spanTime = function ([time1, time2]) {
  const tmp = Math.floor((time2 - time1) / (1000 * 60));
  const hours = Math.floor(tmp / 60);
  const mins = tmp % 60;

  return `${hours}h ${mins}m`;
};

DOM_btnSearch.addEventListener("click", () => {
  const to = new Date(DOM_searchDateTo.value);
  const from = new Date(DOM_searchDateFrom.value);
  const TimeSpan = to - from;

  if (TimeSpan >= 0) {
    const numDays = Math.floor(TimeSpan / (1000 * 60 * 60 * 24)) + 1;
    SearchEngine(from, numDays <= 90 ? numDays : 90);
    DisplayUpdate(12, 1);
  }
});

///////////////////////////////////////////////////
const SearchEngine = function (startDate, numDays) {
  //reset values
  CurrentSearch.splice(0, CurrentSearch.length);

  let count = 0;
  for (let i = 0; i < numDays; i++) {
    const tmpFrom = new Date(startDate);
    const theDay = new Date(tmpFrom.setDate(tmpFrom.getDate() + i));

    const availableCities = MainData.cities.filter((element) => {
      let tmp = false;
      element.available.forEach((day) => {
        if (day === days[theDay.getDay()]) tmp = true;
      });
      return tmp;
    });

    availableCities.forEach((citySrc) => {
      MainData.airlines
        .filter((airline) => citySrc.level === airline.level)
        .forEach((airline) => {
          for (let j = 0; j < Math.floor(Math.random() * 4) + 1; j++) {
            const rnd = Math.floor(Math.random() * MainData.cities.length) - 1;
            const cityDes = MainData.cities.filter(
              (item) => item.name !== citySrc.name
            )[Math.floor(Math.random() * (MainData.cities.length - 1))];

            //generate time
            const tmpTime = randomTime(Math.abs(citySrc.level - cityDes.level));

            //update time in theDay object
            theDay.setHours(tmpTime[0].getHours());
            theDay.setMinutes(tmpTime[0].getMinutes());

            //push new data to CurrentSearch array
            CurrentSearch.push({
              id: count,
              numOrder: 1,
              airline: airline,
              path: `${citySrc.abbreviation}- ${cityDes.abbreviation}`,
              displayDate: new Date(theDay).toLocaleDateString("en-us", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
              actualDate: new Date(theDay).toLocaleDateString("en-us", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              }),
              time: tmpTime,
              diffLevel: Math.abs(citySrc.level - cityDes.level) + 1,
              price: CalculatePrice(
                MainData.basePrice,
                airline.factor,
                Math.abs(citySrc.level - cityDes.level) + 1,
                1
              ),
            });
            count++;
          }
        });
    });
  }

  totalSearchPages = Math.ceil(CurrentSearch.length / 12);

  DisplayUpdate(12, 1);
};

///////////////////////////////////////////////////
const CalculatePrice = function (basePrice, factor, diffLevel, numOrder) {
  return Math.round(basePrice * factor * numOrder * diffLevel * 100) / 100;
};

///////////////////////////////////////////////////
const DisplayUpdate = function (NumDisplay, iteration) {
  DOM_Generate_searchItems.innerHTML = "";

  //search contents
  CurrentSearch.filter(
    (_, index) =>
      index < NumDisplay * iteration && index >= NumDisplay * (iteration - 1)
  ).forEach((item) => {
    DOM_Generate_searchItems.insertAdjacentHTML(
      "beforeend",
      `
        <div class="main-item">
        <div>
          <img src="${item.airline.img}" style="width: 90%" />
        </div>
        <div>
          <h4>${item.airline.name}</h4>
          <h5>${item.path}</h5>
        </div>
        <div>
          <h4>${item.displayDate}</h4>
          <h4>${stringTimes(item.time)}</h4>
          <h5>${spanTime(item.time)}</h5>
        </div>
        <div>
          <h4 id="search-item-price-${
            item.id
          }" style="color: green">$${new Intl.NumberFormat("en-US").format(
        item.price
      )}</h4>
          <input
            id="search-item-num"
            name = "${item.id}"
            type="number"
            step="1"
            value =1
            min="1"
            max="10"
          />
          <input id="search-item-order" name = "${
            item.id
          }" type="submit" value="Order" />
        </div>
      </div>`
    );
  });

  //page change buttons
  DOM_Generate_searchItems.insertAdjacentHTML(
    "beforeend",
    ` 
    <div class="page-change">
        <li id="page-previous" class="page-change-button page-change-round">&#8249;</li>
        <li>${iteration}/${totalSearchPages}</li>
        <li id="page-next" class="page-change-button page-change-round">&#8250;</li>
    </div>`
  );

  //event handelers for page changing
  if (iteration > 1)
    document.querySelector("#page-previous").addEventListener("click", () => {
      currentSearchPages--;
      DisplayUpdate(NumDisplay, currentSearchPages);
    });
  if (iteration < totalSearchPages)
    document.querySelector("#page-next").addEventListener("click", () => {
      currentSearchPages++;
      DisplayUpdate(NumDisplay, currentSearchPages);
    });
};

///////////////////////////////////////////////////
const parseLocaleNumber = function (val, locale) {
  var group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
  var decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
  var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
  reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");
  return Number.isNaN(reversedVal) ? 0 : reversedVal;
};

///////////////////////////////////////////////////
const AlertModal = function (title, msg) {
  DOM_modals.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="modal-main modal-hidden">
        <button class="modal-close">&times;</button>
        <h2>${title}</h2>
        <p>${msg}</p>
      </div>
  <div class="modal-overlay modal-hidden"></div>`
  );
  setTimeout(() => {
    document.querySelectorAll(".modal-hidden").forEach((item) => {
      item.classList.remove("modal-hidden");
    });
  }, 2);

  document.querySelector(".modal-close").addEventListener("click", () => {
    document.querySelector(".modal-main").classList.add("modal-hidden");
    document.querySelector(".modal-overlay").classList.add("modal-hidden");
    setTimeout(() => (DOM_modals.innerHTML = ""), 300);
  });
};

///////////////////////////////////////////////////
const OrderManagementUpdate = function () {
  DOM_Generate_orderedList.innerHTML = "";

  userData.orders.forEach((item) => {
    DOM_Generate_orderedList.insertAdjacentHTML(
      "afterbegin",
      `
      <input id="ordered-check" type="checkbox" name="${item.number}" />
      <label for="${item.number}">Order Number: ${item.number} </label><br/>
      `
    );
  });
};

///////////////////////////////////////////////////
//Other event handelers
//when we want to increase the number of orders, we need to update the number of orders in "CurrentSearch" object and total price.
DOM_Generate_searchItems.addEventListener("click", (e) => {
  e.preventDefault();

  //////////////////////////////////////////
  // for "Order numbers"
  if (e.target.id === "search-item-num") {
    //update with new data
    const findItem = CurrentSearch.find(
      (element) => element.id === +e.target.name
    );
    const newNum = +e.target.value;
    findItem.numOrder = newNum < 0 ? 0 : newNum > 10 ? 10 : newNum;
    findItem.price = CalculatePrice(
      MainData.basePrice,
      findItem.airline.factor,
      findItem.diffLevel,
      findItem.numOrder
    );
    document.querySelector(
      `#search-item-price-${findItem.id}`
    ).innerHTML = `$${new Intl.NumberFormat("en-US").format(findItem.price)}`;
  }

  //////////////////////////////////////////
  // for "Order button"
  if (e.target.id === "search-item-order") {
    //update with new data
    const findItem = CurrentSearch.find(
      (element) => element.id === +e.target.name
    );
    const CurrentPrice = +parseLocaleNumber(
      document
        .querySelector(`#search-item-price-${findItem.id}`)
        .innerHTML.slice(1),
      "en"
    );

    if (userData.orders.length < userData.maxOrder) {
      if (userData.balance >= CurrentPrice) {
        //have enough money
        userData.balance -= CurrentPrice;
        const newOrder = {
          number: String(Math.floor(Math.random() * 9000000)).padStart(7, 0),
          airline: findItem.airline.name,
          dest: findItem.path,
          date: findItem.actualDate,
          price: CurrentPrice,
          numTicket: findItem.numOrder,
        };
        userData.orders.push(newOrder);
        AlertModal(
          "Successful operation!",
          `Your order has been successfully submitted.</br>
                Ticket information:</br>
                - Order number: <b>${newOrder.number}</b></br>
                - Num. of tickets: <b>${newOrder.numTicket}</b></br>
                - Airline: <b>${newOrder.airline}</b></br>
                - Path: <b>${newOrder.dest}</b></br>
                - Flight date: <b>${newOrder.date}</b></br>
                - Price: <b>$${newOrder.price}</b></br>
                `
        );
        OrderManagementUpdate();
      } else {
        //you are not allowed to order this item
        AlertModal(
          "Failed operation!",
          "You do not have enough money to order."
        );
      }
    } else {
      //You have reached the maximum number of orders.
      AlertModal(
        "Failed operation!",
        "You have reached the maximum number of orders."
      );
    }
    UpdateUserData();
  }
});

DOM_btnRemove.addEventListener("click", () => {
  document.querySelectorAll("#ordered-check")?.forEach((item) => {
    if (item.checked) {
      const index = userData.orders.findIndex(
        (order) => order.number === item.name
      );

      //return money
      userData.balance += userData.orders[index].price;

      //delete
      if (index > -1) userData.orders.splice(index, 1);
    }
  });
  OrderManagementUpdate();
  UpdateUserData();
});

DOM_btnRequestMoney.addEventListener("click", (e) => {
  // Prevent form from submitting
  e.preventDefault();

  const request = +DOM_RequestMoney.value;
  if (!isNaN(request) && request > 0)
    if (userData.request < userData.maxRequest) {
      AlertModal(
        "Successful operation!",
        "Your request has been successfully submitted and after 4 seconds it would be applied."
      );
      userData.request++;
      setTimeout(() => {
        userData.balance += request;
        UpdateUserData();
      }, 4000);
    } else {
      AlertModal(
        "Failed operation!",
        "You are not allowed to apply for more loans."
      );
    }
  else AlertModal("Failed operation!", "Please enter the valid number.");
});

///////////////////////////////////////////////////
const UpdateUserData = function () {
  DOM_UserBalance.innerHTML =
    "$" + new Intl.NumberFormat("en-US").format(userData.balance);
};

///////////////////////////////////////////////////
//sort
let sortPriceOrder = true;
let sortCitiesOrder = true;
let sortAirlinesOrder = true;
let sortDateOrder = true;
DOM_sortPrice.addEventListener("click", (e) => {
  e.preventDefault();

  if (sortPriceOrder) {
    CurrentSearch.sort((a, b) => {
      if (a.price > b.price) return 1;
      if (a.price <= b.price) return -1;
    });
    DOM_sortPrice.value = "↓ Sort by price";
  } else {
    CurrentSearch.sort((a, b) => {
      if (a.price <= b.price) return 1;
      if (a.price > b.price) return -1;
    });
    DOM_sortPrice.value = "↑ Sort by price";
  }

  //change sort order for next sorting
  sortPriceOrder = !sortPriceOrder;

  //update search results
  DisplayUpdate(12, 1);
});

DOM_sortCity.addEventListener("click", (e) => {
  e.preventDefault();

  if (sortCitiesOrder) {
    CurrentSearch.sort((a, b) => {
      console.log(a.path <= b.path);
      if (a.path > b.path) return 1;
      if (a.path <= b.path) return -1;
    });
    DOM_sortCity.value = "↓ Sort by city";
  } else {
    CurrentSearch.sort((a, b) => {
      if (a.path <= b.path) return 1;
      if (a.path > b.path) return -1;
    });
    DOM_sortCity.value = "↑ Sort by city";
  }

  //change sort order for next sorting
  sortCitiesOrder = !sortCitiesOrder;

  //update search results
  DisplayUpdate(12, 1);
});

DOM_sortAirlines.addEventListener("click", (e) => {
  e.preventDefault();

  if (sortAirlinesOrder) {
    CurrentSearch.sort((a, b) => {
      if (a.airline.name > b.airline.name) return 1;
      if (a.airline.name <= b.airline.name) return -1;
    });
    DOM_sortAirlines.value = "↓ Sort by airline";
  } else {
    CurrentSearch.sort((a, b) => {
      if (a.airline.name <= b.airline.name) return 1;
      if (a.airline.name > b.airline.name) return -1;
    });
    DOM_sortAirlines.value = "↑ Sort by airline";
  }

  //change sort order for next sorting
  sortAirlinesOrder = !sortAirlinesOrder;

  //update search results
  DisplayUpdate(12, 1);
});

DOM_sortDate.addEventListener("click", (e) => {
  e.preventDefault();
  if (sortDateOrder) {
    CurrentSearch.sort((a, b) => {
      const tmp = new Date(b.actualDate) - new Date(a.actualDate);
      if (tmp <= 0) return 1;
      if (tmp > 0) return -1;
    });
    DOM_sortDate.value = "↓ Sort by date";
  } else {
    CurrentSearch.sort((a, b) => {
      const tmp = new Date(b.actualDate) - new Date(a.actualDate);
      if (tmp > 0) return 1;
      if (tmp <= 0) return -1;
    });
    DOM_sortDate.value = "↑ Sort by date";
  }

  //change sort order for next sorting
  sortDateOrder = !sortDateOrder;

  //update search results
  DisplayUpdate(12, 1);
});

///////////////////////////////////////////////////
///////////////////////////////////////////////////
//initialization
SearchEngine(new Date(), 1);
UpdateUserData();

//todays date
DOM_MainDate.innerHTML = new Date().toLocaleDateString("en-us", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
