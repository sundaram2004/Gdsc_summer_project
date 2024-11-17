import express from 'express';
import { createPaymentIntent, updatePaymentStatus } from '../controller/paymentController.js';


const router = express.Router();


router.post('/create-checkout-session', createPaymentIntent);
router.put('/:selectedRestaurantId/order/:orderId/payment-status', updatePaymentStatus);

export default router;
