
import restaurants from "./restaurants.js";

async function getMenu(restaurant) {
  const response = await fetch(`https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily/${restaurant._id}/en`);
  if (!response.ok) {
    throw new Error("Error" + response.status);
  }
  return  response.json();
}
const restaurant_api = "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants"

const dialog = document.querySelector("dialog");
async function loadRestaurants() {
  const response = await fetch(restaurant_api);
  if (!response.ok) {
    throw new Error("Error" + response.status);
  }

  restaurants = await response.json();

  document.querySelector("#restaurant-list").innerHTML += restaurants
    .map(
      restaurant =>
        `<tr class="restaurant-row" id="${restaurant._id}"><td>${restaurant.name}</td><td>${restaurant.address}</td></tr>`,
    )
    .sort()
    .join("");

  document.querySelectorAll(".restaurant-row").forEach(row => {
    row.addEventListener("click", async function () {
      const restaurant = restaurants.find(r => r._id === row.id);

      document.querySelectorAll(".restaurant-row").forEach(r => r.classList.remove("highlight"));
      row.classList.add("highlight");

      const menu = await getMenu(restaurant);
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