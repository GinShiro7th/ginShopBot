const User = require('../db/users');
const GlobalMinusKeywords = require('../db/globalMinusKeywords');

module.exports = async function(msg, bot, option, fromId){

  const user = await User.findOne({
    where: {
      TgID: fromId
    }
  });

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "🔎Пришлите минус слова, которые хотите добавить в глобальные");
      await user.update({
        Command: "addGlobalMinusKeywords"
      });
      break;
    case '2':
      const globalMinusKeywords = msg.text.split(',').map(word => word.trim().replace(/"/g, ''));
      console.log(globalMinusKeywords);
      for (let keyword of globalMinusKeywords){
        await GlobalMinusKeywords.create({
          MinusKeywords: keyword,
          FromUser: fromId
        });
      }
      await bot.sendMessage(msg.chat.id, "✅Минус слова успешно добавлены в глобальные");
      await user.update({
        Command: "start"
      });
      break;
  }
}