import { addCat, findCatById, listAllCats,updateCat } from '../models/cat-model.js';

const getCat = (req, res) => {
  res.json(listAllCats());
};

const getCatById = (req, res) => {
  const cat = findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = (req, res) => {
  const result = addCat(req.body);
  if (result.cat_id) {
    res.status(201);
    res.json({ message: 'New cat added.', result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = (req, res) => {
  const cat = findCatById(req.params.id);
  if (!cat) {
    res.sendStatus(404);
    return;
  }

  const updated = updateCat(req.params.id, req.body);
  if (updated) {
    res.status(200);
    res.json({ message: 'Cat item updated.' });
  } else {
    res.sendStatus(400);
  }
};

const deleteCat = (req, res) => {
  const cat = findCatById(req.params.id);
  if (!cat) {
    res.sendStatus(404);
    return;
  }

  const deleted = deleteCat(req.params.id);
  if (deleted) {
    res.status(200);
    res.json({ message: 'Cat item deleted.' });
  } else {
    res.sendStatus(400);
  }
};

export { getCat, getCatById, postCat, putCat, deleteCat };
