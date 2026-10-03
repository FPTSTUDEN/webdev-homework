import { restaurantModal, restaurantRow } from './components.js';
import { baseUrl } from './variables.js';
import { fetchData } from './utils.js';

const restaurantList = document.querySelector('#restaurant-list');
const dialog = document.querySelector('dialog');
let restaurants = [];

const getMenu = (restaurantId) => fetchData(`${baseUrl}/daily/${restaurantId}/en`);

const showRestaurant = async (row) => {
  const restaurant = restaurants.find(({ _id }) => _id === row.id);

  if (!restaurant) {
    return;
  }

  document
    .querySelectorAll('.restaurant-row')
    .forEach((restaurantRowElement) => restaurantRowElement.classList.remove('highlight'));
  row.classList.add('highlight');

  const menu = await getMenu(restaurant._id);
  dialog.innerHTML = restaurantModal(restaurant, menu);
  dialog.showModal();
  dialog.querySelector('#close')?.addEventListener('click', () => dialog.close());

  const { name, address, postalCode, city, phone, company } = restaurant;
  alert(`Restaurant: ${name}
Address: ${address}
Postal Code: ${postalCode}
City: ${city}
Phone: ${phone ?? 'Not available'}
Company: ${company ?? 'Unknown'}`);
};

const loadRestaurants = async () => {
  restaurants = await fetchData(baseUrl);
  restaurantList.querySelectorAll('.restaurant-row').forEach((row) => row.remove());

  const rows = restaurants
    .map((restaurant) => restaurantRow(restaurant))
    .sort((firstRow, secondRow) => firstRow.textContent.localeCompare(secondRow.textContent));

  rows.forEach((row) => {
    row.addEventListener('click', () =>
      showRestaurant(row).catch((error) => console.error('Could not load menu:', error)),
    );
    restaurantList.append(row);
  });
};

loadRestaurants().catch((error) => console.error('Could not load restaurants:', error));