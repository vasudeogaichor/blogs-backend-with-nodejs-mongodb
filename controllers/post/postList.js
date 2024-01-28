const Post = require("../../models/Post");

module.exports = async function postList(req, res, next) {
  try {
    let { page, limit, userId, query, sortBy } = req.query;

    const defaultPage = 1;
    const defaultLimit = 10;

    page = parseInt(page) || defaultPage;
    limit = parseInt(limit) || defaultLimit;

    skip = (page - 1) * limit;

    const filters = {}

    // return posts by specific user
    if (userId) {
        filters.userId = userId
    }

    // search posts using content text
    if (query?.trim()?.length) {
        filters.content = { $regex: query, $options: "i" };
    }

    const sortOptions = {}

    if (sortBy) {
        let direction = 1;
        // Direction of sort order decided by the - at the start of sortBy type
        if (sortBy.startsWith("-")) {
            direction = -1
            sortBy = sortBy.slice(1)
        }

        switch (sortBy) {
          case "likes":
            sortOptions.likes = direction;
            break;
          case "comments":
            sortOptions.comments = direction;
            break;
          case "createdAt":
            sortOptions.createdAt = direction;
            break;
          default:
            // Handle other cases or invalid sortBy values
            break;
        }
      } else {
        // Default sorting (e.g., by createdAt)
        sortOptions.createdAt = -1;
      }

    const posts = await Post.find(filters)
    .populate({
      path: 'userId',
      model: 'User',
      select: 'id username'
    })
    .skip(skip).limit(limit).sort(sortOptions);
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      message: "Posts fetched successfully",
      total: posts.length,
      actualTotal: totalPosts,
      data: posts.map((post) => {
        return {
          id: post._id,
          user: post.userId,
          title: post.title,
          content: post.content,
          likes: post.likes,
          comments: post.comments,
          createdAt: post.createdAt
        };
      }),
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
