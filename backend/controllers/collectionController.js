const BookCollection = require("../models/BookCollection");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

// Create Collection
const createCollection = async (req, res) => {
  try {
    const { collection_name, description, book_ids, visibility } = req.body;

    const newCollection = new BookCollection({
      user_id: req.user.id,
      collection_name,
      description,
      book_ids,
      visibility,
    });

    await newCollection.save();

    res.status(201).json(newCollection);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating collection",
      error,
    });
  }
};

// Get User Collections
const getUserCollections = async (req, res) => {
  try {
    const collections = await BookCollection.find({
      user_id: req.user.id,
    });

    res.json(collections);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching collections",
      error,
    });
  }
};

// Get Collection By Id
const getCollectionById = async (req, res) => {
  try {
    const collection = await BookCollection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    const isOwner =
      collection.user_id.toString() === req.user.id;

    if (collection.visibility === "private" && !isOwner) {
      return res.status(403).json({
        message:
          "This collection is private and can't be accessed.",
      });
    }

    res.json({collection, isOwner});
  } catch (error) {
    res.status(500).json({
      message: "Error fetching collection",
      error,
    });
  }
};

// Add Book To Collection
const addBookToCollection = async (req, res) => {
  try {
    const { book_ids } = req.body;

    const collection = await BookCollection.findById(
      req.params.id
    );

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    if (collection.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    book_ids.forEach((bookId) => {
      if (!collection.book_ids.includes(bookId)) {
        collection.book_ids.push(bookId);
      }
    });

    await collection.save();

    res.json(collection);
  } catch (error) {
    res.status(500).json({
      message: "Error updating collection",
      error,
    });
  }
};

// Delete Collection
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid collection ID",
      });
    }

    const collection = await BookCollection.findById(id);

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    if (collection.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await collection.deleteOne();

    res.json({
      message: "Collection deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting collection",
      error,
    });
  }
};

// Remove Book From Collection
const removeBookFromCollection = async (req, res) => {
  try {
    const { collectionId, bookId } = req.params;

    const collection = await BookCollection.findById(
      collectionId
    );

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    if (collection.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        message:
          "You do not have permission to modify this collection",
      });
    }

    
    collection.book_ids = collection.book_ids.filter(
      (id) => id !== bookId
    );

    await collection.save();

    res.json({
      message: "Book removed from collection",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error removing book from collection",
      error,
    });
  }
};

module.exports={createCollection,
  getUserCollections,
  getCollectionById,
  addBookToCollection,
  deleteCollection,
  removeBookFromCollection};