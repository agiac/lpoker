// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const { __userId__: userId, __roomId__: roomId } = window;

const sendNotification = (message) => {
  const notificationList = document.getElementById("notifications-list");

  const notification = document.createElement("li");
  notification.className = "notification";
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
  console.log("Voted", data);
  sendNotification(`User ${data.userId} just voted`);
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

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    console.log(message);

    switch (message.event) {
      case "new-member":
        onNewMember(message.data);
        break;

      case "voted":
        onVote(message.data);
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

const addEventListeners = (socket) => {
  const votingForm = document.getElementById("voting-form");
  votingForm.addEventListener("submit", onVoteSubmit(socket));
};

const main = () => {
  const socket = createWebSocketConnection();
  addEventListeners(socket);
};

main();
