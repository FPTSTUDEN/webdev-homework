import express from 'express';
import {
  getCat,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
// import { upload } from '../middleware/upload.js';
import multer from 'multer';
import createThumbnail from '../middleware/upload.js';
const upload = multer({ dest: 'uploads/' });

const catRouter = express.Router();

catRouter.route('/').get(getCat).post(upload.single('image'), createThumbnail, postCat);
catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
