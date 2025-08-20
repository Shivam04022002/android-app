import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from 'bcryptjs';


dotenv.config();

const run = async () => { 
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "demo@example.com" });
    if (existing) {
      console.log("Test user already exists");
      return process.exit();
    }

    const email= "dealer1@example.com";
    const plainPassword = "password123";

    const exist= await User.findOne({ email });
    if (exist) {
      console.log("Test user already exists");
      return process.exit();
    }
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      email,
      password: hashedPassword,
      userId: "SFDLR",//userId pattern for dealer 
      name: "Dealer1",
      District: "Test Region",
      Branch: "Test Branch",
      Contact: "1234567890",
    });
    console.log("Test user created successfully");
    process.exit();
  } catch (err) {
    console.error("Error creating test user:", err);
    process.exit(1);
  }
};

run();