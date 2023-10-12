const User = require('../db/users');
const IgnoreList = require('../db/ignoreList');

module.exports = async function(msg, bot, option){
  
  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  })
  
  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "Пришлите, через запятую, юзернеймы тех пользователей из игнор списка, которых хотите из него удалить");
      await user.update({
        Command: 'deleteFromIgnoreList'
      });
      break;
    case '2':
      const usersToDel = msg.text.split(',').map(word => word.trim().replace('@', ''));
      for (let userToDel of usersToDel){
        await IgnoreList.destroy({
          where: {
            UserName: userToDel,
            FromSeller: msg.from.id
          }
        });
      };
      await bot.sendMessage(msg.chat.id, "✅Пользователи удалены из игнор списка");
      await user.update({
        Command: 'start'
      });
      break;
  }
}