
import restaurants from "./restaurants.js";
import {
  DAILY_MENU_URL,
  RESTAURANT_LIST_URL,
  WEEKLY_MENU_URL,
} from "./vars.js";

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

async function getMenu(restaurant, menuType) {
  const menuUrl = menuType === "weekly"
    ? WEEKLY_MENU_URL(restaurant._id)
    : DAILY_MENU_URL(restaurant._id);
  return fetchJson(menuUrl);
}

const dialog = document.querySelector("dialog");

function appendCourse(container, course) {
  const paragraph = document.createElement("p");
  paragraph.textContent = `${course.name} - ${course.price} - ${course.diets}`;
  container.append(paragraph);
}

function renderMenu(menu, menuType, container) {
  container.replaceChildren();

  if (menuType === "weekly") {
    if (!Array.isArray(menu?.days)) {
      throw new Error("Invalid weekly menu response");
    }
    menu.days.forEach(day => {
      const heading = document.createElement("h3");
      heading.textContent = day.date;
      container.append(heading);
      if (!Array.isArray(day.courses)) {
        throw new Error("Invalid weekly menu day response");
      }
      day.courses.forEach(course => appendCourse(container, course));
    });
    return;
  }

  if (!Array.isArray(menu?.courses)) {
    throw new Error("Invalid daily menu response");
  }
  menu.courses.forEach(course => appendCourse(container, course));
}

async function loadRestaurants() {
  let restaurantList = restaurants;
  try {
    const response = await fetchJson(RESTAURANT_LIST_URL);
    const apiRestaurants = Array.isArray(response) ? response : response?.restaurants;
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

      dialog.replaceChildren();

      const heading = document.createElement("h2");
      heading.textContent = restaurant.name;
      dialog.append(heading);

      const details = document.createElement("p");
      details.textContent = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;
      dialog.append(details);

      const menuContainer = document.createElement("section");
      menuContainer.setAttribute("aria-live", "polite");

      const menuButtons = [];
      for (const menuType of ["daily", "weekly"]) {
        const menuButton = document.createElement("button");
        menuButton.textContent = `${menuType[0].toUpperCase()}${menuType.slice(1)} menu`;
        menuButtons.push(menuButton);
        menuButton.addEventListener("click", async () => {
          menuButtons.forEach(button => button.disabled = true);
          menuContainer.textContent = "Loading menu...";
          try {
            const menu = await getMenu(restaurant, menuType);
            renderMenu(menu, menuType, menuContainer);
          } catch (error) {
            console.error(`Could not load ${menuType} menu:`, error);
            menuContainer.textContent = "Could not load the menu. Please try again.";
          } finally {
            menuButtons.forEach(button => button.disabled = false);
          }
        });
        dialog.append(menuButton);
      }
      dialog.append(menuContainer);

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.addEventListener("click", function () {
        dialog.close();
      });
      dialog.append(closeButton);
      dialog.showModal();
    });
    return row;
  });
  restaurantTable.append(...rows);
}

loadRestaurants().catch(error => console.error("Could not load restaurants:", error));
// . means that the class is being selected. In this case, it is selecting all elements with the class "restaurant-row".
// # means that the id is being selected. In this case, it is selecting the element with the id "restaurant-list".