const FAQ = require("../models/faqModel");
const { translateText } = require("../services/translation");
const redisClient = require("../redisClient");

exports.getFAQs = async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const cacheKey = `faqs_${lang}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));

    const faqs = await FAQ.find({});
    const translatedFAQs = faqs.map(faq => ({
      ...faq.toObject(),
      question: faq.getTranslatedQuestion(lang),
      answer: faq.getTranslatedAnswer(lang),
    }));

    // Add to Redis cache
    await redisClient.set(cacheKey, JSON.stringify(translatedFAQs), "EX", 3600);
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
      const translatedQuestion = await translateText(question, lang);
      const translatedAnswer = await translateText(answer, lang);
      translations[lang] = { question: translatedQuestion, answer: translatedAnswer };
    }

    const newFAQ = new FAQ({ question, answer, translations });

    // Check if FAQs are cached in Redis for different languages
    const cacheKeys = ["en", "hi", "bn", "es"].map(lang => `faqs_${lang}`);

    for (const cacheKey of cacheKeys) {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        const faqs = JSON.parse(cachedData);
        faqs.push({ 
          ...newFAQ.toObject(), 
          question: newFAQ.getTranslatedQuestion(cacheKey.split("_")[1]),
          answer: newFAQ.getTranslatedAnswer(cacheKey.split("_")[1])
        });

        // Update Redis with new FAQ list
        await redisClient.set(cacheKey, JSON.stringify(faqs), "EX", 3600);
      }
    }

    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ error: "Error creating FAQ" });
  }
};

exports.updateFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer } = req.body;

    const faq = await FAQ.findById(faqId);
    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;

    const translations = faq.translations || {};

    const languages = ["hi", "bn", "es"]; 
    for (let lang of languages) {
      if (question) {
        translations[lang].question = await translateText(question, lang);
      }
      if (answer) {
        translations[lang].answer = await translateText(answer, lang);
      }
    }

    faq.translations = translations;
    await faq.save();

    // Invalidate cache for all languages
    const cacheKeys = ["en", "hi", "bn", "es"].map(lang => `faqs_${lang}`);
    for (const cacheKey of cacheKeys) {
      await redisClient.del(cacheKey); // Remove cache 
    }

    // Update Redis
    const faqs = await FAQ.find({});
    const translatedFAQs = faqs.map(faq => ({
      ...faq.toObject(),
      question: faq.getTranslatedQuestion("en"),
      answer: faq.getTranslatedAnswer("en"),
    }));
    
    await redisClient.set(`faqs_en`, JSON.stringify(translatedFAQs), "EX", 3600);

    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ error: "Error updating FAQ" });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const { faqId } = req.params;
    const faq = await FAQ.findByIdAndDelete(faqId);

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    // Invalidate cache for all languages
    const cacheKeys = ["en", "hi", "bn", "es"].map(lang => `faqs_${lang}`);
    for (const cacheKey of cacheKeys) {
      await redisClient.del(cacheKey); // Remove cache for all languages
    }

    // Update Redis with the remaining FAQ list after deletion
    const faqs = await FAQ.find({});
    const translatedFAQs = faqs.map(faq => ({
      ...faq.toObject(),
      question: faq.getTranslatedQuestion("en"),
      answer: faq.getTranslatedAnswer("en"),
    }));

    await redisClient.set(`faqs_en`, JSON.stringify(translatedFAQs), "EX", 3600);

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting FAQ" });
  }
};