const { Api, TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const Chat = require('./db/chats');

const userId = 19233654;
const apiHash = 'ff2b66e4f21a9781fd293ed181b20f8b';
const apiId = 20160941;
const stringSession = new StringSession("1AgAOMTQ5LjE1NC4xNjcuNDEBu3SgpFCUDG4rXEvHu+JuHhVXqS6WnbeXN4scKhouoHFO4Xnj8vbVyPIKftmCXQBj5X2ZZWtaAhl5/gtPxGbL4nwE0CNhzJ+WUURKfAOCmzk0J9m5z8/6owE65yMvCG5+0OwlqOeCZJy2mHwIqejgn82aLyJPhp4NoO4I7AZ56mKa3rawRP53KJxL2CgT9K1fARMwRPftVYjppnlsLqLjutWhnvvYc3pDL07xZMNV/LIFg1pzo16nfnP/oSzygj6ekKU0tEReq3HfF+EtAK/65nHLZHIG5PfUkQ7Z6wmy2qWEBptkjLt0EVfSHovRXj0aBOotiotsCziSy4FZ1qh6Zog=");

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5
});

(async () => {
  try{
    await client.connect();
    
    const chatsInfo = await Chat.findAll({
      where: {
        FromUser: userId
      }
    });

    const chats = chatsInfo.map(item => item.Name.replace('@', ''));

    let i=0;
    let end = chats.length;

    const interval = setInterval(async () => {
      if (i < end){
        try {
          const result = await client.invoke(
            new Api.channels.GetFullChannel({
              channel: chats[i],
            })
          );
          console.log(`chat - ${chats[i]}\nresult - ${result.chats.map(item => item.title + '\n' + item.username + '\n')}`);
        } catch (err) { 
          console.log('error getting full channel for ' + chats[i], err.message);
        }
      } else {
        clearInterval(interval);
      }
      i++;
    }, Math.floor(1000 + Math.random() * (1999 - 1000 + 1)));

  } catch (err) {
    console.log('login error', err.message);
  }
})()