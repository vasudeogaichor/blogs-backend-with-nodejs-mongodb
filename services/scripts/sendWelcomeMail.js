const mailer = require("../mailer");
const { promisify } = require('util')
const sendMailAsync = promisify(mailer.sendMail).bind(mailer);

async function sendWelcomeMail(user) {
  try {
    // Configure email content and options
    const mailOptions = {
      from: "vasudeogaichor@gmail.com",
      to: user.email,
      subject: "Welcome to Blogs App",
      text: `Dear <strong>${user.username}</strong>,\n\nWelcome to Your App! Thank you for registering.`,
    };

    // Send the email
    await sendMailAsync(mailOptions);

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Handle email sending error (e.g., log it, but don't propagate it)
  }
}

module.exports = sendWelcomeMail;
