const importFromFile = require('../models/keyboard/importFromFile');
const product = require('../db/products');
const User = require('../db/users');

module.exports = async function (msg, bot) {
  const userProducts = await product.findAll({
    where: { SellerId : msg.from.id},
    attributes: ['Name', "productID"]
  })

  if (!userProducts.length) {
    await bot.sendMessage(msg.chat.id, "⚫️У вас пока нет товаров на продажу", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `📎Загрузить из файла`,
              callback_data: "loadFromFile",
            },
          ],
        ],
      },
    });
  } else {

    let dashBoard = "📋Список ваших товаров";

    const messages = [];

    for (let i=0; i<userProducts.length; i++){
      if (i % 30 || i === 0){
        dashBoard += `\n${i+1} - ${userProducts[i].dataValues.Name}, ID - ${userProducts[i].dataValues.productID}`
      } else {
        messages.push(dashBoard);
        dashBoard = '';
        dashBoard += `\n${i+1} - ${userProducts[i].dataValues.Name}, ID - ${userProducts[i].dataValues.productID}`  
      }
    };

    messages.push(dashBoard);

    for (let i = 0; i < messages.length; i++)
      if (i !== messages.length - 1) {
        await bot.sendMessage(msg.chat.id, messages[i]);
      } else {
        await bot.sendMessage(msg.chat.id, messages[i], importFromFile.inline());
      }
    }
    
  
  await User.update({
    Command: 'start'
  }, 
  {
    where: {
      TgID: msg.from.id
    }
  })
};
