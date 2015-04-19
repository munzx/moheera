'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

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

var orderSchema = new Schema({
	serialNumber: {
		type: String,
		default: '',
		required: true,
		trim: true
	},
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
	product: [{
		info: {type: Schema.Types.ObjectId, ref: 'product'},
		quantity: {
			type: Number,
			default: 0,
			required: true,
			trim: true
		},
		price: {
			type: String,
			default: 0,
			required: true,
			trim: true
		}
	}],
	user: [{ type: Schema.Types.ObjectId, ref: 'user' }]
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
		match: [/.+\@.+\..+/, 'Please provide a valid email address']
	},
	mobilePhone: {
		type: String,
		unique: true,
		sparse: true
	},
	country: [{
		name: {
			type: String,
			default: 'United Arab Emirates',
			required: true,
			trim: true
		},
		language: {
			type: String,
			default: 'eng',
			required: true,
			trim: true
		},
		code: {
			type: String,
			default: 'AE',
			required: true,
			trim: true
		},
		currency: {
			type: String,
			default: 'AED',
			required: true,
			trim: true
		},
		callingCode: {
			type: Number,
			default: '971',
			required: true,
			trim: true	
		}
	}],
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
	order: [orderSchema],
	created: {
		type: Date,
		default: Date.now
	}
}, {strict: true});


usersSchema.pre('save', function (next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if(err) next(err);
			user.password = hash;
			next();
		});
	});
});

usersSchema.methods.comparePasswords = function (toBeCompared, callBack) {
	bcrypt.compare(toBeCompared, this.password, function (err, isMatch) {
		if(err) return callBack(err);
		callBack(null, isMatch);
	});
}

module.exports = mongoose.model('user', usersSchema);