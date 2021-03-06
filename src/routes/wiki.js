const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const helper = require ("../auth/helpers");
const validation = require("./validation")

router.get("/wikis", wikiController.index);
router.get("/wikis/private", wikiController.privateIndex);
router.get("/wikis/new", wikiController.new);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", helper.ensureAuthenticated,wikiController.edit);
router.post("/wikis/create", helper.ensureAuthenticated,validation.validateWikis, wikiController.create);
router.post("/wikis/:id/destroy", helper.ensureAuthenticated,wikiController.destroy);
router.post("/wikis/:id/update", wikiController.update);


module.exports = router;
