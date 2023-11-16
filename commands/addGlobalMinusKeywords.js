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
      await bot.sendMessage(msg.chat.id, "🔎Пришлите минус слова, которые хотите добавить в глобальные, заключив каждое слово в ковычки");
      await user.update({
        Command: "addGlobalMinusKeywords"
      });
      break;
    case '2':
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
            FromUser: fromId
          };  
        });
      await GlobalMinusKeywords.bulkCreate(globalMinusKeywords);
      
      await bot.sendMessage(msg.chat.id, "✅Минус слова успешно добавлены в глобальные");
      await user.update({
        Command: "start"
      });
      break;
  }
}