// models/VehicleDetails.js
import mongoose from "mongoose";

const vehicleDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    UserId: String,
    Name: String,
    District: String,
    Branch: String,
    Contact: String,
  },
  formId: String,
  brandName: String,
  modelName: String,
  priceOfVehicle: String,
  financeRequired: String,
  tenure: String,
}, { timestamps: true });

export default mongoose.model("VehicleDetails", vehicleDetailsSchema);
