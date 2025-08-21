import groupOrderModel from "../models/groupOrderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import crypto from "crypto";

const generateGroupId = () => crypto.randomBytes(6).toString("hex");

const createGroup = async (req, res) => {
  try {
    const groupId = generateGroupId();
    const group = await groupOrderModel.create({
      groupId,
      creatorUserId: req.body.userId,
      items: [],
    });
    res.json({ success: true, data: { groupId: group.groupId } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const getGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await groupOrderModel.findOne({ groupId });
    if (!group) return res.json({ success: false, message: "Not found" });
    res.json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const addItem = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { itemId, quantity } = req.body;
    const group = await groupOrderModel.findOne({ groupId });
    if (!group || group.status !== "open") {
      return res.json({ success: false, message: "Group is closed or missing" });
    }
    const food = await foodModel.findById(itemId);
    if (!food) return res.json({ success: false, message: "Item not found" });
    const existingIndex = group.items.findIndex(
      (i) => i.itemId === itemId && i.addedBy === req.body.userId
    );
    if (existingIndex >= 0) {
      group.items[existingIndex].quantity += quantity || 1;
    } else {
      group.items.push({
        itemId,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: quantity || 1,
        addedBy: req.body.userId || "guest",
      });
    }
    await group.save();
    res.json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const removeItem = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { itemId } = req.body;
    const group = await groupOrderModel.findOne({ groupId });
    if (!group || group.status !== "open") {
      return res.json({ success: false, message: "Group is closed or missing" });
    }
    group.items = group.items.filter(
      (i) => !(i.itemId === itemId && i.addedBy === req.body.userId)
    );
    await group.save();
    res.json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const closeGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await groupOrderModel.findOne({ groupId });
    if (!group) return res.json({ success: false, message: "Not found" });
    if (group.creatorUserId !== req.body.userId) {
      return res.json({ success: false, message: "Not authorized" });
    }
    group.status = "closed";
    await group.save();
    res.json({ success: true, data: group });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const importToCart = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await groupOrderModel.findOne({ groupId });
    if (!group) return res.json({ success: false, message: "Not found" });
    if (group.creatorUserId !== req.body.userId) {
      return res.json({ success: false, message: "Not authorized" });
    }
    if (group.items.length === 0) {
      return res.json({ success: false, message: "No items to import" });
    }
    // Build a cart map by itemId
    const cartMap = {};
    for (const it of group.items) {
      cartMap[it.itemId] = (cartMap[it.itemId] || 0) + (it.quantity || 1);
    }
    // Merge into user's cart
    const user = await userModel.findById(req.body.userId);
    const current = user.cartData || {};
    for (const key of Object.keys(cartMap)) {
      current[key] = (current[key] || 0) + cartMap[key];
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: current });
    res.json({ success: true, message: "Imported to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { createGroup, getGroup, addItem, removeItem, closeGroup, importToCart };


