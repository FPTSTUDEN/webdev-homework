import { restaurantModal, restaurantRow } from './components.js';
import { baseUrl } from './variables.js';
import { fetchData } from './utils.js';

const restaurantList = document.querySelector('#restaurant-list');
const dialog = document.querySelector('dialog');
let restaurants = [];

const getMenu = (restaurantId) => fetchData(`${baseUrl}/daily/${restaurantId}/en`);

const clearHighlight = () =>
  document.querySelectorAll('.restaurant-row').forEach((row) => row.classList.remove('highlight'));

const showRestaurant = async (row) => {
  const restaurant = restaurants.find(({ _id }) => _id === row.id);

  if (!restaurant) {
    return;
  }

  clearHighlight();
  row.classList.add('highlight');

  try {
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
  } catch (error) {
    console.error('Could not load menu:', error);
    dialog.innerHTML = `<p>Could not load the menu. Please try again later.</p>
      <button id="close">Close</button>`;
    dialog.showModal();
    dialog.querySelector('#close')?.addEventListener('click', () => dialog.close());
  }
};

const renderRestaurants = (list) => {
  restaurantList.querySelectorAll('.restaurant-row').forEach((row) => row.remove());

  const rows = list
    .map((restaurant) => restaurantRow(restaurant))
    .sort((a, b) => a.textContent.localeCompare(b.textContent));

  rows.forEach((row) => {
    row.addEventListener('click', () =>
      showRestaurant(row).catch((error) => console.error('Could not load menu:', error)),
    );
    restaurantList.append(row);
  });
};

const loadRestaurants = async () => {
  try {
    restaurants = await fetchData(baseUrl);
    renderRestaurants(restaurants);
  } catch (error) {
    console.error('Could not load restaurants:', error);
    restaurantList.insertAdjacentHTML(
      'afterend',
      '<p id="error">Could not load restaurants. Please try again later.</p>',
    );
  }
};

// --- Filter feature ---
const filterRestaurants = (company) => {
  const filtered = company
    ? restaurants.filter(({ company: c }) => c?.toLowerCase() === company.toLowerCase())
    : restaurants;

  if (filtered.length === 0) {
    restaurantList.querySelectorAll('.restaurant-row').forEach((row) => row.remove());
    alert(`No restaurants found for ${company}.`);
    return;
  }

  renderRestaurants(filtered);
};

const createFilterButtons = () => {
  const controls = document.createElement('div');
  controls.id = 'filters';
  controls.innerHTML = `
    <button data-company="">All</button>
    <button data-company="Sodexo">Sodexo</button>
    <button data-company="Compass">Compass</button>
  `;
  restaurantList.before(controls);

  controls.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    filterRestaurants(button.dataset.company);
  });
};

createFilterButtons();
loadRestaurants();