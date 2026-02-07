import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { advancedSearchProducts } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/", authMiddleware, advancedSearchProducts);

export default router;
