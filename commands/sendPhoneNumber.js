const User = require("../db/users");
const Session = require("../db/sessions");

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const start = require("../commands/start");
const addHandlers = require("../client/addHandlers");

module.exports = async function (msg, bot, option, userToCheck) {
  const user = await User.findOne({
    where: {
      TgID: userToCheck.TgID,
    },
  });

  console.log(user.toJSON());

  switch (option) {
    case "1":
      await bot.sendMessage(
        msg.chat.id,
        "Здравствуйте, для того, чтобы полноценно пользоватся ботом, вам нужно предоставить доступ к вашему аккаунту, дабы бот мог отслеживать сообщения в ваших чатах и отправлять пользователям сообщения, о том, что такой то товар есть у вас",
        {
          reply_markup: {
            remove_keyboard: true,
          },
        }
      );

      await bot.sendMessage(
        msg.chat.id,
        "Для начала введите ваш номер телефона"
      );
      await user.update({
        Command: "getPhoneNumber",
      });
      break;

    case "2":
      await user.update({
        Command: "",
      });

      const phone = msg.text;

      const apiId = 20160941;
      const apiHash = "ff2b66e4f21a9781fd293ed181b20f8b";

      const session = await Session.findOne({
        where: {
          FromUser: msg.from.id,
        },
      });

      const stringSession = new StringSession("");

      const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
      });

      const replyKeyboard = {
        keyboard: [
          [{ text: "1" }, { text: "2" }, { text: "3" }],
          [{ text: "4" }, { text: "5" }, { text: "6" }],
          [{ text: "7" }, { text: "8" }, { text: "9" }],
          [{ text: "0" }],
        ],
        resize_keyboard: true,
      };

      await bot.sendMessage(msg.chat.id, "Введите код, который пришел вам, используя кнопки", {
        reply_markup: JSON.stringify(replyKeyboard),
      });

      async function getCode() {
        return new Promise(async (resolve, reject) => {
          bot.once("message", (msg) => {
            const f = msg.text;
            bot.once("message", (msg) => {
              const f1 = f + msg.text;
              bot.once("message", (msg) => {
                const f2 = f1 + msg.text;
                bot.once("message", (msg) => {
                  const f3 = f2 + msg.text;
                  bot.once("message", (msg) => {
                    const f4 = f3 + msg.text;
                    resolve(f4);
                  });
                });
              });
            });
          });
        });
      };

      async function getPassword(){
        await bot.sendMessage(msg.chat.id, "Теперь введите пароль, если у вас стоит двухэтапная аутентификаия, если нет - то введите что угодно");
        return new Promise(async (resolve) => {
          bot.once('message', msg => {
            resolve(msg.text);
          })
        })
      }

      try {
        await client.start({
          phoneNumber: phone,
          phoneCode: async () => await getCode(),
          password: async () => await getPassword(),
          onError: (e) => console.log(e),
        });

        const me = await client.getMe();
        
        if (!session || session.StringSession !== client.session.save()){
          try {         
            await session.destroy();
          } catch (err) {
            console.log('no session string in db for ' + me.username);
          };

          await Session.create({
            StringSession: client.session.save(),
            FromUser: msg.from.id,
          });
        }

        await client.getDialogs({ limit: 100 });

        await user.update({
          Command: "start",
        });

        await addHandlers(client);

        await bot.sendMessage(
          msg.chat.id,
          `Успешно подключено к аккаунту ${me.username}`,
          {
            reply_markup: {
              remove_keyboard: true,
            },
          }
        );

        await start(msg, bot, user);
      } catch (err) {
        console.log("login error", err.message);
        await bot.sendMessage(
          msg.chat.id,
          "Вы ввели неверный номер или код, попробуйте снова. Введите номер телефона",
          {
            reply_markup: {
              remove_keyboard: true,
            },
          }
        );
        await user.update({
          Command: "getPhoneNumber",
        });
      }
      break;
  }
};
