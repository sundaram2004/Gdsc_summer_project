import QRCode from 'qrcode';
import RestaurantModel from '../models/restaurantModel.js';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import dotenv from "dotenv";


dotenv.config();
const stripe = new Stripe("sk_test_51PXdbsKsLOwdkUkUQHxmTPJod6qCZua6rnBHdGaozSEHD9BGX0GrKSm0BbxfP9ysGntCVWtfMpBoPJpWDWzsUgOr00NwiD7kAT");


// Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const restaurant = new RestaurantModel(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all restaurantsOfUser
export const getAllRestaurantsOfUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const restaurants = await RestaurantModel.find({ userId });
    if (!restaurants) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a restaurant by ID
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a restaurant by ID
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to add a new menu item to a specific restaurant
export const addMenuItem = async (req, res) => {
  const { restaurantId } = req.params;
  const { food, price, description } = req.body;

  try {
    // Find the restaurant by its ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    const newMenuItem = { food, price, description };
    restaurant.menu.push(newMenuItem);
    await restaurant.save();
    const addedItem = restaurant.menu[restaurant.menu.length - 1];

    res.status(200).json(addedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error: error.message });
  }
};


  // func to remove item from menu
  export const removeMenuItem = async (req, res) => {
    const { restaurantId, itemId } = req.params;

  try {
    // Find the restaurant by its ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Remove the item from the menu
    restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== itemId);

    // Save the restaurant document
    await restaurant.save();

    res.status(200).json({ message: 'Menu item removed successfully', restaurant });
  } catch (error) {
    res.status(500).json({ message: 'Error removing menu item', error: error.message });
  }
  };

  // Function to get the menu of a specific restaurant by ID
export const getMenuByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant.menu); // Return the menu
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
};


export const generateQRCode = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Create QR Code URL
    const url = `${process.env.FRONTEND_URL}/${restaurantId}`;
    const qrCode = await QRCode.toDataURL(url);

    res.status(200).json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: 'Error generating QR code', error: error.message });
  }
};


// Function to add a new order item to a specific restaurant
export const addOrderItem = async (req, res) => {
  const { restaurantId } = req.params;
  const { userId, items, description, tableNumber, totalCount, totalPrice  } = req.body;

  try {
    // Find the restaurant by its ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Push the new menu item into the restaurant's menu array
    restaurant.orders.push({ userId, items, description, tableNumber, totalCount, totalPrice });

    // Save the restaurant document
    await restaurant.save();
    const createdOrder = restaurant.orders[restaurant.orders.length - 1];

    res.status(200).json({ message: 'Order item added successfully', orderId: createdOrder._id });
  } catch (error) {
    res.status(500).json({ message: 'Error adding Order item', error: error.message });
  }
};


 // Function to get the orders of a specific restaurant by ID
 export const getOrderByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Sort orders by createdAt timestamp in descending order (latest order first)
    const sortedOrders = restaurant.orders.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const updateOrders = async (req, res) => {
  const { restaurantId, orderId } = req.params;
  const { status } = req.body;

  try {
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const order = restaurant.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await restaurant.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error });
  }
};

export const getSpecificOrder = async (req, res) => {
  const { restaurantId, orderId } = req.params;

  try {
    const restaurant = await RestaurantModel.findOne({ _id: restaurantId, 'orders._id': orderId }, { 'orders.$': 1 });

    if (!restaurant) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = restaurant.orders[0];

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// function to get orders of a specific users
export const getOrderOfSpecificUser = async (req, res) => {
  const { restaurantId, userId } = req.params;

  try {
    // Find the restaurant by its ID
    const restaurant = await RestaurantModel.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Filter the orders by userId
    const userOrders = restaurant.orders.filter(order => order.userId.toString() === userId);

    // If no orders found for the user
    if (userOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    // Return the filtered orders
    return res.status(200).json(userOrders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all restaurants that contain orders from the specified userId
    const restaurants = await RestaurantModel.find({ 'orders.userId': userId });

    // Extract the orders that belong to the specified userId
    const orders = restaurants.reduce((acc, restaurant) => {
      const userOrders = restaurant.orders.filter(order => order.userId.toString() === userId);
      return acc.concat(userOrders);
    }, []);

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the specified user.' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};
