const WebSocket = require("ws");

const clients = new Map();

const votes = {};

const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const { event, data } = JSON.parse(message.toString());

      if (event === "connected") {
        const { roomId, userId } = data;

        if (!(roomId in votes)) {
          votes[roomId] = { [userId]: "" };
        } else {
          votes[roomId][userId] = "";
        }

        clients.set(userId, ws);

        Object.keys(votes[roomId]).forEach((client) => {
          if (client !== userId) {
            const clientSocket = clients.get(client);
            clientSocket.send(
              JSON.stringify({
                event: "new-member",
                data: {
                  userId,
                },
              })
            );
          }
        });
      }
    });
  });
};

exports.createWebSocketServer = createWebSocketServer;
