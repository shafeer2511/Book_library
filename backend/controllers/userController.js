const User = require("../models/User");
const BookCollection=require("../models/BookCollection");
const Review = require("../models/Review");
const bcrypt = require("bcrypt");

// GET PROFILE
const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });

    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {

    try {

        const { user_name, email, genres } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.user_name = user_name || user.user_name;
        user.email = email || user.email;
        user.genres = genres || user.genres;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error updating profile",
            error
        });

    }

};

// CHANGE PASSWORD
const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Incorrect current password"
            });

        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        res.json({
            message: "Password updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

// DELETE ACCOUNT
const deleteProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Delete all collections created by the user
        await BookCollection.deleteMany({
            user_id: userId
        });

        // Delete all reviews written by the user
        await Review.deleteMany({
            user: userId
        });

        // Delete the user account
        await User.findByIdAndDelete(userId);

        res.json({
            message: "Account and related data deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error deleting account"
        });

    }

};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    deleteProfile
};