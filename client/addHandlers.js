const Chat = require("../db/chats");
const BotState = require('../db/botState');
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

      const botState = await BotState.findOne({
        where: {
          FromUser: clientInfo.id
        }
      });

      if (!botState.IsActive) return;

      if (update.peerId.chatId || update.peerId.channelId) {
        const userChatsInfo = await Chat.findAll({
          where: {
            FromUser: clientInfo.id,
          },
        });

        const chatNames = userChatsInfo.map((item) =>
          item.Name.replace("@", "")
        );

        const chatId = update.peerId.chatId ? update.peerId.chatId : update.peerId.channelId;  

        const entity = await client.getEntity(
          chatId
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
               from - ${fromUser.username},
               clientId - ${clientInfo.username}
               update message - ${update.message}
              `
            );


            if (
              mainChat &&
              (chatTitle === mainChat || chatUsername === mainChat) &&
              fromUser.username === clientInfo.username
            ) {
              console.log("admin from main chat:", update.message);
              let i = 0;
              for (const chat of buyChats) {
                i++;
                setTimeout(async () => {
                  try {
                    await client.sendMessage(chat, { message: update.message });
                  } catch (err) {
                    console.log(
                      "err sending message from main chat:",
                      err.message
                    );
                  }
                }, i * 1000);
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
                  setTimeout(
                    async () =>
                      await client.sendMessage(fromUser.username, {
                        message: answer,
                      }),
                    2 * 60 * 1000
                  );
                }
              }
            }
          }
        }
      }
    } catch (err) {
      if (!err.message.includes('input entity for {"userId"'))
        console.log("error in handler:", err);
    }
  }, new NewMessage({}));
};
