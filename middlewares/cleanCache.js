const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  // adding this line so the route handler can run first
  // when it is done, then we can do our middleware business
  await next();

  clearHash(req.user.id);
};
