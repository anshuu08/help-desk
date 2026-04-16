const express = require("express");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { getAdminDashboard, getEmployeeDashboard } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/admin", auth, authorize("admin", "technician"), getAdminDashboard);
router.get("/employee", auth, authorize("employee"), getEmployeeDashboard);

module.exports = router;
