
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

  const restaurantTable = document.querySelector("#restaurant-list");
  const sortedRestaurants = [...restaurantList].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const rows = sortedRestaurants.map(restaurant => {
    const row = document.createElement("tr");
    row.classList.add("restaurant-row");

    const nameCell = document.createElement("td");
    nameCell.textContent = restaurant.name;
    const addressCell = document.createElement("td");
    addressCell.textContent = restaurant.address;
    row.append(nameCell, addressCell);

    row.addEventListener("click", async function () {
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

      dialog.replaceChildren();
      menu.courses.forEach(course => {
        const paragraph = document.createElement("p");
        paragraph.textContent = `${course.name} - ${course.price} - ${course.diets}`;
        dialog.append(paragraph);
      });

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.addEventListener("click", function () {
        dialog.close();
      });
      dialog.append(closeButton);
      dialog.showModal();

      alert(`Restaurant: ${restaurant.name}
        \nAddress: ${restaurant.address}
        \nPostal Code: ${restaurant.postalCode}
        \nCity: ${restaurant.city}
        \nPhone: ${restaurant.phone}
        \nCompany: ${restaurant.company}
        `);
    });
    return row;
  });
  restaurantTable.append(...rows);
}

loadRestaurants().catch(error => console.error("Could not load restaurants:", error));
// . means that the class is being selected. In this case, it is selecting all elements with the class "restaurant-row".
// # means that the id is being selected. In this case, it is selecting the element with the id "restaurant-list".