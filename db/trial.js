const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Trial = sequelize.define('Trial', {
  Type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UserId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
});

module.exports = Trial;
