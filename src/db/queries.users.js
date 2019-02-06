require('dotenv').config();
const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

  findUser(username){
    return User.all({
      where: {
        name: username
      }
    })
  },

  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
        name: newUser.username,
        email: newUser.email,
        password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getUser(id, callback){
      User.findById(id)
      .then((user) => {
        if(!user){
          callback(404);
        } else{
          callback(null, user);
          }
        })
        .catch((err) => {
          callback(err);
      });
    },
}
