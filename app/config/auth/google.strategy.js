'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('../../models/user'),
	accounts = require('../../models/account'),
	GoogleStrategy = require('passport-google-openidconnect').Strategy;

module.exports = function () {
	passport.use(new GoogleStrategy({
	    clientID: '271407544946-m42a6lda0je0053qp71vje7fj8j462f6.apps.googleusercontent.com',
	    clientSecret: 'gkPQ5gCHc911asCKidRn85Di',
	    callbackURL: "http://www.moheera.com/auth/google/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    accounts.findOne({ providerUserId: profile.id, provider: 'google' }).populate('user').exec(function (err, account) {
	    	if(err){
	    		 return done(err);
	    	} else if(account){
	    		 return done(err, account);
	    	} else {
	    		var providerInfo = {
	    			provider: 'google',
	    			providerUserId: profile.id,
	    			accessToken: accessToken,
	    			firstName: profile.name.givenName,
	    			lastName: profile.name.familyName,
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