'use strict';

var mongoose = require('mongoose'),
Schema = mongoose.Schema;

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
	author: [{ type: Schema.Types.ObjectId, ref: 'user' }]
}, {strict: true});

var heartSchema = new Schema({
	user: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	created: {
		type: Date,
		default: Date.now
	}
});

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
	comment : [commentSchema],
	heart: [heartSchema],
	created: {
		type: Date,
		default: Date.now
	},
	user: [{ type: Schema.Types.ObjectId, ref: 'user' }]
}, {strict: true});

module.exports = mongoose.model('product', productSchema);