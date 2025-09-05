// controllers/pendingFilesController.js
import PendingFiles from "../models/pendingFiles.js";

// Get all pending files
export const getPendingFiles = async (req, res) => {
  try {
    const pendingFiles = await PendingFiles.find({ status: "pending" })
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

// Get a single pending file by ID
export const getPendingFileById = async (req, res) => {
  try {
    const file = await PendingFiles.findById(req.params.id)
      .populate("user", "name email");

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json(file);
  } catch (error) {
    console.error("Error fetching file by ID:", error);
    res.status(500).json({ message: "Server error fetching file" });
  }
};
