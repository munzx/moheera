'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var userSchema = new Schema({
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
	role: {
		type: String,
		lowercase: true,
		enum: ['user', 'admin'],
		default: ['user']
	},
	created: {
		type: Date,
		default: Date.now
	}
}, {strict: true});

var commentSchema = new Schema({
	content: {
		type: String,
		default: '',
		required: 'Please provide a comment',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	author: [userSchema]
}, {strict: true});

var heartSchema = new Schema({
	user: [userSchema],
	created: {
		type: Date,
		default: Date.now
	}
});

var orderSchema = new Schema({
	address: {
		type: String,
		default: '',
		required: 'Please provide location',
		trim: true
	},
	mobilePhone: {
		type: Number,
		default: '',
		required: 'Please provide the mobile phone number',
		trim: true
	},
	quantity: {
		type: Number,
		default: 0,
		required: 'Please provide the total quantity',
		trim: true
	},
	price: {
		type: Number,
		default: 1,
		required: 'Please provide the total price',
		trim: true
	},
	status: {
		type: String,
		lowercase: true,
		default: 'pending',
		enum: ['pending', 'delivered', 'canceled', 'processing'],
		trim: true
	},
	statusHistory: [{
		oldStatus: {
			type: String,
			lowercase: true,
			default: '',
			trim: true
		},
		updateRemarks: {
			type: String,
			lowercase: true,
			default: '',
			trim: true
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	statusRemarks: [{
		type: String,
		default: '',
		trim: true
	}],
	remarks: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: [userSchema]
}, {strict: true});

var productSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Fill up the product name',
		trim: true,
		lowercase: true,
		unique: true,
		sparse: true
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
	image1: {
		type: String,
		default: '',
		required: 'Please provide image1',
		trim: true
	},
	image2: {
		type: String,
		default: '',
		required: 'Please provide image2',
		trim: true
	},
	image3: {
		type: String,
		default: '',
		required: 'Please provide image3',
		trim: true
	},
	image4: {
		type: String,
		default: '',
		required: 'Please provide image4',
		trim: true
	},
	price: {
		type: Number,
		default: '0',
		required: 'Please provide product price',
		trim: true
	},
	quantity: {
		type: Number,
		default: 0,
		required: 'Please provide the product quantity',
		trim: true
	},
	order: [orderSchema],
	comment : [commentSchema],
	heart: [heartSchema],
	created: {
		type: Date,
		default: Date.now
	},
	userName: { //save the username as we search products by name usually than that will be easier to have the name here
		type: String,
		default: '',
		required: 'Please provide the user name',
		trim: true
	},
	userMobilePhone: {
		type: String,
		default: '',
		trim: true
	},
	firstName: {
		type: String,
		default: '',
		trim: true
	},
	lastName: {
		type: String,
		default: '',
		trim: true
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, {strict: true});


module.exports = mongoose.model('product', productSchema);