const User = require("../db/users");
const GlobalMinusKeywords = require("../db/globalMinusKeywords");

module.exports = async function (msg, bot, option, fromId) {
  const user = await User.findOne({
    where: {
      TgID: fromId,
    },
  });

  switch (option) {
    case "1":
      await bot.sendMessage(
        msg.chat.id,
        "🔎Пришлите минус слова, которые хотите удалить из глобальных"
      );
      await user.update({
        Command: "delGlobalMinusKeywords",
      });
      break;
    case "2":
      const regex = /(["“«])([^"”»]+)(["”»])\s*,?/g;
      const resKeywords = [];
      let match;

      while ((match = regex.exec(msg.text)) !== null) {
        resKeywords.push(match[1] + match[2] + match[3]);
      }

      const globalMinusKeywords = resKeywords
      .filter(item => item !== '", "' && item !== '","')
      .map(function (word) {
        return {
          MinusKeywords: word,
          FromUser: fromId,
        };
      });

      for (let keyword of globalMinusKeywords) {
        await GlobalMinusKeywords.destroy({
          where: {
            MinusKeywords: keyword.MinusKeywords,
            FromUser: fromId,
          },
        });
      }
      await bot.sendMessage(
        msg.chat.id,
        "✅Минус слова успешно удалены из глобальных"
      );
      await user.update({
        Command: "start",
      });
      break;
  }
};
