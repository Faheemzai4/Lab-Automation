import express from "express";
import {
  getPendingTestingProducts,
  markProductAsTested,
} from "../controllers/testing.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/pending", authMiddleware, getPendingTestingProducts);
router.put("/tested/:id", authMiddleware, markProductAsTested);

export default router;
