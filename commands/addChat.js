const User = require('../db/users');
const Chat = require('../db/chats');

module.exports = async function (msg, bot, option) {
  
  const userData = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  switch (option) {
    case "1":
      await bot.sendMessage(msg.chat.id, "💬Пришлите чат, который хотите добавить. Первый чат, который вы добавите, будет основным, и из него будет идти копирование в другие чаты");
      await userData.update({
        Command: "addChat"
      });
      break;
    case "2":
      const chat = await Chat.findOne({
        where: {
          Name: msg.text,
          FromUser: msg.from.id
        }
      })
      if (chat){
        await bot.sendMessage(msg.chat.id, "⭕️Этот чат уже есть в вашем списке чатов");
      } else {
        await Chat.create({
          Name: msg.text,
          FromUser: msg.from.id
        })
        await bot.sendMessage(msg.chat.id, "✅Чат успешно добавлен");
      }
      await userData.update({
        Command: "start"
      });
      break;
  }
};
