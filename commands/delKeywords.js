const User = require("../db/users");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");
const Sequelize = require('sequelize');
const { Op } = Sequelize;

module.exports = async function (msg, bot, option, userId, productID) {
  const user = await User.findOne({
    where: {
      TgID: userId,
    },
  });
  switch (option) {
    case "1":
      await bot.sendMessage(
        msg.chat.id,
        "Введите ключевые слова, которые надо удалить, через запятую"
      );
      await user.update({
        Command: `delKeywords_${productID}`,
      });
      break;
    case "2":
      const regex = /(["“«])([^"”»]+)(["”»])\s*,?/g;
      const resKeywords = [];
      let match;
        
      while ((match = regex.exec(msg.text)) !== null) {
        resKeywords.push(match[1] + match[2] + match[3]);
      }
      const keywords = resKeywords.filter(item => item !== '", "' && item !== '","')
      await Keyword.destroy({
        where: {
          Keyword: {
            [ Op.in ]: keywords,
          },
          ProductID: productID,
          UserID: userId
        }
      });
      
      await user.update({
        Command: `editProductMinusKeywords_${productID}`,
      });

      const minus = await MinusKeyword.findAll({
        where: {
          UserID: msg.from.id,
          ProductID: productID,
        },
      });

      const list = minus.map((item) => item.Keyword).join(", ");

      message =
        "Текущие минус слова:\n" +
        list +
        "\n\nВведите новые минус слова, через запятую";

      const editMinusKeywordsBtns = {
        inline_keyboard: [
          [
            {
              text: "Добавить минус слова",
              callback_data: `addMinusKeywords_${productID}`,
            },
            {
              text: "Удалить минус слова",
              callback_data: `delMinusKeywords_${productID}`,
            },
          ],
        ],
      };

      await bot.sendMessage(msg.chat.id, message, {
        reply_markup: JSON.stringify(editMinusKeywordsBtns)
      });
      
      break;
  }
};
