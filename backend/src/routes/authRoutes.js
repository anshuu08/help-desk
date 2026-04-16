const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const {
  registerEmployee,
  loginEmployee,
  loginAdmin,
  getMe,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("department").optional().isString(),
  ],
  registerEmployee
);

router.post(
  "/login/employee",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginEmployee
);

router.post(
  "/login/admin",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginAdmin
);

router.get("/me", auth, getMe);

module.exports = router;
