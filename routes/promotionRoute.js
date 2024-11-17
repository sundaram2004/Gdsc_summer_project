import express from 'express';
import { createPromotion, getPromotions, updatePromotion, deletePromotion, getPromotionById } from '../controller/promotionController.js';

const router = express.Router();

router.post('/:restaurantId/promotions', createPromotion);
router.get('/:restaurantId/promotions', getPromotions);
router.put('/:restaurantId/promotions/:promotionId', updatePromotion);
router.delete('/:restaurantId/promotions/:promotionId/delete', deletePromotion);
router.get('/:restaurantId/promotions/:promotionId', getPromotionById);

// router.get()

export default router;
