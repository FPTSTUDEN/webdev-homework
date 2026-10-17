import express from 'express';
import { body, param } from 'express-validator';
import {
  getCat,
  getCatsByUserId,
  getCatById,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';
import { upload, createThumbnail } from '../../middlewares/upload.js';
import { validationErrors } from '../../middlewares/validation.js';

const catFields = {
  cat_name: body('cat_name').trim().isLength({ min: 1, max: 100 }),
  weight: body('weight').isFloat({ min: 0.01, max: 1000 }).toFloat(),
  owner: body('owner').isInt({ min: 1 }).toInt(),
  birthdate: body('birthdate').isISO8601().toDate(),
};
const catId = param('id').isInt({ min: 1 }).toInt();

const catRouter = express.Router();

catRouter.route('/').get(getCat).post(
  upload.single('image'),
  catFields.cat_name,
  catFields.weight,
  catFields.owner,
  catFields.birthdate,
  validationErrors,
  createThumbnail,
  postCat,
);
catRouter.route('/user/:id').get(catId, validationErrors, getCatsByUserId);
catRouter.route('/:id').get(catId, validationErrors, getCatById)
  .put(
    catId,
    body('cat_name').optional().trim().isLength({ min: 1, max: 100 }),
    body('weight').optional().isFloat({ min: 0.01, max: 1000 }).toFloat(),
    body('owner').optional().isInt({ min: 1 }).toInt(),
    body('birthdate').optional().isISO8601().toDate(),
    validationErrors,
    putCat,
  )
  .delete(catId, validationErrors, deleteCat);

export default catRouter;
