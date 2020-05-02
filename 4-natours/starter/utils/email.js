const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome;

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Gyorgy Kallai <${process.env.EMAIL_USERNAME}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'development') {
      return  1;
    }

    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // 2) Define the email options
    const mailOptions = {
      from: 'Gyorgy Kallai <hello@gyuri.io>',
      to: options.email,
      subject: options.subject,
      text: options.message
      // html:
    };
    // 3) Actually send the mail
    await transporter.sendMail(mailOptions);
  }
}

/* const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Gyorgy Kallai <hello@gyuri.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };
  // 3) Actually send the mail
  await transporter.sendMail(mailOptions);
}; */

module.exports = sendEmail;
