const Post = require("../../models/Post");

module.exports = async function postDelete(req, res, next) {
  try {
    const { postId } = req.params;

    await Post.findByIdAndDelete(postId);

    res.status(204).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
