require("dotenv").config();

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../../models/User");

module.exports = async function userRequestResetToken(req, res, next) {
  const { email } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ Error: "User not found." });
    }

    // Generate a unique reset token and set its expiration time
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Update the user's resetToken and resetTokenExpiration fields
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Send an email with the reset link
    const emailResult = sendResetEmail(user.email, resetToken);

    if (emailResult?.error) {
      console.error("Error during password reset request:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.status(201).json({ message: "Password reset token sent." });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to send a reset email
function sendResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vasudeogaichor@gmail.com",
      pass: `${process.env.GMAIL_APP_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: "vasudeogaichor@example.com",
    to: email,
    subject: "Password Reset Request",
    html: `<p>You have requested to reset your password. Here is your reset token:</p>
             <p>${resetToken}</p>
            <p><strong>Note:</strong> This is valid for only 1 hour</p>.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
      return { error };
    } else {
      console.log("Reset email sent:", info.response);
    }
  });
}
