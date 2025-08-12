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
    const newService = new Service({
      name,
      description,
      price,
      duration,
      category,
      image,
      provider: req.user._id,
    });

    res
      .status(201)
      .json({ success: true, message: "Service created successifully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// update a service
// delete a service


module.exports={createService}