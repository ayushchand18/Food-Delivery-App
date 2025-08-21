import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createGroup, getGroup, addItem, removeItem, closeGroup, importToCart } from "../controllers/groupOrderController.js";

const groupRouter = express.Router();

groupRouter.post("/create", authMiddleware, createGroup);
groupRouter.get("/:groupId", getGroup);
groupRouter.post("/:groupId/add", authMiddleware, addItem);
groupRouter.post("/:groupId/remove", authMiddleware, removeItem);
groupRouter.post("/:groupId/close", authMiddleware, closeGroup);
groupRouter.post("/:groupId/import", authMiddleware, importToCart);

export default groupRouter;


