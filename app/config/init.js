'use strict';

//Module dependencies
var logger = require('express-logger'),
	compress = require('compression'),
	fs = require('fs'),
	errorHandler = require('errorhandler'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	//multer  = require('multer'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	passport = require('passport'),
	passportLocal = require('passport-local'),
	favicon = require('serve-favicon'),
	env = process.env.NODE_ENV,
	envConfig = require('./env/' + process.env.NODE_ENV) || {};

module.exports = function (app, express) {
	//Environment
	console.log(envConfig.app.title + ' Environment');

	//Connect to mongoDB
	mongoose.connect(envConfig.db || process.env.MONGO_URL);

	//Set certain behaviour for development and test environments
	if(env === 'development' || 'test'){
		//stop Etag
		app.disable('etag');
		//Log file location
		app.use(logger({path: "log.txt"}));
		//configure error
	    app.use(errorHandler({
	        dumpExceptions: true,
	        showStack: true
	    }));
	    app.use(errorHandler());
	}

	//check if mongodb is connected otherwise throw an error
	var db = mongoose.connection;
	db.on('error',console.error.bind(console, 'connection Error:'));

	//gzip the server responses
	app.use(compress());

	//App favicon
	app.use(favicon('./public/modules/home/img/favicon.ico'));

	//Set app defaults
	app.disable('x-powered-by'); //Dont show that this server runs express!
	app.set('env','development'); //We are in development mode
	app.disable('case sensitive routing');
	app.enable('strict routing');
	app.set('view engine', 'ejs');
	app.enable('view cache');

	//use middlewears
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
	
	// app.use(multer({
	// 	dest: './public/uploads/',
	// 	limits: {
	// 	  fieldNameSize: 100,
	// 	  files: 4,
	// 	  fileSize: 1024 * 1024
	// 	},
	// 	onFileSizeLimit: function (file) {
	// 	  console.log('File has exceeded size limit: ', file.originalname);
	// 	  fs.unlink('./' + file.path) // delete the partially written file
	// 	  return false;
	// 	},
	//     onFileUploadStart: function(file) {
	//         if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
	//             return false;
	//         }
	//     }
	// }));
	//app.use(cookieParser()); //read cookies
	app.use(cookieSession({ secret: process.env.SESSION_SECRET || 'secret', name: 'moheera'})); //use sessions for Auth
	app.use(methodOverride()); //read about this
	app.use(passport.initialize()); //initialize passport
	app.use(passport.session()); // persistent login sessions

	//Publically accessable folders
	app.use('/asset', express.static('./bower_components/'));
	app.use('/public', express.static('./public/'));
}