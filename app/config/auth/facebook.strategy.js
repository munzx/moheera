var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('../../models/user'),
	accounts = require('../../models/account'),
	FacebookStrategy = require('passport-facebook');

module.exports = function () {
	passport.use(new FacebookStrategy({
	    clientID: 677830862246801,
	    clientSecret: '3fdd192295920a865e01089712263a6a',
	    callbackURL: "http://www.moheera.com/auth/facebook/callback",
	    enableProof: false
	  },
	  function(accessToken, refreshToken, profile, done) {
	    accounts.findOne({ providerUserId: profile.id, provider: 'facebook' }).populate('user').exec(function (err, account) {
	    	if(err){
	    		 return done(err);
	    	} else if(account){
	    		 return done(err, account);
	    	} else {
	    		var providerInfo = {
	    			provider: 'facebook',
	    			providerUserId: profile.id,
	    			accessToken: accessToken,
	    			firstName: profile.name.givenName,
	    			lastName: profile.name.familyName,
	    			email: profile.emails[0].value
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