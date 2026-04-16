const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const { listUsers, createTechnician, updateUser } = require("../controllers/userController");

const router = express.Router();

router.use(auth, authorize("admin"));

router.get("/", listUsers);

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["technician", "admin"]),
  ],
  createTechnician
);

router.patch("/:id", updateUser);

module.exports = router;
