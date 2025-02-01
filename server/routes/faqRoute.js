const express = require("express");
const faqController = require("../controllers/faqController");
const router = express.Router();

router.get("/getFaq", faqController.getFAQs);
router.post("/addFaq", faqController.createFAQ);
router.put("/updateFaq/:faqId", faqController.updateFAQ);
router.delete("/deleteFaq/:faqId", faqController.deleteFAQ);
module.exports = router;
