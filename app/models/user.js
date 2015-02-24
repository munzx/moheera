'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var cartSchema = new Schema({
	product: [{ type: Schema.Types.ObjectId, ref: 'product' }],
	quantity: {
		type: Number,
		default: 1,
		min: 1,
		max: 20,
		required: 'Please Provide the quantity',
		trim: true
	}
}, {strict: true});


//Create the schema
var usersSchema = Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Pease provide the first name',
		trim: true,
		lowercase: true
	},
	lastName: {
		type: String,
		default: '',
		required: 'Please provide the last name',
		trim: true,
		lowercase: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill the user name field',
		trim: true,
		lowercase: true,
		unique: true,
		sparse: true
	},
	email: {
		type: String,
		default: '',
		required: 'Please fill the email field',
		trim: true,
		unique: true,
		lowercase: true,
		sparse: true,
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	mobilePhone: {
		type: String,
		unique: true,
		sparse: true
	},
	pageDesc: {
		type: String,
		default: '',
		trim: true
	},
	logo: {
		type: String,
		default: '',
		trim: true
	},
	banner: {
		type: String,
		default: '',
		trim: true
	},
	role: {
		type: String,
		lowercase: true,
		enum: ['user', 'admin'],
		default: ['user']
	},
	password: {
		type: String,
		default: '',
		required: 'Please provide the password',
		trim: true
	},
	cart :[cartSchema],
	created: {
		type: Date,
		default: Date.now
	}
}, {strict: true});


module.exports = mongoose.model('user', usersSchema);