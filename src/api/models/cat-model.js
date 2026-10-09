const catItems = [
  {
    cat_id: 9592,
    cat_name: 'Frank',
    weight: 11,
    owner: 3609,
    filename: 'f3dbafakjsdfhg4',
    birthdate: '2021-10-12',
  },
  {
    cat_id: 9590,
    cat_name: 'Mittens',
    weight: 8,
    owner: 3602,
    filename: 'f3dasdfkjsdfhgasdf',
    birthdate: '2021-10-12',
  },
];

const listAllCats = () => {
  return catItems;
};

const findCatById = (id) => {
  return catItems.find((item) => item.cat_id == id);
};

const addCat = (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;
  const newId = catItems[0].cat_id + 1;

  catItems.unshift({
    cat_id: newId,
    cat_name,
    weight,
    owner,
    filename,
    birthdate,
  });

  return { cat_id: newId };
};

const updateCat = (id, cat) => {
  const index = catItems.findIndex((item) => item.cat_id == id);
  if (index !== -1) {
    catItems[index] = cat; // Replace the existing cat data with the new data
    // catItems[index] = { ...catItems[index], ...cat }; // Merge existing cat data with new data - Please note that this will overwrite existing fields with new values if they are provided in the `cat` object.
    return true;
  }
  return false;
};

const deleteCat = (id) => {
  const index = catItems.findIndex((item) => item.cat_id == id);
  if (index !== -1) {
    catItems.splice(index, 1);
    return true;
  }
  return false;
};

export { listAllCats, findCatById, addCat, updateCat, deleteCat };
