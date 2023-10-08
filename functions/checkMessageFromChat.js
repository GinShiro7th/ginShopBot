const Product = require("../db/products");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");
const { Op } = require("sequelize");

module.exports = async function (text, SellerId) {
  try {
    const productList = await Product.findAll({
      where: {
        SellerId,
      },
    });
    for (let product of productList) {
      const keywordsInfo = await Keyword.findAll({
        where: {
          ProductID: product.productID,
          UserID: SellerId,
        },
      });
      const minusKeywordsInfo = await MinusKeyword.findAll({
        where: {
          ProductID: product.productID,
          UserID: SellerId,
        },
      });
      const keywords = keywordsInfo.map((item) => item.Keyword.toLowerCase());
      const minusKeywords = minusKeywordsInfo.map((item) =>
        item.Keyword.toLowerCase()
      );

      async function checkWordInclusion(message, searchPhrases) {
        const lowerCasedMsg = message.toLowerCase();
        const wordsOfMsg = lowerCasedMsg.split(/\s+/);
        console.log(wordsOfMsg);
        return searchPhrases.some((pattern) => {
          const searchWords = pattern.split(' ');
          return searchWords.every(word => wordsOfMsg.includes(word));
        })
      }

      const containsKeywords = await checkWordInclusion(text, keywords);
      console.log("contain keywords", containsKeywords);

      const isStopWords = await checkWordInclusion(text, minusKeywords);
      console.log("contain minus keywords", isStopWords);

      if (containsKeywords && !isStopWords) {
        const name = product.Name;
        const price = product.Price;
        return name + " - " + price;
      }
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};
