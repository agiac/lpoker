// @ts-ignore
// eslint-disable-next-line no-underscore-dangle
const { __userId__: userId, __roomId__: roomId } = window;

/**
 * @param {import("./WSClient").WSClient} wsClient
 */
const onVoteSubmit = (wsClient) => (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const vote = formData.get("vote");

  wsClient.sendEvent("vote", {
    userId,
    roomId,
    vote,
  });
};

/**
 * @param {import("./WSClient").WSClient} wsClient
 */
const onShowResultsClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("show-results", {
    roomId,
  });
};

/**
 * @param {import("./WSClient").WSClient} wsClient
 */
const onStartNewSessionClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("new-session", {
    roomId,
  });
};

/**
 * @param {import("./WSClient").WSClient} wsClient
 */
export const setDOMEventListeners = (wsClient) => {
  document
    .getElementById("voting-form")
    .addEventListener("submit", onVoteSubmit(wsClient));

  document
    .getElementById("show-results")
    .addEventListener("click", onShowResultsClick(wsClient));

  document
    .getElementById("start-new-session")
    .addEventListener("click", onStartNewSessionClick(wsClient));
};

export default setDOMEventListeners;
