const User = require('../../db/users');
const MinusKeywordsTemplate = require('../../db/minusKeywordsTemplate');

module.exports = async function(msg, bot, option, templateTitle){
  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "Введите название шаблоны, который хотите добавить");
      await user.update({
        Command: "addTemplateTitle"
      });
      break;
    case '2':
      const title = msg.text;
      await bot.sendMessage(msg.chat.id, "Перечислите минус слова, которые хотите добавить в шаблон, заключив их в ковычки");
      await user.update({
        Command: "addTemplateKeywords_"+title
      });
      break;
    case '3':
      const minusKeywords = msg.text;
      try {
        await MinusKeywordsTemplate.create({
          Template: templateTitle,
          Keywords: minusKeywords,
          UserId: msg.from.id
        });
        await bot.sendMessage(msg.chat.id, "✅Шаблон успешно добавлен");
      } catch (err) {
        await bot.sendMessage(msg.chat.id, "⭕️Произошла ошибка при добавлении шаблона");
      }
      break;   
  }
}