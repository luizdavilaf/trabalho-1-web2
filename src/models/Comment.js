const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Comment = sequelize.define('comment', {  
  description: DataTypes.STRING,
  hide_comment: DataTypes.BOOLEAN,   
}, {  
  modelName: 'comments'
});



module.exports = { Comment };