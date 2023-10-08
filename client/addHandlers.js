const Chat = require("../db/chats");
const { Api } = require('telegram');
const checkMessageFromChat = require("../functions/checkMessageFromChat");
const IgnoreList = require("../db/ignoreList");
const { NewMessage } = require("telegram/events");

const chatBase = {};

module.exports = async function (client) {
  client.addEventHandler(async (event) => {
    const update = event.message;
    try {
      const clientInfo = await client.getMe();

      if (update.peerId.chatId || update.peerId.channelId) {

        const userChatsInfo = await Chat.findAll({
          where: {
            FromUser: clientInfo.id,
          },
        });

        const chatNames = userChatsInfo.map(item => item.Name);

        const entity = await client.getEntity(update.peerId.chatId ? update.peerId.chatId : update.peerId.channelId);
        const chat = entity.title;

        console.log(chatNames);
        console.log(chat);

        if (chatNames.includes(chat)){

          console.log(update);

          const fromUser = await client.getEntity(update.fromId.userId);
          const ignoreListInfo = await IgnoreList.findAll({
            where: {
              FromSeller: clientInfo.id
            }
          });
          if (userChatsInfo.length) {
            const sellChats = userChatsInfo
              .filter((item) => item.Type === "sell")
              .map((item) => item.Name);
            const buyChats = userChatsInfo
              .filter((item) => item.Type === "buy" && !item.isMain)
              .map((item) => item.Name);
            const mainChat = userChatsInfo.find((item) => item.isMain);

            console.log(
              `
                chat - ${chat},
                mainChat - ${mainChat ? mainChat.Name : ''},
                fromId - ${update.fromId.value},
                clientId - ${clientInfo.id.value}
              `
            );

            if (mainChat){
              if (chat === mainChat.Name && update.fromId.value === clientInfo.id.value) {
                console.log('admin from main chat:', update.message);
                for (const chat of buyChats){
                  await client.sendMessage(chat, {message: update.message});
                }
              }
            } else if (sellChats.includes(chat)) {
              const ignoreList = ignoreListInfo.map(item => item.UserName);
              if (!ignoreList.includes(fromUser.username)){
                console.log('from sell chat');
                const answer = await checkMessageFromChat(update.message, clientInfo.id.value);
                if (answer){
                  await client.sendMessage(fromUser.username, {message: answer});
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.log("error in handler:", err);
    }
  }, new NewMessage({}));
  // client.addEventHandler(eventPrint, new NewMessage({}));

  // async function eventPrint(event) {
  //   const message = event.message;

  //   try {
  //     const peerId = message.peerId;
  //     const clientInfo = await client.getMe();
  //     if (peerId.chatId || peerId.channelId) {
  //       const chatId = peerId.chatId
  //         ? peerId.chatId.value
  //         : peerId.channelId.value;

  //       const userChatsInfo = await Chat.findAll({
  //         where: {
  //           FromUser: clientInfo.id,
  //         },
  //       });

  //       if (userChatsInfo.length) {
  //         const sellChats = userChatsInfo
  //           .filter((item) => item.Type === "sell")
  //           .map((item) => item.Name);
  //         const buyChats = userChatsInfo
  //           .filter((item) => item.Type === "buy" && !item.isMain)
  //           .map((item) => item.Name);
  //         const mainChat = userChatsInfo.find((item) => item.isMain);
      
  //         const chat = chatBase[chatId] ? 
  //         chatBase[chatId] :
  //         (async () => {
  //           if (peerId.chatId){
  //             const res = await client.invoke(
  //               new Api.messages.GetChats({
  //                 id: [chatId],
  //               })
  //             );
  //             console.log(res.chats[0]);
  //             chatBase[chatId] = res.chats[0].title;
  //           } else {
  //             const res = await client.invoke(
  //               new Api.channels.GetFullChannel({
  //                   channel: new Api.InputChannel({
  //                       channelId: peerId.channelId.value,
  //                       accessHash: 0,  // Для примера. Необходимо получить реальный accessHash
  //                   }),
  //               })
  //             );
  //             console.log(res);
  //             chatBase[peerId.channelId.value] = res.title;
  //           }
  //           return chatBase[chatId];
  //         })()
          
  //         console.log(chat);
           /*const chat = entity.title;
          if (
            chat === mainChat.Name &&
            message.fromId.userId.value === clientInfo.id.value
          ) {
            for (let buyChat of buyChats) {
              await client.sendMessage(buyChat, { message: message.message });
            }
          } else if (sellChats.includes(chat)) {
            const answer = await checkMessageFromChat(
              update.message.message,
              clientInfo.id.value
            );
            if (answer) {
              await client.sendMessage(fromUser.username, { message: answer });
            }
          }*/
    //     }
    //   }
    // } catch (err) {
    //   console.log("error in handler", err);
    // }
};

