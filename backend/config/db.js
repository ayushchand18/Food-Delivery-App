import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      'mongodb+srv://ayushchand:Ayush.2290@cluster0.uz747p8.mongodb.net/Food-Delivery-main'
    )
    .then(() =>console.log("DB Connected"));
};
