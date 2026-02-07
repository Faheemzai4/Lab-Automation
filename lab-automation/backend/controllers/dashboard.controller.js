import Product from "../models/Product.js";
import Testing from "../models/Testing.js";
import CPRI from "../models/CPRI.js";
import ReManufacturing from "../models/ReManufacturing.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const passedTests = await Testing.countDocuments({ result: "Pass" });
    const failedTests = await Testing.countDocuments({ result: "Fail" });

    const pendingTests = await Product.countDocuments({
      status: {
        $in: ["Pending", "Under Testing", "Failed Testing", "CPRI Testing"],
      },
    });

    const approvedCPRI = await CPRI.countDocuments({
      approvalStatus: "Approved",
    });

    const reManufacturing = await ReManufacturing.countDocuments({
      sentForRemanufacture: true,
    });

    res.json({
      totalProducts,
      passedTests,
      failedTests,
      pendingTests,
      approvedCPRI,
      reManufacturing,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
