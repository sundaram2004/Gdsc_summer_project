import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from './routes/authRoute.js';
import restaurantRoutes from './routes/restaurantRoute.js';
import paymentRoutes from './routes/paymentRoute.js';
import promotionRoute from './routes/promotionRoute.js';

dotenv.config();  //hello


const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL],
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(5003, () => console.log("Mongodb Connected")))
  .catch((error) => console.log(error));



app.use("/auth", authRoute);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/restaurants', promotionRoute);


