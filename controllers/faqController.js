const FAQ = require("../models/faqModel");
const { translateText } = require("../services/translation");

exports.getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await FAQ.find({});
    const translatedFAQs = faqs.map(faq => ({
      ...faq.toObject(),
      question: faq.getTranslatedQuestion(lang)
    }));
    res.json(translatedFAQs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const translations = {};
    
    const languages = ["hi", "bn", "es"]; 
    for (let lang of languages) {
      translations[lang] = await translateText(question, lang);
    }

    const newFAQ = new FAQ({ question, answer, translations });
    await newFAQ.save();

    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ error: "Error creating FAQ" });
  }
};
