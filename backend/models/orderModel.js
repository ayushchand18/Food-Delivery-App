import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  // Office/Bulk ordering fields
  orderType: { type: String, enum: ["individual", "bulk"], default: "individual" },
  bulkOrderBy: { type: String, enum: ["company", "individual"] },
  companyName: { type: String },
  department: { type: String },
  companyDeliveryAddress: { type: String },
  companyFloor: { type: String },
  companyCity: { type: String },
  companyState: { type: String },
  companyPincode: { type: String },
  companyCountry: { type: String },
  companyEmail: { type: String },
  companyPhone: { type: String },
  contactName: { type: String },
  contactPhone: { type: String },
  deliveryTime: { type: Date },
  paymentMode: { type: String, enum: ["online", "cod", "invoice"], default: "online" },
  bulkNote: { type: String },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
