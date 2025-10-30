const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App Password من Google
  },
});

exports.sendCode = async (toEmail, code, subject = "Verification Code") => {
  await transporter.sendMail({
    from: `"Shopingo App" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject,
    text: `Your code is: ${code}`,
  });
};
