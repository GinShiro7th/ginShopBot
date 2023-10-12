const fs = require('fs');
const User = require('../../db/users');
const Chat = require('../../db/chats');


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
    
    const head = '📝Список всех ваших чатов:';
    const main = '👑Главный - ';
    const mainChatInfo = await Chat.findOne({
      where: {
        isMain: true,
        FromUser: msg.from.id
      }
    });
    const mainChat = mainChatInfo ? mainChatInfo.Name : 'не назначен' 

    const buy = 'Чаты для покупки: ';
    const buyChatsInfo = await Chat.findAll({
      where: {
        FromUser: msg.from.id,
        Type: 'buy',
        isMain: false
      }
    });
    const buyChats = buyChatsInfo.length ? buyChatsInfo.map(item => item.Name).join(', ') : 'не добавлены';

    const sell = 'Чаты для продажи: ';
    const sellChatsIfno = await Chat.findAll({
      where: {
        Type: 'sell',
        FromUser: msg.from.id
      }
    });
    const sellChats = sellChatsIfno.length ? sellChatsIfno.map(item => item.Name).join(', ') : 'не добавлены'

    const message = head + '\n\n' + main + mainChat + '\n\n' + buy + buyChats + '\n\n' + sell + sellChats


    const kb = {
      inline_keyboard: [
        [{text: 'Назначить главный чат', callback_data: 'setMainChat'}]
      ]
    }

    await bot.sendMessage(msg.chat.id, message, {
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