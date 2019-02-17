const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation")

router.get("/users/signup", userController.signUp);
router.post("/user", validation.validateUsers, userController.create);
router.get("/users/signIn", userController.signInForm);
router.post("/users/signIn", validation.validateSigninUsers, userController.signIn);
router.get("/users/signOut", userController.signOut);
router.get("/users/downgrade", userController.downgradePage);
router.post("/users/downgrade", userController.downgrade);
router.get("/users/upgrade", userController.upgradePage);
router.post("/users/upgrade", userController.upgrade);

module.exports = router;
