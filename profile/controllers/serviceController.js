const Service = require("../models/Service");

//create a service
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, image } = req.body;
    if (!name || !description || !price || !duration || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all credentials!" });
    }

    const service = await Service.find({ name });
    if (service) {
      return res
        .status(400)
        .json({ success: false, message: "Service already exists!" });
    }
    const newService = new Service({
      name,
      description,
      price,
      duration,
      category,
      image,
      provider: req.user.id,
    });

    await newService.save();
    res
      .status(201)
      .json({ success: true, message: "Service created successifully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate(
      "provider",
      "email username"
    );
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get a single service by id
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id).populate(
      "provider",
      "username email"
    );

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found!" });
    }

    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// update a service

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found!" });
    }

    //only owner and an admin can update the service
    if (
      req.user.role !== "admin" &&
      service.provider.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized!" });
    }
    Object.assign(service, req.body);
    await service.save();
    res.status(200).json({
      success: true,
      message: "Service updated successifully!",
      data: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete a service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found!" });
    }

    //only owner and an admin can update the service
    if (
      req.user.role !== "admin" &&
      service.provider.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized!" });
    }

    await service.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
