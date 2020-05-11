const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
// new Email(user, url).sendWelcome;

/**
 * Email sender - put the params and call submethods, like sendWelcome, sendOrderConfirm etc..
 * @param {Object} user The current user Object, we will use their email address
 * @param {String} url This is an optional param, we are sending URL in emails.
 */
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Gyorgy Kallai <gyorgy.kallai@gyuri.io>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
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
  }

  // Send the actual email
  async send(template, subject) {
    // console.log(`${__dirname}/../views/emails/${template}.pug`);
    // 1) Render html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    // await transporter.sendMail(mailOptions);
  }

  /**
   * No params, use for welcome e-mails.
   * send() params should have the pug template name as first, after the the email SUBJECT.
   */
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send('forgotPassword', 'Password reset - Natours');
  }

  async sendPasswordChangeNotification() {
    await this.send(
      'passwordChangeNotification',
      'Password Change Notification - Natours'
    );
  }
};
