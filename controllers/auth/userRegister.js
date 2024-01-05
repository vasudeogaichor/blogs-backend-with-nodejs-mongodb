const User = require("../../models/User");
const { isStrongPassword } = require("../../utils/password");
const { createNewToken } = require("../../middleware/authMiddleware");

module.exports = async function userRegister(req, res, next) {
  const { username, email, password } = req.body;

  try {
    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        Error: "Username or email is already in use.",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        Error:
          "Password should contain at least one uppercase character," +
          "one lowercase character, one digit, one special character and must have at least 8 characters.",
      });
    }

    // Create a new user
    const newUser = new User({ username, email, password });

    // Save the user to the database
    await newUser.save();

    // Generate auth token so user can be logged in
    const token = createNewToken(newUser);

    // Respond with a success message
    res.status(201).json({
      message: "User registered successfully.",
      data: {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        token: token
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
