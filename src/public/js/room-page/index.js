/* eslint-disable import/extensions */
import { createWebSocketConnection } from "./webSocket.js";
import { addEventListeners } from "./eventListeners.js";

const main = () => {
  addEventListeners(createWebSocketConnection());
};

main();
