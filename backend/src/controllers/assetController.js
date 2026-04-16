const { validationResult } = require("express-validator");
const Asset = require("../models/Asset");

const validationError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return true;
  }
  return false;
};

const buildAssetFilters = (query) => {
  const filters = {};
  if (query.assetType) filters.assetType = query.assetType;
  if (query.currentStatus) filters.currentStatus = query.currentStatus;
  if (query.assignedEmployee) filters.assignedEmployee = query.assignedEmployee;

  if (query.search) {
    filters.$or = [
      { assetName: { $regex: query.search, $options: "i" } },
      { serialNumber: { $regex: query.search, $options: "i" } },
      { vendorName: { $regex: query.search, $options: "i" } },
      { location: { $regex: query.search, $options: "i" } },
    ];
  }

  return filters;
};

const getAssets = async (req, res, next) => {
  try {
    const filters = buildAssetFilters(req.query);
    const assets = await Asset.find(filters)
      .populate("assignedEmployee", "name email department")
      .sort({ updatedAt: -1 });

    return res.status(200).json(assets);
  } catch (error) {
    return next(error);
  }
};

const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id).populate(
      "assignedEmployee",
      "name email department"
    );

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return res.status(200).json(asset);
  } catch (error) {
    return next(error);
  }
};

const createAsset = async (req, res, next) => {
  try {
    if (validationError(req, res)) return;
    const asset = await Asset.create(req.body);
    return res.status(201).json(asset);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Serial number must be unique" });
    }
    return next(error);
  }
};

const updateAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("assignedEmployee", "name email department");

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return res.status(200).json(asset);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Serial number must be unique" });
    }
    return next(error);
  }
};

const deleteAsset = async (req, res, next) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    return res.status(200).json({ message: "Asset deleted" });
  } catch (error) {
    return next(error);
  }
};

const addRepairLog = async (req, res, next) => {
  try {
    const { issue, action, technician, cost, note } = req.body;
    if (!issue || !action) {
      return res.status(400).json({ message: "Issue and action are required" });
    }

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.repairHistory.push({
      issue,
      action,
      technician: technician || req.user.name,
      cost: cost || 0,
      note: note || "",
    });

    asset.currentStatus = "Under Repair";
    await asset.save();

    const fullAsset = await Asset.findById(asset._id).populate("assignedEmployee", "name email department");
    return res.status(200).json(fullAsset);
  } catch (error) {
    return next(error);
  }
};

const getWarrantyAlerts = async (_req, res, next) => {
  try {
    const days = 30;
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(now.getDate() + days);

    const assets = await Asset.find({
      warrantyExpiryDate: { $gte: now, $lte: threshold },
    })
      .populate("assignedEmployee", "name email")
      .sort({ warrantyExpiryDate: 1 });

    return res.status(200).json(assets);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  addRepairLog,
  getWarrantyAlerts,
};
