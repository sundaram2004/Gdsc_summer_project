import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import handler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();

const PASSWORD_HASH_SALT_ROUNDS = 10;

export const loginUser = handler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.send(generateTokenResponse(user));
    return;
  }
  res.status(400).send("Username or password is invalid");
});


export const registerUser = handler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  
  const user = await UserModel.findOne({ email });
  
  if (user) {
    res.status(400).send("User already exists, please login!");
    return;
  }
  
  const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);
  
  const newUser = {
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    isAdmin,
  };
  
  const result = await UserModel.create(newUser);
  res.send(generateTokenResponse(result));
});

const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.SECERET_KEY,
    {
      expiresIn: "30d",
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    token,
  };
};