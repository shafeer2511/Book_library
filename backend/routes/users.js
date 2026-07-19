const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
    getProfile,
    updateProfile,
    changePassword,
    deleteProfile
} = require("../controllers/userController");

router.get(
    "/profile",
    authenticate,
    getProfile
);

router.put(
    "/profile",
    authenticate,
    updateProfile
);

router.put(
    "/profile/password",
    authenticate,
    changePassword
);

router.delete(
    "/profile",
    authenticate,
    deleteProfile
);

module.exports = router;