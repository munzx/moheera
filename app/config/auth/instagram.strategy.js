var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('../../models/user'),
	accounts = require('../../models/account'),
	InstagramStrategy = require('passport-instagram').Strategy;

module.exports = function () {
	passport.use(new InstagramStrategy({
	    clientID: 'cda7ad13fe2b4d76933b8ed346aafdec',
	    clientSecret: '634c0c264c9a44a2acb78931e8d408b1',
	    callbackURL: "http://www.moheera.com/auth/instagram/callback",
	    enableProof: false
	  },
	  function(accessToken, refreshToken, profile, done) {
	    accounts.findOne({ providerUserId: profile.id, provider: 'instagram' }).populate('user').exec(function (err, account) {
	    	if(err){
	    		 return done(err);
	    	} else if(account){
	    		 return done(err, account);
	    	} else {
	    		var providerInfo = {
	    			provider: 'instagram',
	    			providerUserId: profile.id,
	    			accessToken: accessToken,
	    			firstName: profile.firstName,
	    			lastName: profile.lastName,
	    			email: profile.email
	    		}

	    		var newAccount = new accounts(providerInfo);
	    		newAccount.save(function (err, account) {
	    			if(err){
	    				return done(err, null);
	    			} else {
	    				return done(err, account);
	    			}
	    		});
	    	}
	    });
	  }
	));
}();