const postCreate = require("./postCreate");
const postGet = require("./postGet");
const postList = require("./postList");
const postUpdate = require("./postUpdate");
const postDelete = require("./postDelete");
const handleComments = require("./handleComments");
const handleLikes = require("./handleLikes");

module.exports = {
  postCreate,
  postGet,
  postList,
  postUpdate,
  postDelete,
  handleLikes,
  handleComments
};
