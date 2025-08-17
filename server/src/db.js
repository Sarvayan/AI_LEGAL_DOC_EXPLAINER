import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const uri =
    "mongodb+srv://skajanan2022:2002%230601Kk%4001kk@kaja.lhpe2.mongodb.net/DocExplainer?retryWrites=true&w=majority&appName=Kaja";
  if (!uri) throw new Error("MONGODB_URI missing");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
};
