const MinusKeywordsTemplate = require('../../db/minusKeywordsTemplate');
const User = require('../../db/users');

module.exports = async function(msg, bot){

  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  const userTemplates = await MinusKeywordsTemplate.findAll({
    where: {
      UserId: msg.from.id
    }
  });

  let dashboard = "📋Все ваши шаблоны:\n";

  const messages = [];

  if (userTemplates.length === 0){
    messages.push(dashboard + '\n⭕️Не добавлены')
  } else {
    for (let i = 0; i<userTemplates.length; i++){
      if (i % 30 || i === 0){
        dashboard += '\n' + userTemplates[i].Template;
      } else {
        messages.push(dashboard);
        dashboard = '';
        dashboard += '\n' + userTemplates[i].Template;
      }
    }
    messages.push(dashboard);
  }
  for (let i=0; i < messages.length - 1; i++){
    await bot.sendMessage(msg.chat.id, messages[i]);
  };

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [{text: "Загрузить в файл все ваши шаблоны", callback_data: "userTemplateToFile"}],
        [{text: "Загрузить в бота ваши шаблоны из файла", callback_data: "loadUserTemplateFromFile"}],
        [{text: "Добавить в бота ваши шаблоны из файла к уже имеющимся", callback_data: "addUserTemplateFromFile"}],
      ]
    }
  }

  await bot.sendMessage(msg.chat.id, messages[messages.length - 1], keyboard);

  await user.update({
    Command: 'start'
  });

}