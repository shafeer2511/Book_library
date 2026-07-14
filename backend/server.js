// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const collectionRoutes = require("./routes/collection");
const reviewRoutes = require("./routes/review");
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB successfully", process.env.MONGO_URI))
  .catch((err) => console.error("MongoDB connection error:", err));

console.log("Connection test", process.env.MONGO_URI);

// CORS setup
const cors = require('cors');
const corsOptions = {
  origin: true, // Allows access from any origin
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/reviews", reviewRoutes); // New review routes
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
