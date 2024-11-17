
import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    items: [
      {
        food: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    description: {type: String, required: true},
    tableNumber: {type: String, required: true},
    totalCount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  },
  {
    timestamps: true,
  }
);

const menuSchema = new mongoose.Schema(
  {
    food: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const restaurantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    menu: [menuSchema], 
    orders: [orderSchema],
    promotions: [promotionSchema],
  },
  {
    timestamps: true,
  }
);

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
export default RestaurantModel;
