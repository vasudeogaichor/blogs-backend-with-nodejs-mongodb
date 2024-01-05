// queue.js
const Bull = require("bull");
const { redis } = require("../config/redis");

const emailQueue = new Bull("email", {
  redis: redis,
});

module.exports = emailQueue;
