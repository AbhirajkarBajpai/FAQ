const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: { 
    type: Map, 
    of: { 
      question: String, 
      answer: String 
    }
  },
}, { timestamps: true });

faqSchema.methods.getTranslatedQuestion = function (lang) {
  return this.translations.get(lang)?.question || this.question;
};

faqSchema.methods.getTranslatedAnswer = function (lang) {
  return this.translations.get(lang)?.answer || this.answer;
};

module.exports = mongoose.model("FAQ", faqSchema);
