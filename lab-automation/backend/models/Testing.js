import mongoose from "mongoose";

const testingSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    testedBy: { type: String, required: true },
    testType: { type: String },
    result: { type: String, enum: ["Pass", "Fail"], default: "Pass" },
    remarks: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Testing", testingSchema);
