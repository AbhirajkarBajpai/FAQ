const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  translations: { type: Map, of: String },
}, { timestamps: true });

faqSchema.methods.getTranslatedQuestion = function (lang) {
  return this.translations.get(lang) || this.question;
};

module.exports = mongoose.model("FAQ", faqSchema);
