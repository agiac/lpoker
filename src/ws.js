const WebSocket = require("ws");

const clients = new Map();

const votes = {};

const broadcastAll = (roomId, event) => {
  Object.keys(votes[roomId]).forEach((client) => {
    clients.get(client).send(JSON.stringify(event));
  });
};

const broadcast = (senderId, roomId, event) => {
  Object.keys(votes[roomId]).forEach((client) => {
    if (client !== senderId) {
      clients.get(client).send(JSON.stringify(event));
    }
  });
};

const onConnected = (ws, data) => {
  const { roomId, userId } = data;

  if (!(roomId in votes)) {
    votes[roomId] = { [userId]: "" };
  } else {
    votes[roomId][userId] = "";
  }

  clients.set(userId, ws);

  broadcast(userId, roomId, {
    event: "new-member",
    data: {
      userId,
    },
  });
};

const onVote = (data) => {
  const { roomId, userId, vote } = data;

  votes[roomId][userId] = vote;

  broadcast(userId, roomId, {
    event: "voted",
    data: {
      userId,
    },
  });
};

const onShowResults = (data) => {
  const { roomId } = data;

  broadcastAll(roomId, {
    event: "show-results",
    data: {
      votes: votes[roomId],
    },
  });
};

const onNewSession = (data) => {
  const { roomId } = data;

  broadcastAll(roomId, {
    event: "new-session",
    data: {},
  });

  votes[roomId] = {};
};

const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      const { event, data } = JSON.parse(message.toString());

      switch (event) {
        case "connected":
          onConnected(ws, data);
          break;

        case "vote":
          onVote(data);
          break;

        case "show-results":
          onShowResults(data);
          break;

        case "new-session":
          onNewSession(data);
          break;

        default:
          break;
      }
    });

    ws.on("close", () => {
      let toRemove;

      clients.forEach((socket, userId) => {
        if (Object.is(ws, socket)) {
          toRemove = userId;
        }
      });

      Object.keys(votes).forEach((roomId) => {
        if (typeof votes[roomId][toRemove] !== "undefined") {
          delete votes[roomId][toRemove];
        }
      });
    });
  });
};

exports.createWebSocketServer = createWebSocketServer;
