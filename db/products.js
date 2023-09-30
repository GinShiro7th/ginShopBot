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
  Brand: {
    type: DataTypes.STRING,
    allowNull: false  
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Subcategory1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Subcategory2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  SellerId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Product;
