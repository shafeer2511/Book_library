const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
  try {
    const { book_id, rating, review_text } = req.body;

    const newReview = new Review({
      user: req.user.id,
      book_id,
      rating,
      review_text,
    });

    await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);

    res.status(500).json({
      message: "Error adding review",
      error,
    });
  }
};

// Get Reviews of a Book
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      book_id: req.params.book_id,
    })
      .populate("user", "user_name")
      .sort({ timestamp: -1 });

    const ratingData = await Review.aggregate([
      {
        $match: {
          book_id: req.params.book_id,
        },
      },
      {
        $group: {
          _id: null,
          avgRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    const averageRating =
      ratingData.length > 0
        ? ratingData[0].avgRating.toFixed(1)
        : "0.0";

    res.status(200).json({
      reviews,
      averageRating,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports={addReview,getReviews};