const User = require('../../db/users');
const MinusKeywordsTemplate = require('../../db/minusKeywordsTemplate');

module.exports = async function(msg, bot, option, name){
  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "Пришлите навание шаблона из списка ваших шаблонов, который нужно отредактировать");
      await user.update({
        Command: 'editTemplate'
      });
      break;
    case '2':
      const templateName = msg.text;
      const userTemplate = await MinusKeywordsTemplate.findOne({
        where: {
          Template: templateName,
          UserId: msg.from.id
        }
      });
      if (!userTemplate){
        return await bot.sendMessage(msg.chat.id, "Такого шаблона нет в списке ваших шаблонов. Пришлите название того, который есть в вашем списке");
      }
      const message = "Текущие минус слова в шаблоне " 
                      + templateName 
                      + ":\n\n" 
                      + userTemplate.Keywords 
                      + "\n\n"
                      + "Пришлите новые минус слова, которыми нужно заменить текущие, либо выбирите один из вариантов";
      
      const buttons = {
        reply_markup: {
          inline_keyboard: [
            [{text: "Добавить минус слова в шаблон", callback_data: "addTemplateMinusKw_" + templateName}],
            [{text: "Удалить минус слова из шаблона", callback_data: "delTemplateMinusKw_" + templateName}],
            [{text: "Оставить как есть", callback_data: "save"}],
          ]
        }
      }
      
      await bot.sendMessage(msg.chat.id, message, buttons);
      await user.update({
        Command: 'editTemplate_' + templateName
      });
      break;
    case '3':
      const Keywords = msg.text;
      const template = await MinusKeywordsTemplate.findOne({
        where: {
          Template: name,
          UserId: msg.from.id
        }
      });
      await template.update({
        Keywords
      });
      await bot.sendMessage(msg.chat.id, "✅Шаблон успешно редактирован");
      await user.update({
        Command: 'start'
      });
  }
}