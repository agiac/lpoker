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

const createWebSocketConnection = () => {
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("open", () => {
    socket.send(
      JSON.stringify({
        event: "connected",
        data: {
          roomId,
          userId,
        },
      })
    );
  });

  socket.addEventListener("message", (rawEvent) => {
    const { event, data } = JSON.parse(rawEvent.data);

    // console.log({ event, data });

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

      default:
        break;
    }
  });

  return socket;
};

const onVoteSubmit = (socket) => (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const vote = formData.get("vote");

  socket.send(
    JSON.stringify({
      event: "vote",
      data: {
        userId,
        roomId,
        vote,
      },
    })
  );
};

const onShowResultsClick = (socket) => (e) => {
  e.preventDefault();

  socket.send(
    JSON.stringify({
      event: "show-results",
      data: {
        roomId,
      },
    })
  );
};

const onStartNewSessionClick = (socket) => (e) => {
  e.preventDefault();

  socket.send(
    JSON.stringify({
      event: "new-session",
      data: {
        roomId,
      },
    })
  );
};

const addEventListeners = (socket) => {
  const votingForm = document.getElementById("voting-form");
  votingForm.addEventListener("submit", onVoteSubmit(socket));

  const showResultsButton = document.getElementById("show-results");
  showResultsButton.addEventListener("click", onShowResultsClick(socket));

  const startNewSessionBUtton = document.getElementById("start-new-session");
  startNewSessionBUtton.addEventListener(
    "click",
    onStartNewSessionClick(socket)
  );
};

const main = () => {
  const socket = createWebSocketConnection();
  addEventListeners(socket);
};

main();
