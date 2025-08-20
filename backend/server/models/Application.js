import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applicantFormId: String,
  coApplicantFormId: String,
  coApplicantName: String,
  applicant: {
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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Applicant", applicationSchema);
