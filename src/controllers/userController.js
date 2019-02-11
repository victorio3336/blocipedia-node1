const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models/").Wiki;
const User = require("../db/models/").User;
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    signUp(req, res, next){
      res.render("user/signup", {title: "Sign-Up"});
    },
    create(req, res, next){
        //#1
        let newUser = {
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_conf
        };

        let msg = {
            to: newUser.email,
            from: 'test@example.com',
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                req.flash("notice", "You've successfully signed in!");
                res.redirect("/");
                })
            }
        });
        sgMail.send(msg)
        .catch((err) => {
            console.log(err)
        })
    },
    signInForm(req, res, next){
        res.render("user/signIn", {title: "Sign In"});
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
            if(!req.user){
              req.flash("notice", "Sign in failed. Please try again.")
              res.redirect("/users/sign_in");
            } else {
              req.flash("notice", "You've successfully signed in!");
              res.redirect("/");
            }
        })
    },
    signOut(req, res, next){
        req.logout();
        req.flash("Notice", "You've successfully signed out!")
        res.redirect("/")
    },
    upgradePage(req, res, next){
		res.render("users/upgrade");
	},
  upgrade(req, res, next){
	 const stripe = require("stripe")("sk_test_tDdH3AmHyZo6r5AFiDvcSNxu");
	 const token = req.body.stripeToken;
	 const charge = stripe.charges.create({
		 amount: 1500,
		 currency: "usd",
		 description: "Upgrade",
		 source: token,
		 statement_descriptor: 'Blocipedia Upgrade',
		 capture: false,
	 });
	 userQueries.upgrade(req.params.id, (err, user) => {
		 if(err && err.type ==="StripeCardError"){
			 req.flash("notice", "Your payment was unsuccessful");
			 res.redirect("/users/upgrade");
		 } else{
			 req.flash("notice", "Your payment was successful, you are now a Premium Member!");
			 res.redirect(`/`);

		 }
	 }) ;
 },

 downgradePage(req, res, next) {
	 res.render("users/downgrade");
 },

 	downgrade(req, res, next) {
	userQueries.downgrade(req.user.dataValues.id);
	wikiQueries.privateToPublic(req.user.dataValues.id);
	req.flash('notice', 'You are no longer a premium user and your private wikis are now public.');
	res.redirect('/');
},
  }
