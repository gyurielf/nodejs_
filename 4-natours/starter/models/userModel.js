const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true, // remove whitespaces before and after of the string.
    maxlength: [50, 'A user name must have less or equal then 50 characters'],
    minlength: [2, 'A user name must have more or equal then 2 characters']
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email format should be valid'],
    required: [true, 'The user must have an email address']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    minlength: [4, 'The password should be more than 4 characters.'],
    maxlength: [250, 'The password should be less than 250 characters.'],
    required: [true, 'The user must have an email address']
  },
  passwordConfirm: {
    type: String,
    minlength: [4, 'The password should be more than 4 characters.'],
    maxlength: [250, 'The password should be less than 250 characters.'],
    validate: {
      function(val) {
        return val === this.password;
      },
      message: () => `The passowrd confirm should be same as the password`
    },
    required: [true, 'Must have confirm the email']
  }
});
// Adding dates for the find queries.
userSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

// Exclude users who doenst have photo.
userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { photo: { $lt: 1 } } });
  // console.log(this.pipeline());
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
