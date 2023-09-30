const fs = require("fs");
const product = require("../db/products");
const User = require("../db/users");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");

module.exports = async function (msg, bot, option) {
  const products = require("../database/products.json");
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
        brand: "",
        category: "",
        subCategory1: "",
        subCategory2: "",
        keywords: "",
        minusKeywords: "",
        answer: "",
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
        Command: "addBrand",
      });

      await bot.sendMessage(msg.chat.id, "Введите брэнд товара");
      break;
    case "012":
      const brand = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].brand = brand;
      await user.update({
        Command: "addCategory",
      });
      await bot.sendMessage(msg.chat.id, "Введите категорию");
      break;
    case "02":
      const category = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].category = category;
      await user.update({
        Command: "addSubCategory1",
      });
      await bot.sendMessage(msg.chat.id, "Введите первую подкатегорию");
      break;
    case "03":
      const subCategory1 = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].subCategory1 = subCategory1;
      await user.update({
        Command: "addSubCategory2",
      });
      await bot.sendMessage(msg.chat.id, "Введите вторую подкатегорию");
      break;
    case "1":
      const subCategory2 = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].subCategory2 = subCategory2;
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
      await bot.sendMessage(msg.chat.id, "Введите ответ для бота");
      await user.update({
        Command: "addAnswerText",
      });
      break;
    case "4":
      const answerText = msg.text;
      products[listIndex].productList[
        products[listIndex].productList.length - 1
      ].answer = answerText;

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
            Brand: addedProduct.brand,
            Category: addedProduct.category,
            Subcategory1: addedProduct.subCategory1,
            Subcategory2: addedProduct.subCategory2,
            Name: addedProduct.answer,
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
          console.log("ошибка при добавлении товара в базу");
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
