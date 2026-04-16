const mongoose = require("mongoose");

const repairHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    technician: {
      type: String,
      default: "",
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true }
);

const assetSchema = new mongoose.Schema(
  {
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    assetType: {
      type: String,
      enum: ["Laptop", "Desktop", "Router", "Printer", "Monitor", "Keyboard", "Mouse", "Server", "Mobile Device"],
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    warrantyExpiryDate: {
      type: Date,
      required: true,
    },
    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    currentStatus: {
      type: String,
      enum: ["In Use", "Available", "Under Repair", "Retired"],
      default: "Available",
    },
    repairHistory: [repairHistorySchema],
    vendorName: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema);
