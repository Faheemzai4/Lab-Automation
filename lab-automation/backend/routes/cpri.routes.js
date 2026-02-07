import express from "express";
import {
  getPendingCpriProducts,
  handleCpriApproval,
} from "../controllers/cpri.controller.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/pending",
  authMiddleware,
  authorizeRoles("Manager"),
  getPendingCpriProducts,
);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("Manager"),
  handleCpriApproval,
);

export default router;
