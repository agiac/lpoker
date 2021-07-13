const WebSocket = require("ws");

const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      console.log("received: %s", message);
    });

    ws.send("something");
  });
};

exports.createWebSocketServer = createWebSocketServer;
