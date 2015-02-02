'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var cartSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Fill up the product name',
		trim: true,
		lowercase: true
	},
	desc: {
		type: String,
		default: '',
		required: 'Fill up the product describtion',
		trim: true
	},
	category: {
		type: String,
		enum: ['men', 'women', 'kid', 'gift', 'book'],
		default: ['men'],
		lowercase: true,
		required: 'Fill up the category',
		trim: true
	},
	quantity: {
		type: Number,
		default: 1,
		min: 1,
		max: 20,
		required: 'Please Provide the quantity',
		trim: true
	},
	price: {
		type: Number,
		default: 0,
		required: 'Please provide product price',
		trim: true
	},
	image1: {
		type: String,
		default: 0,
		required: 'Please provide product price',
		trim: true
	},
	image2: {
		type: String,
		default: 0,
		required: 'Please provide product price',
		trim: true
	},
	image3: {
		type: String,
		default: 0,
		required: 'Please provide product price',
		trim: true
	},
	image4: {
		type: String,
		default: 0,
		required: 'Please provide product price',
		trim: true
	},
	productId: {
		type: Schema.ObjectId,
		ref: 'product',
		required: 'Please provide the product id',
		trim: true
	},
	user: {
		type: String,
		default: 0,
		required: 'Please provide user id',
		trim: true
	},
	userName: { //save the username as we search products by name usually than that will be easier to have the name here
		type: String,
		default: '',
		required: 'Please provide the user name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
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