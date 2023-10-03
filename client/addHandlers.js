const { Api } = require('telegram');

const Chat = require('../db/chats');


module.exports = async function(client){
  client.addEventHandler(async (update) => {
    
    const clientInfo = await client.getMe();
    
    if (update.message === '123')
      console.log('update.message', update);

    if (update.message && update.message.peerId){
      const peer = update.message.peerId;
      
      if (peer.chatId || peer.channelId){
        
        const msgText = update.message.message;
        //console.log('peer', peer, '\ntext', msgText);
        
        const UserChatsInfo = await Chat.findAll({
          where: {
            FromUser: clientInfo.id
          },
          attributes: ['Name']
        });

        const userChats = UserChatsInfo.map(chat => chat.Name); 

        const chat = peer.chatId ? peer.chatId : peer.channelId;

        await client.getDialogs();
        const entity = await client.getEntity(chat);
        
        console.log('user chats', userChats);
        console.log('chat title', entity.title);

        if (userChats.includes(entity.title)){
          
          await client.sendMessage(update.message.fromId.userId, {message: msgText});

        }
      }
    }
    
  });
}