import express from 'express';
import {
  createRestaurant,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  getMenuByRestaurantId,
  getAllRestaurantsOfUser,
  generateQRCode,
  addOrderItem,
  getOrderByRestaurantId,
  updateOrders,
  getSpecificOrder,
  getOrderOfSpecificUser,
  getOrdersByUserId,
  removeMenuItem,
} from '../controller/restaurantController.js';

const router = express.Router();

router.post('/', createRestaurant);
router.get('/:userId', getAllRestaurantsOfUser);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

router.post('/:restaurantId', addMenuItem);
router.delete('/:restaurantId/menu/:itemId', removeMenuItem);
router.get('/:restaurantId/menu', getMenuByRestaurantId);
router.post('/:restaurantId/order', addOrderItem);
router.get('/:restaurantId/order', getOrderByRestaurantId);
router.put('/:restaurantId/order/:orderId',updateOrders);
router.get('/:restaurantId/order/:orderId',getSpecificOrder);
router.get('/:restaurantId/orderUser/:userId',getOrderOfSpecificUser);
router.get('/orders/:userId',getOrdersByUserId);








router.get('/generateQRCode/:restaurantId', generateQRCode);

export default router;
