// models/pendingFiles.js
import mongoose from "mongoose";

const pendingFilesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicant: {
      name: String,
      email: String,
      phone: String,
      pan: String,
      form60: String,
      // add other applicant fields as per your applications collection
    },
    coApplicant: {
      name: String,
      email: String,
      phone: String,
      pan: String,
      form60: String,
      // add other co-applicant fields as needed
    },
    vehicleDetails: {
      brandName: String,
      modelName: String,
      priceOfVehicle: String,
      financeRequired: String,
      tenure: String,
      // add other vehicle fields as needed
    },
    workflowStage: {
      type: String,
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "applications" } // Important: points to existing collection
);

const PendingFiles = mongoose.model("PendingFiles", pendingFilesSchema);

export default PendingFiles;
