import Product from "../models/Product.js";
import Testing from "../models/Testing.js";

export const getPendingTestingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: {
        $in: ["Pending", "Under Testing", "Failed Testing", "CPRI Testing"],
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to fetch testing products:", err);
    res.status(500).json({ message: "Failed to load products", error: err });
  }
};

export const markProductAsTested = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = "Manufactured";
    await product.save();

    await Testing.create({
      product: product._id,
      testedBy: req.user?.name || "Unknown Tester",
      testType: "Standard",
      result: "Pass",
    });

    res.status(200).json({ message: "Product marked as tested", product });
  } catch (err) {
    console.error("Failed to update product:", err);
    res.status(500).json({ message: "Failed to update product", error: err });
  }
};
