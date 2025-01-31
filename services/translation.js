const translate = require("google-translate-api");

exports.translateText = async (text, lang) => {
  try {
    const result = await translate(text, { to: lang });
    return result.text;
  } catch (error) {
    console.log("translation Failed!");
    return text;
  }
};
