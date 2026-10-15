import express from 'express';
import {
  getCat,
  getCatsByUserId,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
import { upload, createThumbnail } from '../../middlewares/upload.js';

const catRouter = express.Router();

catRouter.route('/').get(getCat).post(upload.single('image'), createThumbnail, postCat);
catRouter.route('/user/:id').get(getCatsByUserId);
catRouter.route('/:id').get(getCatById).put(putCat).delete(deleteCat);

export default catRouter;
