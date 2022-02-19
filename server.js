const ENV_VARS = require("./localenv");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const express = require("express");

const server = express();
const PORT = process.env.PORT || 8888;

server.set("port", PORT);
server.use(express.static("public"));
server.use(express.json());

const client_id = process.env.client_id || ENV_VARS.client_id;
const client_secret = process.env.client_secret || ENV_VARS.client_secret;

server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});
