import mongoose from "mongoose";

const reManufacturingSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reason: { type: String },
    sentForRemanufacture: { type: Boolean, default: false },
    status: { type: String, default: "Pending" },
    testType: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("ReManufacturing", reManufacturingSchema);
