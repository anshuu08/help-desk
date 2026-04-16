const express = require("express");
const auth = require("../middleware/auth");
const { chatWithBot } = require("../controllers/botController");

const router = express.Router();

router.use(auth);
router.post("/chat", chatWithBot);

module.exports = router;
