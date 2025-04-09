const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
        
});

userSchema.plugin(passportLocalMongoose); // Adds methods for password hashing and user authentication
module.exports = mongoose.model('User', userSchema);
