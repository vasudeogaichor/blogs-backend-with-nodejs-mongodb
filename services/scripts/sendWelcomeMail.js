const {sendMail} = require("../mailer");

async function sendWelcomeMail(user) {
  try {
    // Configure email content and options
    const mailOptions = {
      from: "vasudeogaichor@gmail.com",
      to: user.email,
      subject: "Welcome to Blogs App",
      html: `<p>Dear <strong>${user.username}</strong><p>,\n\nWelcome to Blogs App! Thank you for registering.`,
    };

    // Send the email
    sendMail(mailOptions);

  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Handle email sending error (e.g., log it, but don't propagate it)
  }
}

module.exports = sendWelcomeMail;
