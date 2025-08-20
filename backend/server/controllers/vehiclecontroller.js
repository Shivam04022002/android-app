import Vehicle from "../models/VehicleDetails.js";

// Save vehicle details submitted from frontend
export const saveVehicleDetails = async (req, res) => {
  try {
    const {
      formId,
      brandName,
      modelName,
      priceOfVehicle,
      financeRequired,
      tenure,
      user // 👈 full user object from frontend
    } = req.body;

    if (!user || !user.UserId) {
      return res.status(400).json({ error: "Missing dealer user information" });
    }

    const vehicle = new Vehicle({
      user, // 👈 full user object
      formId,
      brandName,
      modelName,
      priceOfVehicle,
      financeRequired,
      tenure,
    });

    await vehicle.save();

    res.status(201).json({ message: "Vehicle details saved successfully", vehicle });
  } catch (error) {
    console.error("Error saving vehicle details:", error);
    res.status(500).json({ error: "Something went wrong while saving vehicle details" });
  }
};
