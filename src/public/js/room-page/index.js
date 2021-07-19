import { WSClient } from "./WSClient.js";
import { setWSEventListeners } from "./setWSEventListeners.js";
import { setDOMEventListeners } from "./setDOMEventListeners.js";

// @ts-ignore
const { __userId__: userId, __roomId__: roomId } = window;

const wsConnectionString = `${
  window.location.protocol === "https:" ? "wss" : "ws"
}://${window.location.host}`;

const main = () => {
  const wsClient = new WSClient(wsConnectionString, () => {
    wsClient.sendEvent("connected", {
      roomId,
      userId,
    });
  });

  setWSEventListeners(wsClient);

  setDOMEventListeners(wsClient);
};

main();
