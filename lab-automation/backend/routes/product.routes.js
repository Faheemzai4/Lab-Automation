import express from "express";
import {
  addProduct,
  getProducts,
  getProductById,
  updateProductWorkflow,
} from "../controllers/product.controller.js";
import { getProductsForTesting } from "../controllers/product.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addProduct);
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);
router.get(
  "/for-testing",
  authMiddleware,
  authorizeRoles("Tester"),
  getProductsForTesting,
);
router.put("/:id/workflow", authMiddleware, updateProductWorkflow);

export default router;
