const axios = require("axios");
const express = require("express");
const server = express();
const PORT = process.env.PORT || 8888;

server.use(express.json());
server.use(express.static("public"));

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
  console.log("Getting access token");
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
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  };

  try {
    let tokenData = await axios.post(url, searchString, cfg);
    console.log(tokenData.status);
    if (tokenData.status === 200) {
      res
        .json({
          access: tokenData.data.access_token,
          refresh: tokenData.data.refresh_token,
        })
        .end();
    }
  } catch (err) {
    console.log(err);
  }
});

server.listen(PORT, function () {
  console.log(`Listening on ${PORT}.`);
});
