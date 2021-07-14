/* eslint-disable import/extensions */
import { createWebSocketConnection } from "./room-ws.js";
import { addEventListeners } from "./room-events-listeners.js";

const main = () => {
  addEventListeners(createWebSocketConnection());
};

main();
