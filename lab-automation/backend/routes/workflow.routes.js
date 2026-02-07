import express from "express";
import {
  sendToTesting,
  addTestResult,
  sendToCPRI,
  startCPRITesting,
  finalizeCPRIApproval,
} from "../controllers/workflow.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin routes
router.put(
  "/:id/send-to-testing",
  authMiddleware,
  authorizeRoles("Admin"),
  sendToTesting,
);
router.put(
  "/:id/send-to-cpri",
  authMiddleware,
  authorizeRoles("Admin"),
  sendToCPRI,
);

// Tester routes
router.post(
  "/add-test",
  authMiddleware,
  authorizeRoles("Tester"),
  addTestResult,
);

// Manager routes
router.put(
  "/:id/start-cpri-testing",
  authMiddleware,
  authorizeRoles("Manager"),
  startCPRITesting,
);
router.put(
  "/:id/finalize-cpri",
  authMiddleware,
  authorizeRoles("Manager"),
  finalizeCPRIApproval,
);

export default router;
