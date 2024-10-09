import mongoose from "mongoose";

const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_ATLAS);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error in DB Connection", error);
  }
}

export default DBConnection;
