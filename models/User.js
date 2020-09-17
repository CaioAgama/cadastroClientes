const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({

    name:String,
    email:String,
    resetPassswordToken:String,
    resetPassswordExpires:Date 

});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'});

module.exports = mongoose.model('User', userSchema);