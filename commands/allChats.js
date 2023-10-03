const fs = require('fs');
const User = require('../db/users');
const Chat = require('../db/chats');


module.exports = async function(msg, bot){
  
  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  const chats = await Chat.findAll({
    where: {
      FromUser: msg.from.id
    }
  })
  
  if (chats.length) {
   
    const list = chats.reduce(
      (acc, cur, index) => acc + '\n' + (index+1) + ' - ' + cur.Name + (cur.isMain ? ' - 👑Главный' : ''), 
      '📝Список всех ваших чатов:');
    
    const kb = {
      inline_keyboard: [
        [{text: 'Назначить главный чат', callback_data: 'setMainChat'}]
      ]
    }

    await bot.sendMessage(msg.chat.id, list, {
      reply_markup: JSON.stringify(kb),
      disable_web_page_preview: true
    });

  } else {
    await bot.sendMessage(msg.chat.id, "⭕️Вы еще не добавили ни одного чата");
  }
  
  await user.update({
    Command: 'start'
  });
}