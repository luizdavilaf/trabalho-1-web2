const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Image = sequelize.define('image', {
  link: DataTypes.STRING,  
}, {
  timestamps: false,
  modelName: 'images'
});



module.exports = { Image };