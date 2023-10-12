const GlobalMinusKeywords = require("../db/globalMinusKeywords");

module.exports = async function (msg, bot) {
  const globalMinusKw = await GlobalMinusKeywords.findAll({
    where: {
      FromUser: msg.from.id,
    },
  });

  const list = globalMinusKw.map((item) => item.MinusKeywords);

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Добавить глобальные минус слова",
            callback_data: "addGlobalMinusKeywords",
          },
        ],
        [
          {
            text: "Удалить глобальные минус слова",
            callback_data: "delGlobalMinusKeywords",
          },
        ],
      ],
    },
  };

  await bot.sendMessage(
    msg.chat.id,
    "🔎Список ваших глобальных минус слов:\n\n" +
      (list.length ? list.join(", ") : "не добавлены"),
    keyboard
  );
};
