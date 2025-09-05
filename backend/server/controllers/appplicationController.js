import Application from "../models/Application.js";
import CoApplicant from "../models/CoApplicant.js";
import VehicleDetails from "../models/VehicleDetails.js";

// Full application (applicant + coApplicant + vehicleDetails)
export const submitApplication = async (req, res) => {
console.log(" Inside submitApplication controller");
  console.log("req.body:", req.body);
  console.log("req.user:", req.user);
  
  try {
    const { applicant, coApplicant, vehicleDetails } = req.body;
    const userId = req.user._id;

    if (!applicant || !coApplicant || !vehicleDetails) {
      return res.status(400).json({ error: "Incomplete application data" });
    }

    const application = new Application({
      user: userId,
      applicantFormId: applicant.formId,
      coApplicantFormId: coApplicant.formId,
      coApplicantName: coApplicant.name,
      applicant,
    });

    const coApplicantEntry = new CoApplicant({
      ...coApplicant,
      user: userId,
    });

    const vehicleEntry = new VehicleDetails({
      ...vehicleDetails,
      user: userId,
    });

    await application.save();
    await coApplicantEntry.save();
    await vehicleEntry.save();

    res.status(201).json({ message: "Application submitted successfully", applicationId: application._id });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Vehicle only
export const submitVehicleDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { brandName, modelName, priceOfVehicle, financeRequired, tenure, formId } = req.body;
    if (!formId) {
      return res.status(400).json({ error: "formId is required" });
    }
    const vehicleEntry = new VehicleDetails({
      ...req.body,
      user: userId,
    });
    await vehicleEntry.save();
    res.status(201).json({ message: "Vehicle details submitted successfully", vehicleId: vehicleEntry._id });
  } catch (error) {
    console.error("Error submitting vehicle details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPendingApplications = async (req, res) => {
  try {
    // Only fetch applications where status is "pending"
    const pendingApps = await Application.find({ status: "pending" });
    res.json(pendingApps);
  } catch (error) {
    console.error("Error fetching pending applications:", error);
    res.status(500).json({ error: "Server error" });
  }
};