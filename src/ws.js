const WebSocket = require("ws");

const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // TODO only send notification to common room
        client.send(
          JSON.stringify({
            event: "new-member",
            data: {
              userId: "abc",
            },
          })
        );
      }
    });
  });
};

exports.createWebSocketServer = createWebSocketServer;
