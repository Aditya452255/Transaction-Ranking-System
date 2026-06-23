const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator =  require('validator');
const Schema = mongoose.Schema;

// User schema definition   
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    },
    password: {
      type: String,
      required: true
    }   
}, { timestamps: true });

// Static signup method
userSchema.statics.signup = async function(email, password) {
  // Check if user already exists
  const exists = await this.findOne({ email });

    if (!email || !password) {
      throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
      throw Error('Email is not valid');
    }   
    if (!validator.isStrongPassword(password)) {
      throw Error('Password is not strong enough');
    }
    if (exists) {
      throw Error('Email already in use');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // Add logic to create and save the new user here
    const user = await this.create({ email, password: hash });
    return user;
}
// Static login method
userSchema.statics.login = async function(email, password) {
  if (!email || !password) {
    throw Error('All fields must be filled');
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Incorrect email');
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Incorrect password');
  }
  return user;
}

// Creating User model
module.exports = mongoose.model('User', userSchema);

