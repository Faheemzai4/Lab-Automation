import Product from "../models/Product.js";

export const getPendingCpriProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "Sent to CPRI" }).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to fetch CPRI pending products:", err);
    res.status(500).json({ message: "Failed to load products", error: err });
  }
};

export const handleCpriApproval = async (req, res) => {
  try {
    const { approvalStatus } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (approvalStatus === "Approved") {
      product.status = "Approved";
      product.certificateNumber = `CPRI-${Math.floor(1000 + Math.random() * 9000)}`;
      product.cpriApprovedAt = new Date();
      product.cpriApprovedBy = req.user._id;
    } else {
      product.status = "Rejected";
    }

    await product.save();
    res
      .status(200)
      .json({ message: `Product ${approvalStatus.toLowerCase()}`, product });
  } catch (err) {
    console.error("Failed to update CPRI approval:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
