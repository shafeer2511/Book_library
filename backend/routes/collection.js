const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
  createCollection,
  getUserCollections,
  getCollectionById,
  addBookToCollection,
  deleteCollection,
  removeBookFromCollection,
} = require("../controllers/collectionController");

router.post("/", authenticate, createCollection);

router.get("/", authenticate, getUserCollections);

router.get("/:id", authenticate, getCollectionById);

router.put("/:id", authenticate, addBookToCollection);

router.delete("/:id", authenticate, deleteCollection);

router.delete("/:collectionId/book/:bookId",authenticate, removeBookFromCollection);

module.exports = router;