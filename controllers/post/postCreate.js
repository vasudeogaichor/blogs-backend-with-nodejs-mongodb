const Post = require("../../models/Post");

module.exports = async function postCreate(req, res, next) {
  let { userId, content, title } = req.body;
  const loggedInUser = req.user;
  if (userId && loggedInUser.userId !== userId) {
    return res
      .status(500)
      .json({ Error: "User id mismatch with logged in user" });
  } else {
    userId = loggedInUser.userId;
  }

  try {
    // Create a new post
    const post = new Post({ userId, content, title });

    // Save the post to the database
    await post.save();

    // Respond with a success message
    res.status(201).json({
      message: "Post created successfully.",
      data: {
        id: post._id,
        userId: post.userId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during post creation:", error);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
