import { sendNotification } from "./sendNotificaiton.js";

/**
 * @typedef {(data: Record<string, any>) => void} EventHandler
 */

// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const { __userId__: userId } = window;

/**
 * @param {Record<string, {nick: string, vote: string}>} room
 */
const updateParticipantsList = (room) => {
  const participantsList = document.getElementById("participants-list");

  while (participantsList && participantsList.lastChild) {
    participantsList.removeChild(participantsList.lastChild);
  }

  Object.entries(room).forEach(([user, { vote }]) => {
    const voteItem = document.createElement("li");
    voteItem.textContent = `${user}: ${vote}`;
    participantsList?.appendChild(voteItem);
  });
};

/**
 * @type {EventHandler}
 */
const onNewMember = (data) => {
  if (data.userId === userId) {
    const { room } = data;

    const members = Object.keys(room);

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
  } else {
    sendNotification(`User ${data.userId} joined the room`);
  }

  updateParticipantsList(data.room);
};

/**
 * @type {EventHandler}
 */
const onVoted = (data) => {
  if (data.userId === userId) {
    sendNotification("Your vote has been received");
  } else {
    sendNotification(`User ${data.userId} just voted`);
  }
  updateParticipantsList(data.room);
};

/**
 * @type {EventHandler}
 */
const onShowResults = (data) => {
  const { room, requester } = data;

  if (requester === userId) {
    sendNotification("Your request has been received");
  } else {
    sendNotification(`User ${requester} requested to see the results`);
  }

  updateParticipantsList(room);
};

/**
 * @type {EventHandler}
 */
const onNewSession = (data) => {
  const { requester, room } = data;

  if (requester === userId) {
    sendNotification("Your request has been received");
  } else {
    sendNotification(`User ${requester} requested to start a new session`);
  }

  updateParticipantsList(room);
};

/**
 * @type {EventHandler}
 */
const onCheat = (data) => {
  const { cheater } = data;

  if (cheater !== userId) {
    sendNotification(`${cheater} just cheated 😔`);
  }
};

/**
 * @type {EventHandler}
 */
const onCheatResults = (data) => {
  const { room } = data;

  if (
    Object.entries(room).filter(
      ([user, vote]) => user !== userId && vote !== ""
    ).length === 0
  ) {
    sendNotification("No one else voted yet 😬");
    return;
  }

  sendNotification("Hehe... 😉");

  updateParticipantsList(room);
};

/**
 * @type {EventHandler}
 */
const onExit = (data) => {
  sendNotification(`User ${data.userId} left the room`);
  updateParticipantsList(data.room);
};

/**
 * @param {import("./WSClient.js").WSClient} wsClient
 */
export const setWSEventListeners = (wsClient) => {
  wsClient
    .on("new-member", onNewMember)
    .on("voted", onVoted)
    .on("show-results", onShowResults)
    .on("new-session", onNewSession)
    .on("cheat", onCheat)
    .on("cheat-results", onCheatResults)
    .on("exit", onExit);
};

export default setWSEventListeners;
