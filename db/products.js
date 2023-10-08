const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Product = sequelize.define('Product', {
  isAvaible: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  SellerId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Product;
