const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Keyword = sequelize.define('Keyword', {
  Keyword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ProductID : {
    type: DataTypes.STRING,
    allowNull: false
  },
  UserID: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
});

module.exports = Keyword;
