const express = require("express");

const viewEngine = require("./configs/viewEngine");

const app = express();
const port = 3000;

viewEngine(app);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/home", (req, res) => {
  res.render("homepage.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
