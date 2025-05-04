import express from 'express';
import * as imageController from '../controller/image.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImageById);
router.post('/', auth, imageController.createImage);
router.put('/:id', auth, imageController.updateImage);
router.delete('/:id', auth, imageController.deleteImage);

export default router;