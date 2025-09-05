// routes/pendingFilesRoutes.js
import express from "express";
import { getPendingFiles } from "../controllers/pendingFilesController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// GET all pending files (protected route)
router.get("/", requireAuth, getPendingFiles);

export default router;
