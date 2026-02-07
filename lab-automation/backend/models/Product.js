import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    revision: { type: String, default: "R1" },
    manufacturingUnit: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "Manufactured",
        "Under Testing",
        "Failed Testing",
        "Re-manufacturing",
        "Passed Internal Testing",
        "Sent to CPRI",
        "CPRI Testing",
        "Approved",
        "Rejected",
      ],
      default: "Manufactured",
    },

    certificateNumber: { type: String },
    cpriApprovedAt: { type: Date },
    cpriApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
