const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const MinusKeywordsTemplate = sequelize.define("MinusKeywordsTemplate", {
  Template: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Keywords: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UserId: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
});

module.exports = MinusKeywordsTemplate;