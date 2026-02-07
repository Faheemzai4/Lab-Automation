import Product from "../models/Product.js";

export const advancedSearchProducts = async (req, res) => {
  try {
    const {
      productCode,
      productName,
      revision,
      manufacturingUnit,
      status,
      testingId,
      testType,
      department,
      result,
      dateFrom,
      dateTo,
    } = req.query;

    const productFilter = {};
    if (productCode) productFilter.productCode = productCode;
    if (productName) productFilter.productName = new RegExp(productName, "i");
    if (revision) productFilter.revision = revision;
    if (manufacturingUnit) productFilter.manufacturingUnit = manufacturingUnit;
    if (status) productFilter.status = status;

    let query = Product.find(productFilter).sort({ createdAt: -1 });

    if (testingId || testType || department || result || dateFrom || dateTo) {
      const testMatch = {
        ...(testingId && { testingId }),
        ...(testType && { testType }),
        ...(department && { department }),
        ...(result && { result }),
        ...(dateFrom && { createdAt: { $gte: new Date(dateFrom) } }),
        ...(dateTo && { createdAt: { $lte: new Date(dateTo + "T23:59:59") } }),
      };

      query = query.populate({ path: "tests", match: testMatch });
    }

    const products = await query;

    res.status(200).json(products);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Search failed", error: err });
  }
};
