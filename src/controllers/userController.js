const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const Wiki = require("../db/models/").Wiki;
const User = require("../db/models/").User;
const passport = require("passport");
const sgMail = require('@sendgrid/mail');


module.exports = {
    signUp(req, res, next){
      res.render("user/signup");
    },
    create(req, res, next){
        let newUser = {
            username: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirmation: req.body.password_confirmation
        };

        userQueries.createUser(newUser, (err, user) => {
			if(err){
				req.flash("error", err);
				res.redirect("/users/signup");
			} else {
				passport.authenticate("local")(req, res, () => {
					req.flash("notice", "You've successfully signed in!");
					sgMail.setApiKey(process.env.SENDGRID_API_KEY);
					const msg = {
						to: user.email,
						from: 'victoreagle33@gmail.com',
						subject: 'The new Wiki',
						text: 'the way to collaborate',
						html: '<strong>Welcome to Blocipedia!</strong>',
					};
				 sgMail.send(msg);
					res.redirect("/");
				})
			}
		});
		console.log(process.env.SENDGRID_API_KEY);
	},

    signInForm(req, res, next){
        res.render("user/signIn");
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, ()=> {
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
		res.render("user/upgrade");
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
			 res.redirect("/user/upgrade");
		 } else{
			 req.flash("notice", "Your payment was successful, you are now a Premium Member!");
			 res.redirect(`/`);

		 }
	 }) ;
 },

 downgradePage(req, res, next) {
	 res.render("user/downgrade");
 },

 	downgrade(req, res, next) {
	userQueries.downgrade(req.user.dataValues.id);
	wikiQueries.privateToPublic(req.user.dataValues.id);
	req.flash('notice', 'You are no longer a premium user and your private wikis are now public.');
	res.redirect('/');
},
showCollaborations(req, res, next) {
  userQueries.getUser(req.user.id, (err, result) => {
    user = result['user'];
    collaborations = result['collaborations'];
    if (err || user == null) {
      res.redirect(404, '/');
    } else {
      res.render('user/collaborations', { user, collaborations });
    }
  });
},
  }
