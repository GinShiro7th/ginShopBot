const fs = require("fs");
const xlsx = require("xlsx");

const User = require("../../db/users");
const Product = require("../../db/products");
const Keyword = require("../../db/keywords");
const MinusKeyword = require("../../db/minusKeywords");
const Trial = require('../../db/trial');

const downloadFile = require("../../functions/downloadFile");

const expectedColumns = [
  "Наличие",
  "ID",
  "Наименование",
  "Цена",
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
          expectedColumns.join(", ") + ". Если у вас в столбце 'Минус слова' есть шаблоны, то их заключать в кавычки не нужно, а остальные минус слова нужно заключать в кавычки"
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
        
        if (jsonData.length) {
          const missingColumns = expectedColumns.filter(
            (column) =>{
              return !jsonData[0][column] && jsonData[0][column] !== 0
            } 
          );

          if (missingColumns.length === 0) {
            console.log("Все ожидаемые столбцы присутствуют в XLSX файле.");
          } else {
            console.log(missingColumns);
            fs.unlink(savePath, (err) => {
              if (err) console.log(err);
            });
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

          const trial = await Trial.findOne({
            where: {
              UserId: userId
            }
          });

          const maxProductCount = trial ? trial.Type === '1' ? 1 : trial.Type === '2' ? 10 : trial.Type === '3' ? 100 : 999999999 : 999999999;

          for (const addedProduct of jsonData) {
            
            const productCount = await Product.count({
              where: {
                SellerId: userId
              }
            });

            if (productCount >= maxProductCount){
              break;
            }
            
            const exist = await Product.findOne({
              where: {
                productID: addedProduct["ID"],
                SellerId: userId
              }
            });

            if (!exist && Number(addedProduct['Наличие']) > 0){
              
              console.log(addedProduct);
              
              const newProduct = await Product.create({
                isAvaible: addedProduct["Наличие"],
                productID: addedProduct["ID"],
                Name: addedProduct["Наименование"],
                Price: addedProduct["Цена"],
                SellerId: userId,
              });

              const regex = /(["“«])([^"”»]+)(["”»])\s*,?/g;
              const resKeywords = [];
              const resMinus = [];
              let match;

              while ((match = regex.exec(addedProduct["Ключевые слова"])) !== null) {
                resKeywords.push(match[1] + match[2] + match[3]);
              }

              while ((match = regex.exec(addedProduct["Минус слова"])) !== null) {
                resMinus.push(match[1] + match[2] + match[3]);
              }

              console.log(resKeywords);
              console.log(resMinus);

              const keywords = resKeywords
                .map(function (item) {
                  return {
                    Keyword: item,
                    ProductID: addedProduct["ID"],
                    UserID: userId,
                  };
                });

              const minusKeywords = resMinus
                .map(function (item) {
                  return {
                    Keyword: item,
                    ProductID: addedProduct["ID"],
                    UserID: userId,
                  };
                });
              
              console.log(minusKeywords[0]);
              
              await Keyword.bulkCreate(keywords);
              await MinusKeyword.bulkCreate(minusKeywords);
            }
          }
        }

        fs.unlink(savePath, (err) => {
          if (err) console.log(err);
        });
      } catch (err) {
        console.error("Ошибка при чтении файла:", err);
      }

      // Получение данных из первого листа (worksheet) в файле

      await bot.sendMessage(msg.chat.id, "Список товаров успешно обновлен");
      await user.update({ Command: "start" });
      break;
  }
};
