const Product = require("../db/products");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");
const GlobalMinusKeywords = require('../db/globalMinusKeywords');
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
      const globalMinusKeywordsInfo = await GlobalMinusKeywords.findAll({
        where: {
          FromUser: SellerId
        }
      });
      const keywords = keywordsInfo.map((item) => item.Keyword.toLowerCase());
      const minusKeywords = minusKeywordsInfo.map((item) =>
        item.MinusKeywords.toLowerCase()
      );
      const globalMinusKeywords = globalMinusKeywordsInfo.map((item => item.Keywords.toLowerCase()));
      async function checkWordInclusion(message, searchPhrases) {
        const lowerCasedMsg = message.toLowerCase();
        const wordsOfMsg = lowerCasedMsg.split(/\s+/);
        return searchPhrases.some((pattern) => {
          const searchWords = pattern.split(' ');
          return searchWords.every(word => wordsOfMsg.includes(word));
        })
      }

      const containsKeywords = await checkWordInclusion(text, keywords);
      console.log("contain keywords", containsKeywords);

      const isStopWords = await checkWordInclusion(text, minusKeywords);
      console.log("contain minus keywords", isStopWords);
      
      const isGlobalMinusKeywords = await checkWordInclusion(text, globalMinusKeywords);
      console.log("contain global minus keywords", isGlobalMinusKeywords);

      if (containsKeywords && !isStopWords && !isGlobalMinusKeywords) {
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
