const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {

  findUser(username){
    return User.all({
      where: {
        username: username
      }
    })
  },
// #2
  createUser(newUser, callback){
// #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4
    return User.create({
        username: newUser.username,
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
