const User = require('../db/users')
const Session = require('../db/sessions');

const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

module.exports = async function(msg, bot, option, userToCheck){
  const user = await User.findOne({
    where: {
      TgID: userToCheck.TgID
    }
  });
  
  console.log(user.toJSON());

  const kb = {
    keyboard: [
      [{text: "Поделится номером", request_contact: true}]
    ],
    resize_keyboard: true
  }

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, 'Здравствуйте, для того, чтобы полноценно пользоватся ботом, вам нужно предоставить доступ к вашему аккаунту, дабы бот мог отслеживать сообщения в ваших чатах и отправлять пользователям сообщения, о том, что такой то товар есть у вас');
      await bot.sendMessage(msg.chat.id, 'Для начала введите ваш номер телефона', {
        reply_markup: JSON.stringify(kb)  
      });
      await user.update({
        Command: 'getPhoneNumber'
      });
      break

    case '2':
  
      const phone = msg.contact ? msg.contact.phone_number : null;

      const apiId = 20160941;
      const apiHash = "ff2b66e4f21a9781fd293ed181b20f8b";
      const stringSession = new StringSession("");

      const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
      });

      await bot.sendMessage(msg.chat.id, "Введите код, который пришел вам");

      async function getCode() {
        return new Promise((resolve, reject) => {
          const messageHandler = (msg) => {
            console.log('bot on message');
            resolve(msg.text);
            // Удаляем обработчик после его использования
            bot.off('message', messageHandler);
          };
      
          bot.once('message', messageHandler);
        });
      }
    
      console.log('Phone', phone);

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
      
      break
  }
}