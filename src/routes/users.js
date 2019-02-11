const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validation = require("./validation")

router.get("/users/signup", userController.signUp);
router.post("/user", validation.validateUsers, userController.create);
router.get("/users/signIn", userController.signInForm);
router.post("/users/signIn", validation.validateUsers, userController.signIn);
router.get("/users/signOut", userController.signOut);
router.get("/users/:id/downgrade", userController.downgradePage);
router.post("/users/:id/downgrade", userController.downgrade);
router.get("/users/:id/upgrade", userController.upgradePage);
router.post("/users/:id/upgrade", userController.upgrade);

module.exports = router;
