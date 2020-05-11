const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
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
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    default: 'user',
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'Role is either: user, guide, lead-guide or admin'
    }
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false // Hidden from queries, this will not be in the output.
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

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 100;
  // console.log('passwordChangedAt date added');

  next();
});

userSchema.pre(/^find/, function (next) {
  // this point to the current query.
  // at the end, only find the documents with ACTIVE: TRUE property.
  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * If the token is create time is less than the password changed time, then the password is not valid.
 * Token issued time: 100 < passworc changed at 200 (= TRUE)
 * if we change the password after the token was issued, therefore the token this is now true!
 * if the Token issued time: 300 < passworc changed at 200 (= FALSE)
 * The token contain the previous password, therefore its gonna be false.
 * False means NOT CHANGED ---  True means CHANGED
 **/
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(passwordChangedTimestamp, JWTTimestamp);
    return JWTTimestamp < passwordChangedTimestamp;
  }
  return false;
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
