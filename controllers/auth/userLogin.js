const bcrypt = require("bcrypt");
const User = require("../../models/User");
const { createNewToken } = require("../../middleware/authMiddleware");

module.exports = async function userLogin(req, res, next) {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ Error: "Invalid username or password." });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords match, the login is successful
    if (isPasswordValid) {
      const token = createNewToken(user);

      return res.status(200).json({
        data: {
          userId: user._id,
          username: user.username,
          email: user.email,
          token: token,
        },
        message: "Login successful.",
      });
    } else {
      // If the passwords don't match, return an error
      return res.status(401).json({ Error: "Invalid username or password." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
