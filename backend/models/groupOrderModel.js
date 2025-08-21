import mongoose from "mongoose";

const groupOrderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    quantity: { type: Number, default: 1 },
    addedBy: { type: String },
  },
  { _id: false }
);

const groupOrderSchema = new mongoose.Schema(
  {
    groupId: { type: String, unique: true, index: true },
    creatorUserId: { type: String, required: true },
    items: { type: [groupOrderItemSchema], default: [] },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

const groupOrderModel =
  mongoose.models.grouporder || mongoose.model("grouporder", groupOrderSchema);

export default groupOrderModel;


