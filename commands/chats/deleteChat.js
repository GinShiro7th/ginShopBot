const User = require('../../db/users');
const Chat = require('../../db/chats');
const Trial = require('../../db/trial');

module.exports = async function(msg, bot, option){

  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  });

  const trial = await Trial.findOne({
    where: {
      UserId: msg.from.id
    }
  })

  switch (option) {
    case "1":
      await bot.sendMessage(msg.chat.id, "💬Пришлите название или ссылку на чат из списка, который хотите удалить");
      
      await user.update({
        Command: 'deleteChat'
      });

      break;
    case "2":
      const name = msg.text;
      
      const chat = await Chat.findOne({
        where: {
          Name: name,
          FromUser: msg.from.id
        }
      })

      if (chat){
        if (name === "СУЕТОЛОГ" && trial.Type >= 1 && trial.Type <= 3){
          await bot.sendMessage(msg.chat.id, "❌Вы не можете удалить этот чат, так как он назначен у вас главным");
        } else {
          await bot.sendMessage(msg.chat.id, `✅Чат ${name} успешно удален`, {
            disable_web_page_preview: true
          });
          await chat.destroy();
        }
      } else {
        await bot.sendMessage(msg.chat.id, "⭕️Данный чат не найден cреди ваших чатов");
      }

      await user.update({
        Command: 'start'
      });
      break;
  }
}