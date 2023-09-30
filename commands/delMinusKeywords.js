const User = require("../db/users");
const MinusKeyword = require("../db/minusKeywords");
const Product = require('../db/products');
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
        "Введите минус слова, которые надо удалить, через пробел"
      );
      await user.update({
        Command: `delMinusKeywords_${productID}`,
      });
      break;
    case "2":
      const keywords = msg.text
        .split(",")
        .map((word) => word.replace(/"/g, "").trim())
        .filter((word) => word !== "");
      await MinusKeyword.destroy({
        where: {
          Keyword: {
            [ Op.in ]: keywords,
          },
          ProductID: productID,
          UserID: userId
        }
      });
      await user.update({
        Command: `editProductAnswer_${productID}`,
      });

      const answer = await Product.findOne({
        where: {
          SellerId: msg.from.id,
          productID,
        },
      });

      message =
        "Текущий ответ бота:\n" +
        answer.Name +
        "\n\nВведите новый ответ бота";

    
      await bot.sendMessage(msg.chat.id, message);
      break;
  }
};
