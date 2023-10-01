const User = require('../db/users')
const Session = require('../db/sessions');

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const start = require('../commands/start');

module.exports = async function(msg, bot, option, userToCheck){
  const user = await User.findOne({
    where: {
      TgID: userToCheck.TgID
    }
  });
  
  console.log(user.toJSON());

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, 'Здравствуйте, для того, чтобы полноценно пользоватся ботом, вам нужно предоставить доступ к вашему аккаунту, дабы бот мог отслеживать сообщения в ваших чатах и отправлять пользователям сообщения, о том, что такой то товар есть у вас');
      await bot.sendMessage(msg.chat.id, 'Для начала введите ваш номер телефона');
      await user.update({
        Command: 'getPhoneNumber'
      });
      break

    case '2':
  
      const phone = msg.text;

      const apiId = 20160941;
      const apiHash = "ff2b66e4f21a9781fd293ed181b20f8b";
      const stringSession = new StringSession("");

      const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
      });

      async function getCode() {
        return new Promise(async (resolve, reject) => {
          await bot.sendMessage(msg.chat.id, "Введите код, который пришел вам");
          bot.on('message', (msg) => {
            resolve(msg.text)
          });
        })
      }
    
      await client.start({
        phoneNumber: phone,
        password: '123',
        phoneCode: async () => await getCode(),
        onError: (e) => console.log(e) 
      });
      
      await client.connect();
      
      console.log("You should now be connected.");
      console.log(client.session.save()); // Save this string to avoid logging in again
      await client.sendMessage("me", { message: "Hello!" });
       
      await user.update({
        Command: 'start'
      });
      break
  }
}