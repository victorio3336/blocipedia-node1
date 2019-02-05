const wikiQueries = require("../db/queries.wikis");
const collaboratorQueries = require("../db/queries.collaborators")
const userQueries = require("../db/queries.users");
const markdown = require( "markdown" ).markdown;

module.exports = {

    new(req, res, next){
        res.render("wiki/new", {title: "Create a Wiki"});
        console.log("new wiki")
    },
    index(req, res, next){
        wikiQueries.getAllWikis(req.user ? req.user.id : null, (err, wikis) => {

            if(err){
                res.redirect(500, "static/index");
            } else {
                res.render("wiki/index", {wikis, title: "Wikis"})
            }
        })
    },
    create(req, res, next){

        let privacy;

        if(req.body.privacy === "private"){
            privacy = true;
        } else {
            privacy = false;
        }

        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: privacy,
            userId: req.user.id
        };
        wikiQueries.addWiki(newWiki, (err, wiki) => {
            if(err){
                res.redirect(500, "/wikis/new");
                console.log(err)
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
    },
    wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            if(err || wiki == null){
                res.redirect(404, "/")
            } else {
                let wikiMDhtml = markdown.toHTML(wiki.body)
                res.render("wiki/show", {wiki, body: wikiMDhtml, title: "Wiki", isCollaborator});
            }
        });

        destroy(req, res, next){
        wikiQueries.deleteWiki(req, (err, wiki) => {
            if(err){

                res.redirect(
                    typeof err === "number" ? err : 500,
                    `/wikis/${req.params.wikiId}`
                  );
            } else {
                res.redirect(303, "/wikis")
            }
        });
    },
    edit(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, wiki) => {
            if(err || wiki == null){
                console.log(err)
                res.redirect(404, "/");
            } else {
            }
     })
     .catch((err) => {
         console.log(err)
     })
 },
 update(req, res, next){
     wikiQueries.updateWiki(req, req.body, (err, wiki) => {
         if(err || wiki == null){
             console.log("update err is...")
             console.log(err)
           res.redirect(401, `/wikis/${req.params.wikiId}/edit`);
         } else {
           res.redirect(`/wikis/${req.params.wikiId}`);
         }
     });
 },
}
