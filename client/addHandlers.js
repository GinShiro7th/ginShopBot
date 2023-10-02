const { ChatGetter } = require("telegram/tl/custom")

const Chat = require('../db/chats');

module.exports = async function(client, msg){

  client.addEventHandler(async (update) => {
    
    console.log(update);

    const chats = await Chat.findAll({
      where: {
        FromUser: msg.from.id
      },
      attributes: ['Name']
    });

    for (const chat of chats){
      const chatName = chat.Name;
      try {
        const chatId = await client.getChatId(chatName);
        console.log(`Chat ID for ${chatName}: ${chatId}`);
      } catch (error) {
        console.error(`Error while getting chat ID for ${chatName}: ${error.message}`);
      }
    }

    if (update instanceof ChatGetter) {
      // Обработка новых сообщений в чате
      const message = update.message;
      if (message) {
        console.log(`Received message: ${message.text}`);
      }
    }
  });
}