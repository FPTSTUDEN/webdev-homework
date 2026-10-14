import {
  addCat,
  findCatById,
  listAllCats,
  listCatsByUserId,
  modifyCat,
  removeCat,
} from '../models/cat-model.js';

const getCat = async (req, res) => {
  const cats = await listAllCats();
  res.json(cats);
};

const getCatsByUserId = async (req, res) => {
  const cats = await listCatsByUserId(req.params.id);
  res.json(cats);
};

const getCatById = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (cat) {
    res.json(cat);
  } else {
    res.sendStatus(404);
  }
};

const postCat = async (req, res) => {
  console.log('req.file:', req.file); // Log the uploaded file information
  console.log('req.body:', req.body); // Log the request body
  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded.' });
    return;
  }
  const catData = {
    ...req.body,
    filename: req.file?.filename,
  };
  const result = await addCat(catData);
  if (result?.cat_id) {
    res.status(201);
    res.json({ message: 'New cat added.', result });
  } else {
    res.sendStatus(400);
  }
};

const putCat = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    res.sendStatus(404);
    return;
  }

  const updated = await modifyCat(req.body, req.params.id);
  if (updated) {
    res.status(200);
    res.json({ message: 'Cat item updated.' });
  } else {
    res.sendStatus(400);
  }
};

const deleteCat = async (req, res) => {
  const cat = await findCatById(req.params.id);
  if (!cat) {
    res.sendStatus(404);
    return;
  }

  const deleted = await removeCat(req.params.id);
  if (deleted) {
    res.status(200);
    res.json({ message: 'Cat item deleted.' });
  } else {
    res.sendStatus(400);
  }
};

export { getCat, getCatsByUserId, getCatById, postCat, putCat, deleteCat };
