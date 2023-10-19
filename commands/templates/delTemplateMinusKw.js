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
        "Введите минус слова, которые надо удалить из шаблона, через запятую"
      );
      await user.update({
        Command: `delTemplateMinusKeywords_${name}`,
      });
      break; 
    case '2':
      const keywords = msg.text.split(",").map(item => item.trim());
      
      const prevKeywords = template.Keywords.split(',').map(item => item.trim());
      
      console.log('prev kwds:', prevKeywords);

      for (const keyword of keywords){
        const index = prevKeywords.findIndex(item => item === keyword);
        console.log(keyword, ':', index);
        if (index !== -1){
          prevKeywords.splice(index, 1);
        }
      }

      await template.update({
        Keywords: prevKeywords.join(', ')
      });

      await bot.sendMessage(msg.chat.id, "✅Минус слова успешно удалены из шаблона");
      await user.update({
        Command: 'start'
      })
      break;
  }
}