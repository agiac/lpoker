export class WSClient {
  /**
   * @type {string}
   */
  #connectionString;

  /**
   * @type {WebSocket}
   */
  #socket;

  /**
   * @type {(sendEvent: (event: string, data: Object) => void) => void}
   */
  #onOpen;

  /**
   * @type {Map<string, (data: Object, sendEvent: (event: string, data: Object) => void) => void>}
   */
  #listeners;

  /**
   * @type {number}
   */
  #reconnectionDelay;

  /**
   * @param {string} connectionString
   * @param {(sendEvent: (event: string, data: Object) => void) => void} onOpen
   */
  constructor(connectionString, onOpen) {
    this.#connectionString = connectionString;
    this.#onOpen = onOpen;
    this.#listeners = new Map();
    this.#reconnectionDelay = 1000;
    this.#connect();
  }

  #connect() {
    this.#socket = new WebSocket(this.#connectionString);

    this.#socket.addEventListener("open", () => {
      this.#reconnectionDelay = 1000;
      this.#onOpen(this.sendEvent.bind(this));
    });

    this.#socket.addEventListener("error", () => {
      this.#socket.close();
    });

    this.#socket.addEventListener("close", () => {
      setTimeout(() => {
        this.#connect();
      }, this.#reconnectionDelay);
      this.#reconnectionDelay *= 1.25;
    });

    this.#socket.addEventListener("message", (ev) => {
      const { event, data } = JSON.parse(ev.data);

      const listener = this.#listeners.get(event);

      if (listener) {
        listener(data, this.sendEvent.bind(this));
      }
    });
  }

  /**
   * @param {string} event
   * @param {(data: Object, sendEvent: (event: string, data: Object) => void) => void} cb
   */
  on(event, cb) {
    this.#listeners.set(event, cb);
  }

  /**
   * @param {string} event
   * @param {Object} data
   */
  sendEvent(event, data) {
    this.#socket.send(
      JSON.stringify({
        event,
        data,
      })
    );
  }
}
