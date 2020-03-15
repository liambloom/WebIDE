const url = require("url");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

function respond (res, data, status, type) {
  res.status(status).type(type);
  res.write(data);
  res.end();
}
function respondEjs (res, path, options, status) {
  res.render(path, options, (err, html) => {
    if (html) respond(res, html, status, "html");
    else throw err;
  });
}

module.exports = (req, res) => {
  const page = "." + new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`).pathname.replace(/\/$/, "/index");
  const type = path.extname(page);
  try {
    if (type) { // if not ejs
      if (fs.existsSync(page)) respond(res, fs.readFileSync(page), 200, type);
      else res.status(404).end();
    }
    else {
      if (fs.existsSync(`./views/${page}.ejs`)) respondEjs(res, page, {}, 200);
      else respondEjs(res, "./404", {}, 404);
    }
  }
  catch (err) {
    res.status(500);
    if (!type || type === ".html") {
      res.type("html");
      res.write(`Uh Oh! Something Broke :(<br>${err}`);
    }
    res.end();
    console.error(chalk.red(err));
  }
};