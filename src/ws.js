const WebSocket = require("ws");

/**
 * @typedef {(props: {roomId: string, senderId: string, data: Record<string, any>, ws: WebSocket }) => void} EventHandler
 */

/**
 * @type {Map<string, WebSocket>}
 */
const clients = new Map();

/**
 * @type {Record<string, Record<string, string>>}
 */
const votes = {};

/**
 * @param {string} roomId
 * @param {{event: string, data?: Record<string, any>}} event
 */
const broadcast = (roomId, event) => {
  if (votes[roomId]) {
    Object.keys(votes[roomId]).forEach((client) => {
      clients.get(client)?.send(JSON.stringify(event));
    });
  }
};

/**
 * @type {EventHandler}
 */
const onConnected = ({ roomId, senderId, ws }) => {
  if (!(roomId in votes)) {
    votes[roomId] = { [senderId]: "" };
  } else {
    votes[roomId][senderId] = "";
  }

  clients.set(senderId, ws);

  broadcast(roomId, {
    event: "new-member",
    data: {
      userId: senderId,
      members: Object.keys(votes[roomId]).filter(
        (member) => member !== senderId
      ),
    },
  });
};

/**
 * @type {EventHandler}
 */
const onVote = ({ data, roomId, senderId }) => {
  votes[roomId][senderId] = data.vote;

  broadcast(roomId, {
    event: "voted",
    data: {
      userId: senderId,
    },
  });
};

/**
 * @type {EventHandler}
 */
const onShowResults = ({ roomId, senderId }) => {
  broadcast(roomId, {
    event: "show-results",
    data: {
      requester: senderId,
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

/**
 * @type {EventHandler}
 */
const onNewSession = ({ roomId, senderId }) => {
  votes[roomId] = Object.keys(votes[roomId]).reduce(
    (room, userId) => ({ ...room, [userId]: "" }),
    {}
  );

  broadcast(roomId, {
    event: "new-session",
    data: {
      requester: senderId,
    },
  });
};

/**
 * @type {EventHandler}
 */
const onCheat = ({ roomId, senderId }) => {
  const cheaterClient = clients.get(senderId);

  cheaterClient?.send(
    JSON.stringify({
      event: "cheat-results",
      data: {
        votes: Object.entries(votes[roomId]).reduce(
          (previous, [userId, vote]) =>
            typeof vote === "string" && vote !== "" && userId !== senderId
              ? { ...previous, [userId]: vote }
              : previous,
          {}
        ),
      },
    })
  );

  broadcast(roomId, {
    event: "cheat",
    data: {
      cheater: senderId,
    },
  });
};

/**
 * @param {WebSocket} ws
 */
const onClose = (ws) => {
  let disconnectedUser = "";
  let roomLeft = "";

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

  broadcast(roomLeft, {
    event: "exit",
    data: {
      userId: disconnectedUser,
    },
  });
};

/**
 * @param {WebSocket.Data} message
 * @param {WebSocket} ws
 */
const onMessage = (message, ws) => {
  const { event, roomId, senderId, data } = JSON.parse(message.toString());

  /**
   * @param {EventHandler} handler
   */
  const onEvent = (handler) => handler({ roomId, senderId, data, ws });

  switch (event) {
    case "connected":
      onEvent(onConnected);
      break;

    case "vote":
      onEvent(onVote);
      break;

    case "show-results":
      onEvent(onShowResults);
      break;

    case "new-session":
      onEvent(onNewSession);
      break;

    case "cheat":
      onEvent(onCheat);
      break;

    default:
      break;
  }
};

/**
 * @param {import("http").Server} httpServer
 */
const createWebSocketServer = (httpServer) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => onMessage(message, ws)).on("close", () =>
      onClose(ws)
    );
  });
};

exports.createWebSocketServer = createWebSocketServer;
