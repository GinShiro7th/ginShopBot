const fs = require("fs");
const xlsx = require("xlsx");
const product = require("../../db/products");
const Sequelize = require("sequelize");
const Keyword = require("../../db/keywords");
const MinusKeyword = require("../../db/minusKeywords");

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

  const productData = productList.length ? productList.map((prod) => ({
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
  })) : [{
    "Наличие": {},
    "ID": {},
    "Наименование": {},
    "Цена": {},
    "Ключевые слова": {},
    "Минус слова": {},
  }];

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(productData);

  // Добавление листа в книгу
  xlsx.utils.book_append_sheet(workbook, worksheet, "Товар");

  const fixedWidthColumns = {
    "Наличие": { wpx: 80 }, // Установите фиксированную ширину в пикселях
    "ID": { wpx: 80 }, // Установите фиксированную ширину в пикселях
  };

  const arrayOfArray = productData.map((row) => Object.values(row));
  
  const autoWidthColumns = arrayOfArray[0] ? arrayOfArray[0].map((a, i) => ({
    wch: Math.max(...arrayOfArray.map(a2 => a2[i] ? a2[i].toString().length : 0)),
  })) : undefined;

  worksheet["!cols"] = autoWidthColumns ? autoWidthColumns.map((col, i) => {
    const columnName = Object.keys(fixedWidthColumns)[i];
    return fixedWidthColumns[columnName] || col;
  }) : [
    {wpx: 80},
    {wpx: 40},
    {width: 20},
    {width: 20},
    {width: 20},
    {width: 20},
  ];

  xlsx.writeFile(workbook, `files/products_${username}.xlsx`);

  await bot.sendDocument(msg.chat.id, `files/products_${username}.xlsx`);

  fs.unlink(`files/products_${username}.xlsx`, (err) =>
    err ? console.log(err.message) : null
  );
};
