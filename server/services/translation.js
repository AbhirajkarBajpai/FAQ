const axios = require("axios");
require("dotenv").config();
const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

exports.translateText = async (text, targetLang) => {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  try {
    const response = await axios.post(url, {
      q: text,
      target: targetLang,
    });
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(
      "Translation API Error:",
      error.response ? error.response.data : error.message
    );
    return text;
  }
};
