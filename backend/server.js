import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import groupRouter from "./routes/groupOrderRoute.js";

// app config
const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(cors({
  origin: ['https://food-delivery-app-beta-eight.vercel.app/'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  
}));

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/group", groupRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});


app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});

