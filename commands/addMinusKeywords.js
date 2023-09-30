const User = require("../db/users");
const MinusKeyword = require("../db/minusKeywords");
const Product = require('../db/products');

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
        "Введите минус слова, которые надо добавить, через пробел"
      );
      await user.update({
        Command: `addMinusKeywords_${productID}`,
      });
      break;
    case "2":
      const keywords = msg.text
        .split(",")
        .map((word) => word.replace(/"/g, "").trim())
        .filter((word) => word !== "")
        .map(function (word) {
          return {
            Keyword: word,
            UserID: userId,
            ProductID: productID,
          };  
        });
      await MinusKeyword.bulkCreate(keywords);
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
