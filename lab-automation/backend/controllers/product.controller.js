import Product from "../models/Product.js";
import { generateProductCode } from "../utils/generateProductCode.js";

export const addProduct = async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const { productName, revision, manufacturingUnit } = req.body;
    const productCode = generateProductCode();

    const product = new Product({
      productCode,
      productName,
      revision,
      manufacturingUnit,
      status: "Manufactured",
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProductWorkflow = async (req, res) => {
  try {
    const { action } = req.body;

    if (req.user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Only Admin can perform workflow actions" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    switch (action) {
      case "SendToTesting":
        if (product.status !== "Manufactured")
          return res
            .status(400)
            .json({ message: "Product must be Manufactured" });
        product.status = "Under Testing";
        break;

      case "SendToCPRI":
        if (product.status !== "Passed Internal Testing")
          return res
            .status(400)
            .json({ message: "Product must pass internal testing first" });
        product.status = "Sent to CPRI";
        break;

      case "SendToReManufacturing":
        if (product.status !== "Failed Testing")
          return res.status(400).json({
            message: "Only failed products can be sent to Re-Manufacturing",
          });
        product.status = "Re-Manufacturing";
        break;

      default:
        return res.status(400).json({ message: "Invalid workflow action" });
    }

    await product.save();
    res.status(200).json({ message: "Product workflow updated", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductsForTesting = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("Fetching products for testing...");

    const products = await Product.find({ status: "Under Testing" }).select(
      "productCode productName status",
    );

    console.log("Products fetched:", products);

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products for testing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
