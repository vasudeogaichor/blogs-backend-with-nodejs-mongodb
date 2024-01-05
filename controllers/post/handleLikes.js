const Post = require("../../models/Post");

module.exports = async function handleLikes(req, res, next) {
  try {
    const { postId } = req.params;
    let { userId, action } = req.body;

    const loggedInUser = req.user;
    if (userId && loggedInUser.userId !== userId) {
      return res
        .status(500)
        .json({ Error: "User id mismatch with logged in user" });
    } else {
      userId = loggedInUser.userId;
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (action === "add") {
      if (!post.likes.includes(req.body.userId)) {
        post.likes.push(req.body.userId);
        await post.save();
      }

      return res.status(201).json({
        message: "Like added successfully",
        data: {
          id: post._id,
          userId: post.userId,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt,
        },
      });
    } else if (action === "remove" && userId) {
      const userLikeIndex = post.likes.indexOf(userId);

      if (userLikeIndex !== -1) {
        post.likes.splice(userLikeIndex, 1);
        await post.save();

        return res.status(201).json({
          message: "Like removed successfully",
          data: {
            id: post._id,
            userId: post.userId,
            content: post.content,
            likes: post.likes,
            comments: post.comments,
            createdAt: post.createdAt,
          },
        });
      }

      return res.status(400).json({
        message: "Error: Like already removed/ does not exist",
      });
    } else {
      return res.status(400).json({
        message: "Error: Wrong action type or userId missing",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
