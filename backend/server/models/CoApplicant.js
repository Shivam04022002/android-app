import mongoose from "mongoose";

const coApplicantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  formId: String,
  photo: String,
  name: String,
  fatherName: String,
  dateOfBirth: Date,
  aadharNo: String,
  panNo: String,
  address: String,
  pincode: String,
  policeStation: String,
  aadharFront: String,
  aadharBack: String,
  panImage: String,
  postOffice: String,
  form60: String,
  documentType: String,
  relation: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CoApplicant", coApplicantSchema);