
import restaurants from "./restaurants.js";
import { DAILY_MENU_URL, RESTAURANT_LIST_URL } from "./vars.js";

const REQUEST_TIMEOUT_MS = 5000;

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error("Error" + response.status);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function getMenu(restaurant) {
  return fetchJson(DAILY_MENU_URL(restaurant._id));
}

const dialog = document.querySelector("dialog");
async function loadRestaurants() {
  let restaurantList = restaurants;
  try {
    const apiRestaurants = await fetchJson(RESTAURANT_LIST_URL);
    if (!Array.isArray(apiRestaurants)) {
      throw new Error("Invalid restaurant list response");
    }
    restaurantList = apiRestaurants;
  } catch (error) {
    console.warn("Could not load restaurants from API; using local data:", error);
  }

  document.querySelector("#restaurant-list").innerHTML += restaurantList
    .map(
      restaurant =>
        `<tr class="restaurant-row" id="${restaurant._id}"><td>${restaurant.name}</td><td>${restaurant.address}</td></tr>`,
    )
    .sort()
    .join("");

  document.querySelectorAll(".restaurant-row").forEach(row => {
    row.addEventListener("click", async function () {
      const restaurant = restaurantList.find(r => r._id === row.id);

      document.querySelectorAll(".restaurant-row").forEach(r => r.classList.remove("highlight"));
      row.classList.add("highlight");

      let menu;
      try {
        menu = await getMenu(restaurant);
      } catch (error) {
        console.error("Could not load menu:", error);
        alert("Could not load the menu. Please try again.");
        return;
      }
      dialog.innerHTML = menu.courses
        .map(course => `<p>${course.name} - ${course.price} - ${course.diets}</p>`)
        .join("");
      dialog.innerHTML += `<button id="close">Close</button>`;
      dialog.showModal();
      document.querySelector('#close').addEventListener('click', function () {
        dialog.close();
      });

      alert(`Restaurant: ${restaurant.name}
        \nAddress: ${restaurant.address}
        \nPostal Code: ${restaurant.postalCode}
        \nCity: ${restaurant.city}
        \nPhone: ${restaurant.phone}
        \nCompany: ${restaurant.company}
        `);
    });
  });
}

loadRestaurants().catch(error => console.error("Could not load restaurants:", error));
// . means that the class is being selected. In this case, it is selecting all elements with the class "restaurant-row".
// # means that the id is being selected. In this case, it is selecting the element with the id "restaurant-list".