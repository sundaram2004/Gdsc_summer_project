import RestaurantModel from "../models/restaurantModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();


const stripe = new Stripe(
  "sk_test_51PXdbsKsLOwdkUkUQHxmTPJod6qCZua6rnBHdGaozSEHD9BGX0GrKSm0BbxfP9ysGntCVWtfMpBoPJpWDWzsUgOr00NwiD7kAT"
);


export const createPaymentIntent = async (req, res) => {
  const {
    orderItems,
    selectedRestaurantId,
    orderId
  } = req.body;

  const lineItems = orderItems.map((orderItem) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: orderItem.food,
      },
      unit_amount: orderItem.price * 100,
    },
    quantity: orderItem.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&selectedRestaurantId=${selectedRestaurantId}&orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// function for updating payment status
export const updatePaymentStatus = async (req, res) => {
  const { selectedRestaurantId, orderId } = req.params;

  try {
    const restaurant = await RestaurantModel.findById(selectedRestaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const order = restaurant.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    await restaurant.save();

    res.status(200).json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};
