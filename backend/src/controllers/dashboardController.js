const Ticket = require("../models/Ticket");
const Asset = require("../models/Asset");

const getAdminDashboard = async (_req, res, next) => {
  try {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      highPriorityTickets,
      totalAssets,
      statusBreakdown,
      categoryBreakdown,
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: "Open" }),
      Ticket.countDocuments({ status: "Resolved" }),
      Ticket.countDocuments({ priority: { $in: ["High", "Critical"] } }),
      Asset.countDocuments(),
      Ticket.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Ticket.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    return res.status(200).json({
      totalTickets,
      openTickets,
      resolvedTickets,
      highPriorityTickets,
      totalAssets,
      statusBreakdown,
      categoryBreakdown,
    });
  } catch (error) {
    return next(error);
  }
};

const getEmployeeDashboard = async (req, res, next) => {
  try {
    const [totalTickets, openTickets, inProgressTickets, resolvedTickets] = await Promise.all([
      Ticket.countDocuments({ createdBy: req.user._id }),
      Ticket.countDocuments({ createdBy: req.user._id, status: "Open" }),
      Ticket.countDocuments({ createdBy: req.user._id, status: "In Progress" }),
      Ticket.countDocuments({ createdBy: req.user._id, status: "Resolved" }),
    ]);

    return res.status(200).json({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAdminDashboard,
  getEmployeeDashboard,
};
