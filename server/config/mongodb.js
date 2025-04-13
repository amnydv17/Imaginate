import mongoose from "mongoose";   

// Connect to MongoDB
const connectDB = async () => {
  // get the connection event and display msg when db connected
  mongoose.connection.on("connected", () => console.log("Database Connected"));
  await mongoose.connect(`${process.env.MONGODB_URI}/imaginate`);
};

export default connectDB;