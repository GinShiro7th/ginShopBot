const User = require('../../db/users');
const MinusKeywordsTemplate = require('../../db/minusKeywordsTemplate');

module.exports = async function(msg, bot, option, fromId, name){
  const user = await User.findOne({
    where: {
      TgID: fromId,
    },
  });

  const template = await MinusKeywordsTemplate.findOne({
    where: {
      Template: name,
      UserId: fromId
    }
  });

  switch (option) {
    case "1":
      await bot.sendMessage(
        msg.chat.id,
        "Введите минус слова, которые надо добавить в шаблон, через запятую"
      );
      await user.update({
        Command: `addTemplateMinusKeywords_${name}`,
      });
      break; 
    case '2':
      const keywords = msg.text;
      
      await template.update({
        Keywords: template.Keywords+ ', ' + keywords
      });

      await bot.sendMessage(msg.chat.id, "✅Минус слова успешно добавлены в шаблон");
      await user.update({
        Command: 'start'
      })
      break;
  }
}