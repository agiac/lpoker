export const sendNotification = (message) => {
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

export default sendNotification;
