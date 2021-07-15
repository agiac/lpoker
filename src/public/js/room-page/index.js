// eslint-disable-next-line import/extensions
import { WSClient } from "./WSClient.js";
// eslint-disable-next-line import/extensions
import { setWSEventListeners } from "./setWSEventListeners.js";
// eslint-disable-next-line import/extensions
import { setDOMEventListeners } from "./setDOMEventListeners.js";

// @ts-ignore
const { __userId__: userId, __roomId__: roomId } = window;

const wsConnectionString = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${window.location.host}`;

const main = () => {
  const wsClient = new WSClient(wsConnectionString, (sendEvent) => {
    sendEvent("connected", {
      roomId,
      userId,
    });
  });

  setWSEventListeners(wsClient);

  setDOMEventListeners(wsClient);
};

main();
