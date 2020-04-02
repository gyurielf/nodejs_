const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    required: [true, 'The user must have an email address'],
    // select -- PREFILLINGnever show up from any output.
    select: false
  },
  passwordConfirm: {
    type: String,
    minlength: [4, 'The password should be more than 4 characters.'],
    maxlength: [250, 'The password should be less than 250 characters.'],
    validate: {
      // Hagyományos function kell, nem arrow, mert használnunk kell a this keywordot.
      //   this only woks on SAVE!!!!
      validator: function (el) {
        return el === this.password;
      },
      message: () => `The passowrd confirm should be same as the password`
    },
    required: [true, 'Must have confirm the email']
  }
});

userSchema.pre('save', async function (next) {
  // only run this fn if the password was actually modified;
  if (!this.isModified('password')) return next();
  // hash password
  this.password = await bcrypt.hash(this.password, 12);

  /* passwordConfirm - Not need in the database, just we have to ensure about the user give it the correct password, what he want. */
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/* // Adding dates for the find queries.
userSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
}); */

/* // Exclude users who doenst have photo.
userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { photo: { $lt: 1 } } });
  // console.log(this.pipeline());
  next();
}); */

const User = mongoose.model('User', userSchema);

module.exports = User;
