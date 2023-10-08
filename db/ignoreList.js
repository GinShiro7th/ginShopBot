const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const IgnoreList = sequelize.define('IgnoreList', {
  UserName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FromSeller: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

module.exports = IgnoreList;
