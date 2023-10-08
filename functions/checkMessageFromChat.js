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
        const lowercasedMessage = message.toLowerCase();
        return searchPhrases.some((phrase) => {
          const words = phrase.toLowerCase().split(" ");
          return words.every((word) => lowercasedMessage.includes(word));
        });
      }

      async function checkStopWordInclusion(message, searchPhrases) {
        const lowercasedMessage = message.toLowerCase();
        return searchPhrases.some((phrase) => {
          const words = phrase.toLowerCase().split(" ");
          return words.every((word) => lowercasedMessage.includes(word));
        });
      }

      const containsKeywords = await checkWordInclusion(text, keywords);
      console.log("contain keywords", containsKeywords);

      const isStopWords = await checkStopWordInclusion(text, minusKeywords);
      console.log("contain minus keywords", isStopWords);

      if (containsKeywords && !isStopWords) {
        const name = product.Name;
        const price = product.Price;
        return name + ' - ' + price;
      }
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};
