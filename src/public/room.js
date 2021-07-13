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

const createWebSocketConnection = () => {
  const socket = new WebSocket("ws://localhost:3000");

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.event === "new-member") {
      onNewMember(message.data);
    }
  });
};

const onNameChange = (e) => {
  console.log(e.target.value);
};

const onVoteSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(Array.from(formData.values()));
};

const addEventListeners = () => {
  const nameInput = document.getElementById("name-input");
  nameInput.addEventListener("keyup", onNameChange);

  const votingForm = document.getElementById("voting-form");
  votingForm.addEventListener("submit", onVoteSubmit);
};

const main = () => {
  createWebSocketConnection();
  addEventListeners();
};

main();
