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

  if (notificationList.children.length >= 10) {
    notificationList.removeChild(notificationList.lastChild);
  }
};

const onWelcome = (data) => {
  const { members } = data;

  if (members.length === 0) {
    sendNotification(
      `Welcome ${userId}! There are no other members in this room at the moment`
    );
    return;
  }

  if (members.length === 1) {
    sendNotification(
      `Welcome ${userId}! There is another member in this room at the moment: ${members[0]}`
    );
    return;
  }

  sendNotification(
    `Welcome ${userId}! There are ${
      members.length
    } other members in this room at the moment: ${members
      .slice(0, members.length - 1)
      .join(", ")} and ${members[members.length - 1]}`
  );
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
    case "welcome":
      onWelcome(data);
      break;

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
  const socket = new WebSocket(
    `${window.location.protocol === "https:" ? "wss" : "ws"}://${
      window.location.host
    }`
  );

  socket.addEventListener("open", () => onOpen(socket));

  socket.addEventListener("message", onMessage);

  return socket;
};

export default createWebSocketConnection;
