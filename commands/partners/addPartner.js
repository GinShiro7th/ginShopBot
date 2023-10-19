const usersToAdd = require("../../database/usersToAdd.json");
const fs = require("fs");
const User = require("../../db/users");
const Trial = require("../../db/trial");

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
        "🔗Пришлите ссылку на профиль человека, которого хотите сделать партнером"
      );

      await userData.update({
        Command: "addPartner",
      });

      break;
    case "2":
      const userToAdd = msg.text.replace("https://t.me/", "").replace("@", "");
      const exists = usersToAdd.findIndex(item => item.partner === userToAdd);
      if (exists !== -1) {
        await userData.update({
          Command: "start",
        });
        return await bot.sendMessage(
          msg.chat.id,
          "⭕️Партнер уже был добавлен в список"
        );
      } else {
        usersToAdd.push({
          partner: userToAdd,
          trial: 1,
        });

        const keyboard = {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "1", callback_data: `trial_1_${userToAdd}` },
                { text: "2", callback_data: `trial_2_${userToAdd}` },
              ],
              [
                { text: "3", callback_data: `trial_3_${userToAdd}` },
                { text: "4", callback_data: `trial_4_${userToAdd}` },
              ],
            ],
          },
        };

        await bot.sendMessage(
          msg.chat.id,
          `Теперь укажите тариф для партнера ${userToAdd}:\n
1. Рассылка и отслеживание в любые чаты + 1 товар активный с наличием 1, основной чат только суетолог (по умолчанию)
2. рассылка и отслеживание в любые чаты + 10 товаров, основной чат только суетолог
3. Рассылка и отслеживание в любые чаты + 100 товаров, основной чат только суетолог 
4. Без ограничений товаров и выбор Любого основной чата.`,
          keyboard
        );

        fs.writeFile(
          "database/usersToAdd.json",
          JSON.stringify(usersToAdd, null, 2),
          (err) => {
            if (err) console.log(err.message);
          }
        );

        await userData.update({
          Command: "setPartnerTrial",
        });
      }
      break;
  }
};
