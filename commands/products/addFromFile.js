const fs = require("fs");
const xlsx = require("xlsx");

const User = require("../../db/users");
const Product = require("../../db/products");
const Keyword = require('../../db/keywords');
const MinusKeyword = require('../../db/minusKeywords');

const downloadFile = require("../../functions/downloadFile");
const Trial = require("../../db/trial");

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
        "Пришлите xlsx файл, из которого надо добавить товары. В файле должны быть именно такие столбцы:\n" + expectedColumns.join(', ') 
        + ". Если у вас в столбце 'Минус слова' есть шаблоны, то их заключать в ковычки не нужно, а остальные минус слова нужно заключать в ковычки"
      );
      await user.update({ Command: "getFileForAdd" });
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
            fs.unlink(savePath, (err) => {
              if (err) console.log(err);
            });
            return await bot.sendMessage(
              msg.chat.id,
              "Ваш xlsx файл не соответсвует принимаемому формату. В файле должны быть именно такие столбцы:\n" +
                expectedColumns.join(", ")
            );
          }

          const trial = await Trial.findOne({
            where: {
              UserId: userId
            }
          });

          const maxProductCount = trial ? trial.Type === '1' ? 1 : trial.Type === "2" ? 10 : trial.Type == '3' ? 100 : 999999999 : 999999999;

          for (const addedProduct of jsonData){
            const prodInDb = await Product.findOne({
              where: {
                productID: addedProduct['ID'],
                SellerId: userId 
              }
            });

            const productCount = await Product.count({
              where: {
                SellerId: userId
              }
            });

            if (productCount >= maxProductCount){
              break;
            }

            if (!prodInDb && Number(addedProduct['Наличие']) > 0){
              
              const newProduct = await Product.create({
                isAvaible: addedProduct['Наличие'],
                productID: addedProduct['ID'],
                Name: addedProduct['Наименование'],
                Price: addedProduct['Цена'],
                SellerId: userId
              });

              const keywords = addedProduct['Ключевые слова']
                .split(',')
                .map(word => word.trim())
                .filter(word => word !== '')
                .map(function(item){
                  return {
                    Keyword: item,
                    ProductID: addedProduct["ID"],
                    UserID: userId
                  }
                });

              const minusKeywords = addedProduct['Минус слова']
                .split(',')
                .map(word => word.trim())
                .filter(word => word !== '')
                .map(function(item){
                  return {
                    Keyword: item,
                    ProductID: addedProduct["ID"],
                    UserID: userId
                  }
                });

              await Keyword.bulkCreate(keywords);
              await MinusKeyword.bulkCreate(minusKeywords);
            }
          }
        }

        fs.unlink(savePath, (err) => {if (err) console.log(err)});
        
      } catch (err) {
        console.error("Ошибка при чтении файла:", err.message);
      }

      await bot.sendMessage(msg.chat.id, "Товары из файла успешно добавлены");
      await user.update({ Command: "start" });
      break;
  }
};
