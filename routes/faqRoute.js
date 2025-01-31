const express = require("express");
const faqController = require("../controllers/faqController");
const router = express.Router();

router.get("/getFaq", faqController.getFAQs);
router.post("/addFaq", faqController.createFAQ);

module.exports = router;
