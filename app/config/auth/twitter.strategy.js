'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('../../models/user'),
	accounts = require('../../models/account'),
	TwitterStrategy = require('passport-twitter').Strategy;

	module.exports = function () {
	passport.use(new TwitterStrategy({
	    consumerKey: 'C7csykiUTYzyNmMlHlaDUZzOt',
	    consumerSecret: 'Cmq0ch3QhZDWjj8azZQm2FY0Zm1VpcqiXXwy2u9THxQmDleQRp',
	    callbackURL: "http://localhost:3000/auth/twitter/callback"
	  },
	  function(accessToken, refreshToken, profile, done) {
	    accounts.findOne({ providerUserId: profile.id, provider: 'twitter' }).populate('user').exec(function (err, account) {
	    	if(err){
	    		 return done(err);
	    	} else if(account){
	    		 return done(err, account);
	    	} else {
	    		var providerInfo = {
	    			provider: 'twitter',
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