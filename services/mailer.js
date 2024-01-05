const nodemailer = require("nodemailer");
require("dotenv").config();

function initializeMailer() {
  const mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vasudeogaichor@gmail.com",
      pass: `${process.env.GMAIL_APP_PASSWORD}`,
    },
  });

  return mailer;
}

const mailer = initializeMailer();

function sendMail(mailOptions) {
  mailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return { error };
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { initializeMailer, mailer, sendMail };
