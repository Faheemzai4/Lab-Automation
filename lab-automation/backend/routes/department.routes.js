import express from "express";
import {
  addDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";

import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addDepartment);
router.get("/", authMiddleware, getDepartments);
router.put("/:id", authMiddleware, updateDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
