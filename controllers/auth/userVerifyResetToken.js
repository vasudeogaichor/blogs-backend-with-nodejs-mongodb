const User = require("../../models/User");
const { isStrongPassword } = require("../../utils/password");

module.exports = async function userRequestResetToken(req, res, next) {
  const { email, resetToken, newPassword } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ Error: "User not found." });
    }

    // Check if the reset token matches the stored token
    if (user.resetToken !== resetToken) {
      return res.status(401).json({ Error: "Invalid reset token." });
    }

    // Check if the reset token has not expired
    if (Date.now() > user.resetTokenExpiration) {
      return res.status(401).json({ Error: "Reset token has expired." });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        Error:
          "Password should contain at least one uppercase character," +
          "one lowercase character, one digit, one special character and must have at least 8 characters.",
      });
    }

    // Replace old password with new
    user.password = newPassword;

    // Clear the reset token and expiration
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    await user.save();

    res.status(201).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ Externalrror: "Internal Server Error" });
  }
};
