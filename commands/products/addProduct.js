const fs = require("fs");
const product = require("../../db/products");
const User = require("../../db/users");
const Keyword = require("../../db/keywords");
const MinusKeyword = require("../../db/minusKeywords");
const Trial = require("../../db/trial");

module.exports = async function (msg, bot, option) {
  const products = require("../../database/products.json");
  const listIndex = products.findIndex((item) => item.userId === msg.from.id);

  const user = await User.findOne({
    where: {
      TgID: msg.from.id,
    },
  });

  const trial = await Trial.findOne({
    where: {
      UserId: msg.from.id
    }
  });

  const productCount = await product.count({
    where: {
      SellerId: msg.from.id
    }
  });

  if (trial){
    switch (trial.Type){
      case '1':
        if (productCount >= 1){
          return await bot.sendMessage(msg.chat.id, "⭕️Вы больше не можете добавлять товары, так как ваш тариф позволяет добавить вам только один товар, вы можете только заменить уже имеющийся, редактировав его");
        }
        break;
      case '2':
        if (productCount >= 10){
          return await bot.sendMessage(msg.chat.id, "⭕️Вы больше не можете добавлять товары, так как ваш тариф позволяет добавить вам только 10 товаров, вы можете только заменить уже имеющиеся, редактировав их");
        }
        break;
      case '3':
        if (productCount >= 100){
          return await bot.sendMessage(msg.chat.id, "⭕️Вы больше не можете добавлять товары, так как ваш тариф позволяет добавить вам только 100 товаров, вы можете только заменить уже имеющиеся, редактировав их");
        }
        break;
    }
  }

  switch (option) {
    case "-1":
      await bot.sendMessage(
        msg.chat.id,
        "✏️Введите количество товара в наличии"
      );
      if (listIndex === -1) {
        products.push({
          userId: msg.from.id,
          productList: [],
        });
      }
      await user.update({
        Command: "addProduct",
      });
      break;
    case "0":
      const count = msg.text;
      await bot.sendMessage(msg.chat.id, "Введите ID товара");
      products[listIndex].productList.push({
        count,
        id: "",
        keywords: "",
        minusKeywords: "",
        answer: "",
        price: "",
      });
      await user.update({
        Command: "addProductID",
      });
      break;
    case "01":
      const id = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].id = id;

      await user.update({
        Command: "addKeywords",
      });
      await bot.sendMessage(
        msg.chat.id,
        'Введите ключевые слова через запятую, заключив их в такие "" кавычки'
      );
      break;
    case "2":
      const keywords = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].keywords = keywords;
      await user.update({
        Command: "addMinusKeywords",
      });
      await bot.sendMessage(msg.chat.id, 'Введите минус слова через запятую, заключив их в такие "" кавычки, если в добавок к ним хотите ввести шаблон минус слов, то его тоже нужно заключить в них');
      break;
    case "3":
      const minusKeywords = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].minusKeywords = minusKeywords;
      await bot.sendMessage(msg.chat.id, "Введите название товара");
      await user.update({
        Command: "addAnswerText",
      });
      break;
    case "4":
      const answerText = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].answer = answerText;

      await bot.sendMessage(msg.chat.id, "Введите цену товара");
      await user.update({
        Command: "addPrice",
      });
      break;
    case '5':
      const price = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].price = price;
      
      const addedProduct =
        products[listIndex].productList[
          products[listIndex].productList.length - 1
        ];

      const productInDb = await product.findOne({
        where: {
          productID: addedProduct.id,
          SellerId: products[listIndex].userId,
        },
      });
      if (productInDb) {
        await bot.sendMessage(
          msg.chat.id,
          "⭕️Такой товар уже есть в списке ваших товаров"
        );
      } else {
        try {
          const newProduct = await product.create({
            isAvaible: addedProduct.count,
            productID: addedProduct.id,
            Name: addedProduct.answer,
            Price: addedProduct.price,
            SellerId: products[listIndex].userId,
          });

          const regex = /(["“«])([^"”»]+)(["”»])\s*,?/g;
          const resKeywords = [];
          const resMinus = [];
          let match;

          while ((match = regex.exec(addedProduct.keywords)) !== null) {
            resKeywords.push(match[1] + match[2] + match[3]);
          }

          while ((match = regex.exec(addedProduct.minusKeywords)) !== null) {
            resMinus.push(match[1] + match[2] + match[3]);
          }

          const keywords = resKeywords
          .filter(item => item !== '", "' && item !== '","')
            .map(function(item){
              return {
                Keyword: item,
                ProductID: addedProduct.id,
                UserID: msg.from.id
              }
            });

          const minusKeywords = resMinus
          .filter(item => item !== '", "' && item !== '","')
            .map(function(item){
              return {
                Keyword: item,
                ProductID: addedProduct.id,
                UserID: msg.from.id
              }
            });

            await Keyword.bulkCreate(keywords);
            await MinusKeyword.bulkCreate(minusKeywords);
          
          console.log("новый товар добавлен в базу");
        } catch (err) {
          console.log("ошибка при добавлении товара в базу", err.message);
        }

        products[listIndex].productList.pop();

        await bot.sendMessage(msg.chat.id, "✅Товар успешно добавлен");
      }
      await user.update({
        Command: "start",
      });
      break;
  }
  fs.writeFile(
    "database/products.json",
    JSON.stringify(products, null, 2),
    (err) => (err ? console.log(err.message) : null)
  );
};
