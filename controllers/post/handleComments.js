const Post = require("../../models/Post");

module.exports = async function handleComments(req, res, next) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let { userId, text, action, commentId } = req.body;

    const loggedInUser = req.user;
    if (userId && loggedInUser.userId !== userId) {
      return res
        .status(500)
        .json({ Error: "User id mismatch with logged in user" });
    } else {
      userId = loggedInUser.userId;
    }

    if (action === "add") {
      post.comments.push({ userId, text });
      await post.save();

      return res.status(201).json({
        message: "Comment added successfully",
        data: {
          id: post._id,
          userId: post.userId,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt,
        },
      });
    } else if (action === "remove" && commentId) {
      const commentIndex = post.comments.findIndex((comment) =>
        comment._id.equals(commentId)
      );

      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1);
        await post.save();
        return res.status(201).json({
          message: "Comment removed successfully",
          data: {
            id: post._id,
            userId: post.userId,
            content: post.content,
            likes: post.likes,
            comments: post.comments,
            createdAt: post.createdAt,
          },
        });
      } else {
        return res.status(404).json({ message: "Comment not found" });
      }
    } else {
      return res.status(400).json("Error: Invalid action or commentId missing");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
