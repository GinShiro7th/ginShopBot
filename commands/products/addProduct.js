const fs = require("fs");
const product = require("../../db/products");
const User = require("../../db/users");
const Keyword = require("../../db/keywords");
const MinusKeyword = require("../../db/minusKeywords");

module.exports = async function (msg, bot, option) {
  const products = require("../../database/products.json");
  const listIndex = products.findIndex((item) => item.userId === msg.from.id);

  const user = await User.findOne({
    where: {
      TgID: msg.from.id,
    },
  });

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
        "Введите ключевые слова через запятую"
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
      await bot.sendMessage(msg.chat.id, "Введите минус слова через запятую");
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

          const keywords = addedProduct.keywords
            .split(",")
            .map((word) => word.replace(/"/g, '').trim())
            .filter((word) => word !== "")
            .map(function(item){
              return {
                Keyword: item,
                ProductID: addedProduct.id,
                UserID: msg.from.id
              }
            });

          const minusKeywords = addedProduct.minusKeywords
            .split(",")
            .map((word) => word.replace(/"/g, '').trim())
            .filter((word) => word !== "")
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
