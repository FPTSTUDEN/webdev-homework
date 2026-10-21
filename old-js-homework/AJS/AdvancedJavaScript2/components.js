const restaurantRow = (restaurant) => {
  const { _id, name, company } = restaurant;
  const row = document.createElement('tr');

  row.className = 'restaurant-row';
  row.id = _id;
  row.innerHTML = `
    <td>${name}</td>
    <td>${company ?? 'Unknown company'}</td>
  `;

  return row;
};

const restaurantModal = (restaurant, menu) => {
  const { name, address, postalCode, city, phone, company } = restaurant;
  const { courses = [] } = menu ?? {};
  const menuHtml = courses.length
    ? `<ul>${courses
        .map(({ name: courseName, price, diets }) =>
          `<li>${courseName}, ${price ?? '?€'}. ${diets ?? 'No dietary information'}</li>`,
        )
        .join('')}</ul>`
    : '<p>No menu available.</p>';

  return `
    <h1>${name}</h1>
    <p>${address}</p>
    <p>${postalCode}, ${city}</p>
    <p>${phone ?? 'No phone number available'}</p>
    <p>${company ?? 'Unknown company'}</p>
    ${menuHtml}
    <button id="close" type="button">Close</button>
  `;
};

export { restaurantRow, restaurantModal };