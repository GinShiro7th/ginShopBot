const Chat = require("../db/chats");
const BotState = require("../db/botState");
const { Api } = require("telegram");
const { NewMessage } = require("telegram/events");

const checkMessageFromChat = require("../functions/checkMessageFromChat");
const sendAnswer = require("./sendAnswer");

const IgnoreList = require("../db/ignoreList");

async function processMessage(client, event) {
  const update = event.message;

  try {
    const clientInfo = await client.getMe();

    const botState = await BotState.findOne({
      where: {
        FromUser: clientInfo.id,
      },
    });

    if (!botState || !botState.IsActive) {
      return;
    }

    if (update.peerId.chatId || update.peerId.channelId) {
      const userChatsInfo = await Chat.findAll({
        where: {
          FromUser: clientInfo.id,
        },
      });

      const chatNames = userChatsInfo.map((item) => item.Name.replace("@", ""));

      const chatId = update.peerId.chatId
        ? update.peerId.chatId
        : update.peerId.channelId;

      const entity = await client.getEntity(chatId);

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

          if (
            mainChat &&
            (chatTitle === mainChat || chatUsername === mainChat) &&
            fromUser.username === clientInfo.username
          ) {
            console.log("admin from main chat:");
            let i = 0;

            for (const chat of buyChats) {
              i++;
              setTimeout(async () => {
                try {
                  await client.sendMessage(chat, { message: update.message });
                } catch (err) {
                  if (err.message.includes("CHAT_WRITE_FORBIDDEN")) {
                    try {
                      const result = await client.invoke(
                        new Api.channels.GetFullChannel({
                          channel: chat,
                        })
                      );
                      for (const channelChat of result.chats) {
                        if (channelChat.username !== chat) {
                          try {
                            await client.sendMessage(channelChat.id, {
                              message: update.message,
                            });
                          } catch (err) {
                            console.log("errorrrr aaaaaaaaaaa");
                          }
                        }
                      }
                    } catch (err) {
                      console.log("error getting full channel");
                    }
                  }
                }
              }, i * 100);
            }
          } else if (
            sellChats.includes(chatTitle) ||
            sellChats.includes(chatUsername)
          ) {
            const ignoreList = ignoreListInfo.map((item) => item.UserName);
            // в будущем когда добавление партнеров будет по айди проверку на айди
            if (
              !ignoreList.includes(
                fromUser.username
              ) /*|| fromUser.id !== client.id*/
            ) {
              const answer = await checkMessageFromChat(
                update.message,
                clientInfo.id.value
              );
              if (answer) {
                await sendAnswer(client, fromUser.id.toString(), answer);
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
}

module.exports = async function (client) {
  const resp = {
    lastResponse: Date.now(),
  };

  client.addEventHandler(async (event) => {
    if (event.message.peerId.chatId || event.message.peerId.channelId) {
      const iter = setInterval(async () => {
        const date = Date.now();
        if (date - resp.lastResponse > 500) {
          clearInterval(iter);
          resp.lastResponse = Date.now();
          await processMessage(client, event);
        }
      }, 100);
    }
  }, new NewMessage({}));
};
