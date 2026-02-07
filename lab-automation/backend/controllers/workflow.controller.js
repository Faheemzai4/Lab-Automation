import Product from "../models/Product.js";
import Testing from "../models/Testing.js";

export const sendToTesting = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.status !== "Manufactured")
    return res
      .status(400)
      .json({ message: "Only manufactured products can go to testing" });

  product.status = "Under Testing";
  await product.save();
  res.json({ message: "Product moved to testing", product });
};

export const addTestResult = async (req, res) => {
  const { productId, testType, result, remarks } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.status !== "Under Testing")
    return res.status(400).json({ message: "Product is not under testing" });

  const test = new Testing({ product, testType, result, remarks });
  await test.save();

  product.status =
    result === "Pass" ? "Passed Internal Testing" : "Failed Testing";
  await product.save();

  res
    .status(201)
    .json({ message: "Test added and product status updated", test, product });
};

export const sendToCPRI = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.status !== "Passed Internal Testing")
    return res.status(400).json({
      message: "Only products that passed internal testing can be sent to CPRI",
    });

  product.status = "Sent to CPRI";
  await product.save();

  res
    .status(200)
    .json({ message: "Product successfully sent to CPRI", product });
};

export const startCPRITesting = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.status !== "Sent to CPRI")
    return res
      .status(400)
      .json({ message: "Product is not ready for CPRI testing" });

  product.status = "CPRI Testing";
  await product.save();
  res.json({ message: "CPRI testing started", product });
};

export const finalizeCPRIApproval = async (req, res) => {
  const { approvalStatus } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.status !== "CPRI Testing")
    return res
      .status(400)
      .json({ message: "Product is not under CPRI testing" });

  if (approvalStatus === "Approved") product.status = "Approved";
  else if (approvalStatus === "Rejected") product.status = "Rejected";
  else return res.status(400).json({ message: "Invalid approval status" });

  await product.save();
  res.json({ message: `Product ${approvalStatus}`, product });
};
