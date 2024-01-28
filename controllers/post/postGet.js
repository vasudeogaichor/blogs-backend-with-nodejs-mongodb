const Post = require("../../models/Post");

module.exports = async function postCreate(req, res, next) {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate({
        path: 'userId',
        model: 'User',
        select: 'id username'
      });

    res.status(200).json({
      message: "Post fetched successfully",
      data: {
        id: post._id,
        user: post.userId,
        title: post.title,
        content: post.content,
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
