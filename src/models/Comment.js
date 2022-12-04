const { DataTypes } = require("sequelize");
const sequelize = require("../database/sequelize-connection");



const Comment = sequelize.define('comment', {  
  description: DataTypes.STRING,
  hide_comment: {
    type: DataTypes.BOOLEAN,
    allowNull: false, 
    defaultValue: false
  },   
}, {  
  modelName: 'comments'
});



module.exports = { Comment };