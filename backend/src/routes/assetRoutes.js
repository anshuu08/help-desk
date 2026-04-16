const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  addRepairLog,
  getWarrantyAlerts,
} = require("../controllers/assetController");

const router = express.Router();

router.use(auth);

router.get("/", getAssets);
router.get("/warranty-alerts", authorize("admin", "technician"), getWarrantyAlerts);
router.get("/:id", getAssetById);

router.post(
  "/",
  authorize("admin", "technician"),
  [
    body("assetName").trim().notEmpty().withMessage("Asset name is required"),
    body("assetType")
      .isIn(["Laptop", "Desktop", "Router", "Printer", "Monitor", "Keyboard", "Mouse", "Server", "Mobile Device"])
      .withMessage("Invalid asset type"),
    body("serialNumber").trim().notEmpty().withMessage("Serial number is required"),
    body("purchaseDate").isISO8601().withMessage("Invalid purchase date"),
    body("warrantyExpiryDate").isISO8601().withMessage("Invalid warranty expiry date"),
  ],
  createAsset
);

router.patch("/:id", authorize("admin", "technician"), updateAsset);
router.delete("/:id", authorize("admin"), deleteAsset);
router.post("/:id/repair-logs", authorize("admin", "technician"), addRepairLog);

module.exports = router;
