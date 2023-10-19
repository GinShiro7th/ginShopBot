const User = require("../../db/users");
const Chat = require("../../db/chats");
const startKeyboard = require("../../models/keyboard/startkeyboard");
const adminStartKeyboard = require("../../models/keyboard/admin/adminStartKeyboard");

module.exports = async function (msg, bot, option) {
  const userData = await User.findOne({
    where: {
      TgID: msg.from.id,
    },
  });

  switch (option) {
    case "1":
      await bot.sendMessage(
        msg.chat.id,
        "💬Пришлите название чата, который хотите добавить"
      );
      await userData.update({
        Command: "addChat",
      });
      break;
    case "2":
      await Chat.create({
        Name: msg.text,
        FromUser: msg.from.id,
      });
      await bot.sendMessage(msg.chat.id, `К какой категории отнести чат?`, {
        reply_markup: {
          keyboard: [["Чат для покупки"], ["Чат для продажи"]],
          resize_keyboard: true,
        },
      });

      await userData.update({
        Command: msg.text,
      });
      break;
    case "3":
      const chatCount = await Chat.count({
        where: {
          Type: 'buy',
          Name: userData.Command,
          FromUser: userData.TgID,
          IsMain: false
        }
      });
      if (chatCount < 1){
        await Chat.update(
          {
            Type: "buy",
          },
          {
            where: {
              Name: userData.Command,
              FromUser: userData.TgID,
            },
          }
        );
        await bot.sendMessage(
          msg.chat.id,
          "✅Чат для покупки успешно добавлен",
          userData.IsAdmin ? adminStartKeyboard.reply() : startKeyboard.reply()
        );
      } else {
        await Chat.destroy({
          where: {
            Type: 'sell',
            Name: userData.Command,
            FromUser: userData.TgID,
            IsMain: false
          }
        });
        await bot.sendMessage(
          msg.chat.id,
          "⭕️Такой чат уже есть в списке чатов для покупки",
          userData.IsAdmin ? adminStartKeyboard.reply() : startKeyboard.reply()
        );
      }
      await userData.update({
        Command: "start",
      });
      break;
    case "4":
      const chats = await Chat.findAll({
        where: {
          Type: 'sell',
          Name: userData.Command,
          FromUser: userData.TgID
        }
      });
      if (chats.length < 2){
        await bot.sendMessage(
          msg.chat.id,
          "✅Чат для продажи успешно добавлен",
          userData.IsAdmin ? adminStartKeyboard.reply() : startKeyboard.reply()
        );
      } else {
        await Chat.destroy({
          where: {
            Type: 'sell',
            Name: userData.Command,
            FromUser: userData.TgID
          }
        });
        await bot.sendMessage(
          msg.chat.id,
          "⭕️Такой чат уже есть в списке чатов для продажи",
          userData.IsAdmin ? adminStartKeyboard.reply() : startKeyboard.reply()
        );
      }
      await userData.update({
        Command: "start",
      });
      break;
  }
};
