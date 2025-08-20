import CoApplicant from "../models/CoApplicant.js";

// Save co-applicant form data
export const saveCoApplicant = async (req, res) => {
  try {
    const {
      photo,
      name,
      fatherName,
      dateOfBirth,
      aadharNo,
      panNo,
      address,
      pincode,
      policeStation,
      aadharFront,
      aadharBack,
      panImage,
      form60,
      postOffice,
      relation,
      documentType,
      formId
    } = req.body;

    const userId = req.user._id; // From middleware

    const newCoApplicant = new CoApplicant({
      user: userId,
      formId,
      photo,
      name,
      fatherName,
      dateOfBirth,
      aadharNo,
      panNo,
      address,
      pincode,
      policeStation,
      aadharFront,
      aadharBack,
      panImage,
      form60,
      postOffice,
      relation,
      documentType
    });

    await newCoApplicant.save();

    res.status(201).json({ message: "Co-applicant details saved successfully", coApplicant: newCoApplicant });
  } catch (error) {
    console.error("Error saving co-applicant:", error);
    res.status(500).json({ error: "Something went wrong while saving co-applicant" });
  }
};
