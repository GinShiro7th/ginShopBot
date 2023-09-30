const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
  TgID: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  Username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IsAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  Command: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;
