import express from "express";
import {
  authenticate,
  authorizeRole,
} from "../infrastructure/middlewares/auth.middleware.js";
import {
  deleteMe,
  getAllUsers,
  getMe,
  updateMe,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/api/users/me", authenticate, getMe);
router.patch("/api/users/me", authenticate, updateMe);
router.delete("/api/users/me", authenticate, deleteMe);
router.get("/api/users", authenticate, authorizeRole("admin"), getAllUsers);

export default router;
