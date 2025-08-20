import express from "express";
import upload from "../middleware/upload.js";
import requireAuth from "../middleware/requireAuth.js";
import { submitApplication, getPendingApplications } from "../controllers/appplicationController.js";




const router = express.Router();

// Auth middleware for all routes


// Image upload endpoint (POST /api/applications/upload-image)
router.post("/upload-image", upload.single("image"), (req, res) => {
console.log("POST /api/applications/upload-image called");

console.log("req.user:", req.user); // See if authentication worked
console.log("req.body:", req.body); // See what data you received
  console.log("req.file:", req.file); // See if the file was uploaded correctly
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // req.file.path contains the Cloudinary URL
  res.json({ url: req.file.path });
});

router.use(requireAuth);
router.get("/pending", getPendingApplications);
router.post("/submit",submitApplication)
console.log("POST /api/applications/submit called in applicationRoutes.js" );

// Application submission endpoint (POST /api/applications/submit)
router.post("/submit/vehicle", submitApplication);




export default router;