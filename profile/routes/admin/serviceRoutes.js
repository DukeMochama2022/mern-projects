const express = require("express");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");
const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../../controllers/serviceController");

const serviceRouter = express.Router();

serviceRouter.post("/create-service", authMiddleware, isAdmin, createService);
// services which are accessible to public
serviceRouter.get("/get-services", getServices);
serviceRouter.get("/get-service/:id", authMiddleware, getServiceById);
serviceRouter.put(
  "/update-service/:id",
  authMiddleware,
  isAdmin,
  updateService
);
serviceRouter.delete(
  "/delete-service/:id",
  authMiddleware,
  isAdmin,
  deleteService
);

module.exports = { serviceRouter };
