const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const express = require("express");

const server = express();
const PORT = process.env.PORT || 8888;

server.set("port", PORT);
server.use(express.static("public"));
server.use(express.json());

const client_id = process.env.client_id || require("./localenv").client_id;
const client_secret =
  process.env.client_secret || require("./localenv").client_secret;
const redirect_uri =
  process.env.redirect_uri || require("./localenv").redirect_uri;
const AUTHORIZE = "https://accounts.spotify.com/authorize?";

server.get("/login", (req, res) => {
  let url = AUTHORIZE;
  url += "client_id=" + client_id;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url +=
    "&scope=playlist-read-collaborative playlist-read-private playlist-modify-private playlist-modify-public";

  res.redirect(url);
});

server.post("/getAccessToken", async (req, res) => {
  const code = req.body.code;

  let searchString = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri,
  });

  const url = "https://accounts.spotify.com/api/token";

  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      'Authorization':
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: searchString,
  };

  try {
    let result = await fetch(url, cfg);
    let data = await result.json();

    if (result.status === 200) {
      res.status(200).json(data).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err }).end();
  }
});

server.post("/refreshToken", async (req, res) => {
  const refreshToken = req.body.token;

  const searchString = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const url = "https://accounts.spotify.com/api/token";

  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: searchString,
  };

  try {
    let result = await fetch(url, cfg);
    let data = await result.json();

    if (result.status === 200) {
      res.status(200).json(data).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err }).end();
  }
});

server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});
