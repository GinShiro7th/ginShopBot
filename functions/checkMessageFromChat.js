const Product = require("../db/products");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");
const GlobalMinusKeywords = require('../db/globalMinusKeywords');
const { Op } = require("sequelize");
const addKeywordsFromTemplate = require("./addKeywordsFromTemplate");

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

      const keywords = keywordsInfo.map((item) => item.Keyword.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '').replace(/«/g, '').replace(/»/g, '').toLowerCase()).filter(item => item);
      
      const minusKeywordsTemplates = minusKeywordsInfo.map((item) => item.Keyword.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '').replace(/«/g, '').replace(/»/g, ''));
      
      const minusKeywords = await addKeywordsFromTemplate(minusKeywordsTemplates, SellerId);
      
      const globalMinusKeywords = globalMinusKeywordsInfo.map((item => item.MinusKeywords.replace(/"/g, '').replace(/“/g, '').replace(/”/g, '').replace(/«/g, '').replace(/»/g, '').toLowerCase())).filter(item => item);
      
      if (Number(SellerId) === 1891387921){
        console.log('keywords', keywords);
        console.log('minus kw with templates', minusKeywordsTemplates);
        console.log('global minus kw', globalMinusKeywords);
        console.log('minus kw without templates', minusKeywords);
      }

      async function checkWordInclusion(message, searchPhrases) {
        const lowerCasedMsg = message.toLowerCase();
        return searchPhrases.some((pattern) => {
          if (lowerCasedMsg.includes(pattern)) console.log(pattern);
          return lowerCasedMsg.includes(pattern);
        });
      }

      const containsKeywords = await checkWordInclusion(text, keywords);
      
      const isStopWords = await checkWordInclusion(text, minusKeywords);
      
      const isGlobalMinusKeywords = await checkWordInclusion(text, globalMinusKeywords);
      if (Number(SellerId) === 1891387921){
        console.log("contain minus keywords", isStopWords);
        console.log("contain keywords", containsKeywords);
        console.log("contain global minus keywords", isGlobalMinusKeywords);
      }
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
