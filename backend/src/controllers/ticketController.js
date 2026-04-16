const { validationResult } = require("express-validator");
const Ticket = require("../models/Ticket");
const Comment = require("../models/Comment");

const validationError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return true;
  }
  return false;
};

const buildTicketFilters = (query, user) => {
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.priority) filters.priority = query.priority;
  if (query.category) filters.category = query.category;
  if (query.assignedTo) filters.assignedTo = query.assignedTo;

  if (query.search) {
    filters.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  if (user.role === "employee") {
    filters.createdBy = user._id;
  }

  return filters;
};

const createTicket = async (req, res, next) => {
  try {
    if (validationError(req, res)) return;

    const attachment = req.file ? `/uploads/${req.file.filename}` : "";

    const ticket = await Ticket.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority || "Medium",
      createdBy: req.user._id,
      attachment,
    });

    return res.status(201).json(ticket);
  } catch (error) {
    return next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const filters = buildTicketFilters(req.query, req.user);

    const tickets = await Ticket.find(filters)
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email role")
      .sort({ updatedAt: -1 });

    return res.status(200).json(tickets);
  } catch (error) {
    return next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("createdBy", "name email department")
      .populate("assignedTo", "name email role");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "employee" && `${ticket.createdBy._id}` !== `${req.user._id}`) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const comments = await Comment.find({ ticket: ticket._id })
      .populate("user", "name role")
      .sort({ createdAt: 1 });

    return res.status(200).json({ ticket, comments });
  } catch (error) {
    return next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "employee") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const allowedUpdates = ["status", "priority", "assignedTo", "category", "title", "description"];
    allowedUpdates.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        ticket[field] = req.body[field];
      }
    });

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email role");

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { message, isInternal } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "employee" && `${ticket.createdBy}` !== `${req.user._id}`) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const comment = await Comment.create({
      ticket: ticket._id,
      user: req.user._id,
      message,
      isInternal: req.user.role === "employee" ? false : Boolean(isInternal),
    });

    const fullComment = await Comment.findById(comment._id).populate("user", "name role");
    return res.status(201).json(fullComment);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
};
