let memberRouter = require("./member");

function route(app) {
  app.use("/api/member", memberRouter);
  app.use("/api", memberRouter);
}
module.exports = route;
