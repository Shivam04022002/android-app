import mongoose from "mongoose";

// Main DB (for dealer)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`Main MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Main DB connection error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;

