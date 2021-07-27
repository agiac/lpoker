/**
 * @typedef {import("./WSClient").WSClient} WSClient
 *
 * @typedef {(wsClient: WSClient) => EventListener} EventHandlerCreator
 */

/**
 * @type {EventHandlerCreator}
 */
const makeOnVoteFormSubmit = (wsClient) => (e) => {
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
const makeOnShowResultsButtonClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("show-results");
};

/**
 * @type {EventHandlerCreator}
 */
const makeOnStartNewSessionButtonClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("new-session");
};

/**
 * @type {EventHandlerCreator}
 */
const makeOnCheatButtonClick = (wsClient) => (e) => {
  e.preventDefault();

  wsClient.sendEvent("cheat");
};

/**
 * @param {WSClient} wsClient
 */
export const setDOMEventListeners = (wsClient) => {
  document
    .getElementById("voting-form")
    ?.addEventListener("submit", makeOnVoteFormSubmit(wsClient));

  document
    .getElementById("show-results-btn")
    ?.addEventListener("click", makeOnShowResultsButtonClick(wsClient));

  document
    .getElementById("start-new-session-btn")
    ?.addEventListener("click", makeOnStartNewSessionButtonClick(wsClient));

  document
    .getElementById("cheat-btn")
    ?.addEventListener("click", makeOnCheatButtonClick(wsClient));
};

export default setDOMEventListeners;
