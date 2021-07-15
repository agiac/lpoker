// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const { __userId__: userId, __roomId__: roomId } = window;

const clearResults = (resultsList) => {
  while (resultsList.children.length > 0) {
    resultsList.removeChild(resultsList.lastChild);
  }
};

const sendNotification = (message) => {
  const notificationList = document.getElementById("notifications-list");

  const notification = document.createElement("li");
  notification.textContent = message;

  if (notificationList.children.length === 0) {
    notificationList.appendChild(notification);
  } else {
    notificationList.prepend(notification);
  }

  if (notificationList.children.length > 10) {
    notificationList.removeChild(notificationList.lastChild);
  }
};

const onNewMember = (data) => {
  sendNotification(`User ${data.userId} joined the room`);
};

const onVote = (data) => {
  sendNotification(`User ${data.userId} just voted`);
};

const onShowResults = (data) => {
  const { votes } = data;

  const resultsList = document.getElementById("results-list");

  clearResults(resultsList);

  Object.entries(votes).forEach(([user, vote]) => {
    const voteItem = document.createElement("li");
    voteItem.textContent = `${user}: ${vote}`;

    resultsList.appendChild(voteItem);
  });
};

const onNewSession = () => {
  const resultsList = document.getElementById("results-list");

  clearResults(resultsList);
};

const onExit = (data) => {
  sendNotification(`User ${data.userId} left the room`);
};

const onOpen = (socket) => {
  socket.send(
    JSON.stringify({
      event: "connected",
      data: {
        roomId,
        userId,
      },
    })
  );
};

const onMessage = (rawEvent) => {
  const { event, data } = JSON.parse(rawEvent.data);

  switch (event) {
    case "new-member":
      onNewMember(data);
      break;

    case "voted":
      onVote(data);
      break;

    case "show-results":
      onShowResults(data);
      break;

    case "new-session":
      onNewSession();
      break;

    case "exit":
      onExit(data);
      break;

    default:
      break;
  }
};

export const createWebSocketConnection = () => {
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", () => onOpen(socket));

  socket.addEventListener("message", onMessage);

  return socket;
};

export default createWebSocketConnection;