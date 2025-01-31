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
      question: faq.getTranslatedQuestion(lang)
    }));
    //add in redis
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
      translations[lang] = await translateText(question, lang);
    }

    const newFAQ = new FAQ({ question, answer, translations });

    // Checking if FAQs are cached in Redis
    const cacheKeys = ["en", "hi", "bn", "es"].map(lang => `faqs_${lang}`);

    for (const cacheKey of cacheKeys) {
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        const faqs = JSON.parse(cachedData);
        faqs.push({ ...newFAQ.toObject(), question: newFAQ.getTranslatedQuestion(cacheKey.split("_")[1]) });

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
