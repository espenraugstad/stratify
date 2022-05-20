const express = require('express');
const server = express();
const PORT = process.env.PORT || 8888;

server.use(express.json());
server.use(express.static('public'));


server.listen(PORT, function() {
    console.log(`Listening on ${PORT}.`);
});