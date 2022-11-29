const sequelize = require("../database/sequelize-connection");
const { Post } = require('./Post');
const { User } = require('./User');
const { Image } = require('./Image');
const { Comment } = require('./Comment');
const { Like } = require('./Like');

Post.belongsTo(User);
User.hasMany(Post);

Post.hasMany(Image);
Image.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

Comment.belongsTo(User);
User.hasMany(Comment);

Post.hasMany(Like);
Like.belongsTo(Post);

Like.belongsTo(User);
User.hasMany(Like);

console.log('Sync Models');
sequelize.sync();

