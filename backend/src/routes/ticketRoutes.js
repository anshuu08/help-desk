const express = require("express");
const { body } = require("express-validator");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  addComment,
} = require("../controllers/ticketController");

const router = express.Router();

router.use(auth);

router.get("/", getTickets);
router.get("/:id", getTicketById);

router.post(
  "/",
  upload.single("attachment"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category")
      .isIn(["Laptop", "Printer", "Wi-Fi", "Software", "Login/Password", "Hardware", "Network", "Other"])
      .withMessage("Invalid category"),
    body("priority").optional().isIn(["Low", "Medium", "High", "Critical"]),
  ],
  createTicket
);

router.patch(
  "/:id",
  authorize("admin", "technician"),
  [
    body("status").optional().isIn(["Open", "In Progress", "Resolved", "Closed"]),
    body("priority").optional().isIn(["Low", "Medium", "High", "Critical"]),
  ],
  updateTicket
);

router.post("/:id/comments", addComment);

module.exports = router;
