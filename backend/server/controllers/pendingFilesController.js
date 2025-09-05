// controllers/pendingFilesController.js
import PendingFiles from "../models/pendingFiles.js";

// Fetch all pending application files
export const getPendingFiles = async (req, res) => {
  try {
    // Fetch all applications with workflowStage 'pending'
    const pendingFiles = await PendingFiles.find({ status: "pending" })
      .populate("user", "name email"); // optional: populate user info

    const file = await PendingFiles.findById(req.params.id)
      .populate("user", "name email");


    if (!pendingFiles || pendingFiles.length === 0) {
      return res.status(404).json({ message: "No pending files found" });
    }

    res.status(200).json(pendingFiles);
  } catch (error) {
    console.error("Error fetching pending files:", error);
    res.status(500).json({ message: "Server error fetching pending files" });
  }
};
