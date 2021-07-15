const WebSocket = require("ws");

const clients = new Map();

const votes = {};

const message = (receiverId, event) => {
  clients.get(receiverId).send(JSON.stringify(event));
};

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

  message(userId, {
    event: "welcome",
    data: {
      members: Object.keys(votes[roomId]).filter((member) => member !== userId),
    },
  });

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
      votes: Object.entries(votes[roomId]).reduce(
        (previous, [userId, vote]) =>
          typeof vote === "string" && vote !== ""
            ? { ...previous, [userId]: vote }
            : previous,
        {}
      ),
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

const onClose = (ws) => {
  let disconnectedUser;
  let roomLeft;

  clients.forEach((socket, userId) => {
    if (Object.is(ws, socket)) {
      disconnectedUser = userId;
    }
  });

  Object.keys(votes).forEach((roomId) => {
    if (typeof votes[roomId][disconnectedUser] !== "undefined") {
      roomLeft = roomId;
      delete votes[roomId][disconnectedUser];
    }
  });

  broadcast(disconnectedUser, roomLeft, {
    event: "exit",
    data: {
      userId: disconnectedUser,
    },
  });
};

const onMessage = (ws, message) => {
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
};

const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => onMessage(ws, message));

    ws.on("close", () => onClose(ws));
  });
};

exports.createWebSocketServer = createWebSocketServer;
