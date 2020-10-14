require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async ({ from, to, subject, text }) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // smtp.example.com"
    port: process.env.MAIL_PORT, // 465
    secure: false,
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  return true;
};

module.exports = {
  sendEmail,
};
