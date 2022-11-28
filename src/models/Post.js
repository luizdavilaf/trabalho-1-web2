const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Post = sequelize.define('post', {
  title: DataTypes.STRING,
  description: DataTypes.STRING,   
}, {  
  modelName: 'posts'
});



module.exports = { Post };