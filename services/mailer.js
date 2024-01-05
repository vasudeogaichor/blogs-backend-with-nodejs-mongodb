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

module.exports = { initializeMailer, mailer };
