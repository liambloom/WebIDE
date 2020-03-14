const { main, api } = require("./init");
const serve = require("./serve");

main.get(/.*/, serve);