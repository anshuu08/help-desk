const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

const validationError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: "Validation failed", errors: errors.array() });
    return true;
  }
  return false;
};

const registerEmployee = async (req, res, next) => {
  try {
    if (validationError(req, res)) return;

    const { name, email, password, department } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await User.create({
      name,
      email,
      password,
      department,
      role: "employee",
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const loginByRole = async (req, res, next, allowedRoles) => {
  try {
    if (validationError(req, res)) return;

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !allowedRoles.includes(user.role) || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const loginEmployee = async (req, res, next) => loginByRole(req, res, next, ["employee"]);
const loginAdmin = async (req, res, next) => loginByRole(req, res, next, ["admin", "technician"]);

const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = {
  registerEmployee,
  loginEmployee,
  loginAdmin,
  getMe,
};
