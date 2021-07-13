const socket = new WebSocket("ws://localhost:3000");

const sendNotification = (message) => {
  const notificationList = document.getElementById("notifications-list");

  const notification = document.createElement("li");
  notification.className = "notification";
  notification.textContent = message;

  if (notificationList.children.length === 0) {
    notificationList.prepend(notification);
  } else if (notificationList.children.length < 10) {
    notificationList.appendChild(notification);
  }
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
