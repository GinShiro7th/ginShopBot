const fs = require("fs");
const xlsx = require("xlsx");

const User = require("../db/users");
const Product = require("../db/products");
const Keyword = require("../db/keywords");
const MinusKeyword = require("../db/minusKeywords");

const downloadFile = require("../functions/downloadFile");

const expectedColumns = [
  "Наличие",
  "ID",
  "Бренд",
  "Категория",
  "Подкатегория 1",
  "Подкатегория 2",
  "Наименование",
  "Ключевые слова",
  "Минус слова",
];

module.exports = async function (msg, bot, option, userId) {
  const user = await User.findOne({
    where: {
      TgID: userId,
    },
  });

  switch (option) {
    case "1":
      await bot.sendMessage(
        msg.chat.id,
        "Пришлите xlsx файл, из которого надо загрузить товары. Все ваши товары (если они есть) в базе данных будут заменены товарами из файла. Это можно использовать для массового редактирования (сначала загрузить список товаров из базы в файл, затем редактировать этот файл, нажать на кнопку 'загрузить из файла' и отправить редактированный файл).  В файле должны быть именно такие столбцы:\n" +
          expectedColumns.join(", ")
      );
      await user.update({ Command: "getFileForUpdate" });
      break;
    case "2":
      if (!msg.document) {
        return await bot.sendMessage(
          msg.chat.id,
          "Вы отправили не файл, пожалуйста, пришлите xlsx файл"
        );
      }

      const fileId = msg.document.file_id;
      const uniqId = msg.document.file_unique_id;
      const fileName = msg.document.file_name;

      if (fileName.split(".")[1] !== "xlsx") {
        return await bot.sendMessage(
          msg.chat.id,
          "Вы отправили не xlsx файл, пожалуйста, пришлите именно xlsx файл"
        );
      }

      const savePath = `./files/${uniqId + "_" + fileName}`;

      await downloadFile(fileId, savePath);

      try {
        const fileBuffer = await fs.promises.readFile(savePath);

        const workbook = xlsx.read(fileBuffer, { type: "buffer" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        console.log(jsonData);

        if (jsonData.length) {
          const missingColumns = expectedColumns.filter(
            (column) => !jsonData[0][column]
          );

          if (missingColumns.length === 0) {
            console.log("Все ожидаемые столбцы присутствуют в XLSX файле.");
          } else {
            return await bot.sendMessage(
              msg.chat.id,
              "Ваш xlsx файл не соответсвует принимаемому формату. В файле должны быть именно такие столбцы:\n" +
                expectedColumns.join(", ")
            );
          }

          await Product.destroy({
            where: {
              SellerId: userId,
            },
          });

          await Keyword.destroy({
            where: {
              UserID: userId,
            },
          });

          await MinusKeyword.destroy({
            where: {
              UserID: userId,
            },
          });

          for (const addedProduct of jsonData) {
            const newProduct = await Product.create({
              isAvaible: addedProduct["Наличие"],
              productID: addedProduct["ID"],
              Brand: addedProduct["Бренд"],
              Category: addedProduct["Категория"],
              Subcategory1: addedProduct["Подкатегория 1"],
              Subcategory2: addedProduct["Подкатегория 2"],
              Name: addedProduct["Наименование"],
              SellerId: userId,
            });

            const keywords = addedProduct["Ключевые слова"]
              .split(",")
              .map((word) => word.replace(/"/g, "").trim())
              .filter((word) => word !== "")
              .map(function (item) {
                return {
                  Keyword: item,
                  ProductID: addedProduct["ID"],
                  UserID: userId,
                };
              });

            const minusKeywords = addedProduct["Минус слова"]
              .split(",")
              .map((word) => word.replace(/"/g, "").trim())
              .filter((word) => word !== "")
              .map(function (item) {
                return {
                  Keyword: item,
                  ProductID: addedProduct["ID"],
                  UserID: userId,
                };
              });

            await Keyword.bulkCreate(keywords);
            await MinusKeyword.bulkCreate(minusKeywords);
          }
        }

        fs.unlink(savePath, (err) => {
          if (err) console.log(err);
        });
      } catch (err) {
        console.error("Ошибка при чтении файла:", err.message);
      }

      // Получение данных из первого листа (worksheet) в файле

      await bot.sendMessage(msg.chat.id, "Список товаров успешно обновлен");
      await user.update({ Command: "start" });
      break;
  }
};
