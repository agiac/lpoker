// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const { __userId__: userId } = window;

const getResultsList = () => document.getElementById("results-list");

const clearResultsList = (resultsList) => {
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

const onVoted = (data) => {
  sendNotification(`User ${data.userId} just voted`);
};

const onShowResults = (data) => {
  const { votes } = data;

  const resultsList = getResultsList();

  clearResultsList(resultsList);

  Object.entries(votes).forEach(([user, vote]) => {
    const voteItem = document.createElement("li");
    voteItem.textContent = `${user}: ${vote}`;
    resultsList.appendChild(voteItem);
  });
};

const onNewSession = () => {
  const resultsList = getResultsList();

  clearResultsList(resultsList);
};

const onExit = (data) => {
  sendNotification(`User ${data.userId} left the room`);
};

/**
 * @param {import("./WSClient.js").WSClient} wsClient
 */
export const setWSEventListeners = (wsClient) => {
  wsClient.on("welcome", onWelcome);

  wsClient.on("new-member", onNewMember);

  wsClient.on("voted", onVoted);

  wsClient.on("show-results", onShowResults);

  wsClient.on("new-session", onNewSession);

  wsClient.on("exit", onExit);
};

export default setWSEventListeners;
