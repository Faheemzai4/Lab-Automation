import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPendingReManufacturingProducts,
  sendToReManufacturing,
} from "../controllers/reManufacturing.controller.js";

const router = express.Router();

router.get("/pending", authMiddleware, getPendingReManufacturingProducts);
router.put("/:id", authMiddleware, sendToReManufacturing);

export default router;
