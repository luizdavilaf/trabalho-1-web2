const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Post = sequelize.define('Post', {
  title: DataTypes.STRING,
  description: DataTypes.STRING,   
}, {  
  modelName: 'posts'
});



module.exports = { Post };