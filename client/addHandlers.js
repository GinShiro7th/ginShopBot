const Chat = require("../db/chats");
const { Api } = require("telegram");
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

        const chatNames = userChatsInfo.map((item) =>
          item.Name.replace("@", "")
        );

        const entity = await client.getEntity(
          update.peerId.chatId ? update.peerId.chatId : update.peerId.channelId
        );
        const chatTitle = entity.title;
        const chatUsername = entity.username;

        if (chatNames.includes(chatTitle) || chatNames.includes(chatUsername)) {
          const fromUser = await client.getEntity(BigInt(update.fromId.userId));
          const ignoreListInfo = await IgnoreList.findAll({
            where: {
              FromSeller: clientInfo.id,
            },
          });
          if (userChatsInfo.length) {
            const sellChats = userChatsInfo
              .filter((item) => item.Type === "sell")
              .map((item) => item.Name.replace("@", ""));
            const buyChats = userChatsInfo
              .filter((item) => item.Type === "buy" && !item.isMain)
              .map((item) => item.Name.replace("@", ""));
            const mainChatInfo = userChatsInfo.find((item) => item.isMain);
            const mainChat = mainChatInfo
              ? mainChatInfo.Name.replace("@", "")
              : "";

            console.log(
              `
                chat title - ${chatTitle},
                chat username - ${chatUsername},
                mainChat - ${mainChat ? mainChat : ""},
                byuChats - ${buyChats},
                sellChats - ${sellChats},
                from - ${fromUser.username},
                clientId - ${clientInfo.username}
              `
            );

            if (
              mainChat &&
              (chatTitle === mainChat || chatUsername === mainChat) &&
              fromUser.username === clientInfo.username
            ) {
              console.log("admin from main chat:", update.message);
              for (const chat of buyChats) {
                await client.sendMessage(chat, { message: update.message });
              }
            } else if (
              sellChats.includes(chatTitle) ||
              sellChats.includes(chatUsername)
            ) {
              const ignoreList = ignoreListInfo.map((item) => item.UserName);
              if (!ignoreList.includes(fromUser.username)) {
                console.log("from sell chat");
                const answer = await checkMessageFromChat(
                  update.message,
                  clientInfo.id.value
                );
                if (answer) {
                  await client.sendMessage(fromUser.username, {
                    message: answer,
                  });
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
