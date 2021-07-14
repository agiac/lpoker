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

    if (message.event === "new-member") {
      onNewMember(message.data);
    }
  });
};

const onVoteSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(Array.from(formData.values()));
};

const addEventListeners = () => {
  const votingForm = document.getElementById("voting-form");
  votingForm.addEventListener("submit", onVoteSubmit);
};

const main = () => {
  createWebSocketConnection();
  addEventListeners();
};

main();
