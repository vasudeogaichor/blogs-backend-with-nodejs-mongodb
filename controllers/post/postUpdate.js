const Post = require("../../models/Post");

module.exports = async function postUpdate(req, res, next) {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const updatePost = await Post.findByIdAndUpdate(
      postId,
      { $set: { content, title } },
      { new: true }
    );

    res.status(201).json({
      message: "Post updated successfully",
      data: {
        id: updatePost._id,
        userId: updatePost.userId,
        title: updatePost.title,
        content: updatePost.content,
        likes: updatePost.likes,
        comments: updatePost.comments,
        createdAt: updatePost.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
