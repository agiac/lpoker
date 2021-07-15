const http = require("http");

const { app } = require("./app");
const { createWebSocketServer } = require("./ws");

const server = http.createServer(app);

createWebSocketServer(server);

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("App listening on http://localhost:3000");
});
