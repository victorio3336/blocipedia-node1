const Wiki = require("./models").Wiki
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
    getAllWikis(userId, callback){
        return Wiki.all({
          where: {
            [Op.or]: [{ private: false }, { userId: userId }]
          }
        })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    },
    addWiki(newWiki, callback){
        return Wiki.create({
          title: newWiki.title,
          body: newWiki.body,
          private: newWiki.private,
          userId: newWiki.userId
        })
        .then((wiki) => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        })
    },
    getWiki(id, callback){
        return Wiki.findById(id)
        .then((wiki) => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        })
    },
    updateWiki(req, updatedWiki, callback){
      return Wiki.findById(req.params.wikiId)
      .then((wiki) => {
        if(!wiki){
          return callback("Wiki not found");
        }
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      })
    },
    deleteWiki(req, callback){
        return Wiki.findById(req.params.wikiId)
        .then((wiki) => {
          //const authorized = new Authorizer(req.user, topic).destroy();
          //if(authorized) {
            wiki.destroy()
            .then((res) => {
              callback(null, wiki);
            });

          })
     .catch((err) => {
       callback(err);
     });
 },
 downgrade(req, callback){
   return Wiki.update(
     {private: false},
     {where: {userId: req.user.id}}
   )
   .then((wiki) => {
     callback(null, wiki)
   })
   .catch((err) => {
     callback(err)
   })
 }
}
