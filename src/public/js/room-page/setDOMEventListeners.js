/**
 * @typedef {import("./WSClient").WSClient} WSClient
 *
 * @typedef {(wsClient: WSClient) => EventListener} EventHandlerCreator
 */

/**
 * @type {EventHandlerCreator}
 */
const makeOnVoteSubmit = (wsClient) => (e) => {
  e.preventDefault();
  const formData = new FormData(/** @type {HTMLFormElement} */ (e.target));

  const vote = formData.get("vote");

  wsClient.sendEvent("vote", {
    vote,
  });
};

/**
 * @type {EventHandlerCreator}
 */
const makeOnShowResultsClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("show-results");
};

/**
 * @type {EventHandlerCreator}
 */
const makeOnStartNewSessionClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("new-session");
};

/**
 * @param {WSClient} wsClient
 */
export const setDOMEventListeners = (wsClient) => {
  document
    .getElementById("voting-form")
    ?.addEventListener("submit", makeOnVoteSubmit(wsClient));

  document
    .getElementById("show-results")
    ?.addEventListener("click", makeOnShowResultsClick(wsClient));

  document
    .getElementById("start-new-session")
    ?.addEventListener("click", makeOnStartNewSessionClick(wsClient));
};

export default setDOMEventListeners;
