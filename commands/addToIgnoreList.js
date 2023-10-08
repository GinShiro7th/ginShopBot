const IgnoreList = require("../db/ignoreList");
const User = require("../db/users");

module.exports = async function(msg, bot, option){

  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "Пришлите юзернеймы, через запятую, тех, кого хотите добавить в игнор список, чтобы бот не реагировал на их сообщения");
      await user.update({
        Command: "AddToIgnoreList"
      });
      break;
    case '2':
      const usernames = msg.text.split(',').map(item => item.trim().replace('https://t.me/', '').replace('@', ''));
      for (const username of usernames){
        const userInList = await IgnoreList.findOne({
          where: {
            UserName: username
          }
        });
        if (!userInList){
          await IgnoreList.create({
            UserName: username,
            FromSeller: msg.from.id
          });
        }
      }
      await bot.sendMessage(msg.chat.id, `Пользователи добавлены в игнор список. Теперь их сообщения будут игнорироватся ботом`);
      await user.update({
        Command: 'start'
      });
      break
  }
}