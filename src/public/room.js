const socket = new WebSocket("ws://localhost:3000");

const sendNotification = (message) => {
  const notificationList = document.getElementById("notifications-list");

  const notification = document.createElement("div");
  notification.className = "flash";
  notification.textContent = message;

  notificationList.appendChild(notification);
};

const onNewMember = (data) => {
  sendNotification(`User ${data.userId} joined the room`);
};

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  if (message.event === "new-member") {
    onNewMember(message.data);
  }
});
