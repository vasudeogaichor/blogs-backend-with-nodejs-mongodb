const express = require("express");
const router = express.Router();
const { postControllers } = require("../controllers");

router.post("/", postControllers.postCreate);
router.get("/", postControllers.postList);
router.get("/:postId", postControllers.postGet);
router.put("/:postId", postControllers.postUpdate);
router.delete("/:postId", postControllers.postDelete);

router.post("/:postId/likes", postControllers.handleLikes)
router.post("/:postId/comments", postControllers.handleComments)

module.exports = router;
