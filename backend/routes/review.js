const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
  addReview,
  getReviews,
} = require("../controllers/reviewController");

router.post("/", authenticate, addReview);

router.get("/:book_id", getReviews);

module.exports = router;