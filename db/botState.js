const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const BotState = sequelize.define('BotState', {
  FromUser: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
});

module.exports = BotState;
