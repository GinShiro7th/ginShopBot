const fs = require('fs');

const User = require('../../db/users');
const Chat = require('../../db/chats');
const Keyword = require('../../db/keywords');
const MinusKeyword = require('../../db/minusKeywords');
const Product = require('../../db/products');
const BotState = require('../../db/botState');
const GlobalMinusKeywords = require('../../db/globalMinusKeywords');
const IgnoreList = require('../../db/ignoreList');
const Trial = require('../../db/trial');

module.exports = async function(msg, bot, option){
  const usersToAdd = require('../../database/usersToAdd.json');

  const user = await User.findOne({
    where: {
      TgID: msg.from.id
    }
  })

  switch (option){
    case '1':
      await bot.sendMessage(msg.chat.id, "#️⃣Пришлите юзернейм того партнера из списка, которому надо ограничить доступ");
      await user.update({
        Command: "limitPartner"
      });
      break
    case '2':
      const Username = msg.text.replace('@', '');
      
      const userToLimit = await User.findOne({
        where: {
          Username
        }
      })
      
      const userIndex = usersToAdd.findIndex(item => item.partner === Username);

      if(userToLimit){
        await Chat.destroy({
          where: {
            FromUser: userToLimit.TgID
          }
        });
        await Keyword.destroy({
          where: {
            UserID: userToLimit.TgID
          }
        });
        await MinusKeyword.destroy({
          where: {
            UserID: userToLimit.TgID
          }
        });
        await Product.destroy({
          where: {
            SellerId: userToLimit.TgID
          }
        });
        await BotState.destroy({
          where: {
            FromUser: userToLimit.TgID
          }
        });
        await GlobalMinusKeywords.destroy({ where: {FromUser: userToLimit.TgID}});
        await IgnoreList.destroy({ where: { FromSeller: userToLimit.TgID}});
        await Trial.destroy({ where: { UserId : userToLimit.TgID}});
        
        await userToLimit.destroy();
      } else if (userIndex !== -1){
        usersToAdd.splice(userIndex, 1);
      } else {
        return await bot.sendMessage(msg.chat.id, "Данного юзера нет в списке партнеров, пришлите юзернейм того, кто есть в списке");
      }
      
      await bot.sendMessage(msg.chat.id, `✅Доступ для ${Username} ограничен`);

      await user.update({
        Command: "start"
      });
      
      fs.writeFile('database/usersToAdd.json', JSON.stringify(usersToAdd, null, 2), (err) => err ? console.log(err) : null);
      break
  }
}