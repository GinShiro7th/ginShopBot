const fs = require("fs");
const xlsx = require("xlsx");
const product = require("../db/products");
const Sequelize = require("sequelize");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");

module.exports = async function (msg, bot, userId, username) {
  const productList = await product.findAll({
    where: {
      SellerId: userId,
      IsAvaible: {
        [Sequelize.Op.gt]: "0",
      },
    },
  });

  const keywords = await Keyword.findAll({
    where: {
      UserID: userId,
    },
  });

  const minusKeywords = await MinusKeyword.findAll({
    where: {
      UserID: userId,
    },
  });

  const productData = productList.map((prod) => ({
    "Наличие": prod.dataValues.isAvaible,
    "ID": prod.dataValues.productID,
    "Наименование": prod.dataValues.Name,
    "Цена": prod.dataValues.Price,
    "Ключевые слова": keywords
      .filter((item) => item.dataValues.ProductID === prod.dataValues.productID)
      .map((item) => item.dataValues.Keyword)
      .join(", "),
    "Минус слова": minusKeywords
      .filter((item) => item.dataValues.ProductID === prod.dataValues.productID)
      .map((item) => item.dataValues.Keyword)
      .join(", "),
  }));
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(productData);

  // Добавление листа в книгу
  xlsx.utils.book_append_sheet(workbook, worksheet, "Товар");

  const columnWidths = [
    { wpx: 50 },
    { wpx: 50 },
    { wpx: 80 },
    { wpx: 70 },
    { wpx: 200 },
    { wpx: 200 },
  ];

  worksheet["!cols"] = columnWidths;

  const date = Date.now();
  // Сохранение xlsx-файла
  xlsx.writeFile(workbook, `files/products_${username}.xlsx`);

  await bot.sendDocument(msg.chat.id, `files/products_${username}.xlsx`);

  fs.unlink(`files/products_${username}.xlsx`, (err) =>
    err ? console.log(err.message) : null
  );
};
