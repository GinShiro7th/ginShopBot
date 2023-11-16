const Chat = require('../../db/chats');
const User = require('../../db/users');


module.exports = async function(msg, bot, option, userId){
  
  const user = await User.findOne({
    where: {
      TgID: userId
    }
  });
  
  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "✏️Пришлите название чата для покупки, который нужно сделать главным. Из него будет идти копирование ваших сообщений в другие чаты");
      await user.update({
        Command: 'setMainChat'
      }); 
      break;
    case '2':
      const mainChat = msg.text;
      const userChat = await Chat.findOne({
        where: {
          Name: mainChat,
          Type: 'buy',
          FromUser: msg.from.id,
        }
      });
      if (!userChat){
        return await bot.sendMessage(msg.chat.id, "⭕️Такого чата нет в списке ваших чатов. Пришлите именно тот чат, которые есть в вашем списке");
      };
      await bot.sendMessage(msg.chat.id, "✅Главный чат успешно назначен");

      await Chat.update({
        isMain: false
      },{
        where: {
          FromUser: msg.from.id
        }
      });

      await userChat.update({
        isMain: true
      });

      await user.update({
        Command: 'start'
      });

      break;
  }
}