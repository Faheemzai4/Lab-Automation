import Product from "../models/Product.js";
import ReManufacturing from "../models/ReManufacturing.js";

export const getPendingReManufacturingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: { $ne: "Manufactured" },
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to fetch non-manufactured products:", err);
    res.status(500).json({ message: "Failed to load products", error: err });
  }
};

export const sendToReManufacturing = async (req, res) => {
  try {
    const { reason } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = "Re-manufacturing";
    product.reManufacturingReason = reason;
    await product.save();

    let remanufacturing = await ReManufacturing.findOne({ productId });
    if (!remanufacturing) {
      remanufacturing = new ReManufacturing({
        productId,
        reason,
        status: "Pending",
      });
    } else {
      remanufacturing.reason = reason;
      remanufacturing.status = "Pending";
    }
    await remanufacturing.save();

    res
      .status(200)
      .json({ message: "Product sent for Re-Manufacturing", remanufacturing });
  } catch (err) {
    console.error("Failed to send product for Re-Manufacturing:", err);
    res.status(500).json({ message: "Failed to send product", error: err });
  }
};
