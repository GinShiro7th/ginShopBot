const usersToAdd = require('../../database/usersToAdd.json');
const User = require('../../db/users');
const fs = require('fs');

module.exports = async function(msg, bot, UserId, option, partner){
  const user = await User.findOne({
    where: {
      TgID: UserId
    }
  });

  const index = usersToAdd.findIndex(item => item.partner === partner);
  if (index !== -1){
    usersToAdd[index].trial = Number(option);

    const trialsMsgs = [
      "📢Рассылка и отслеживание в любые чаты + 📦1 товар активный с наличием 1, 💬основной чат только СУЕТОЛОГ",
      "📢Рассылка и отслеживание в любые чаты + 📦10 товаров, 💬основной чат только СУЕТОЛОГ",
      "📢Рассылка и отслеживание в любые чаты + 📦100 товаров, 💬основной чат только СУЕТОЛОГ",
      "📢Рассылка и отслеживание в любые чаты + 📦без ограничений количества товаров и 💬выбор любого основного чата"
    ];

    await bot.sendMessage(msg.chat.id, `✅Партнер @${usersToAdd[index].partner} успешно добавлен. Назначенный тариф:\n\n`+trialsMsgs[Number(option) - 1]);
    await user.update({
      Command: 'start'
    });

    fs.writeFile(
      "database/usersToAdd.json",
      JSON.stringify(usersToAdd, null, 2),
      (err) => {
        if (err) console.log(err.message);
      }
    );
    
  };
}