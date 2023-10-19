const User = require('../../db/users');

module.exports = async function(msg, bot, fromId){
  const user = await User.findOne({
    where: {
      TgID: fromId
    }
  });
  await bot.sendMessage(msg.chat.id, "✅Шаблон успешно редактирован");
  await user.update({
    Command: 'start'
  });
}