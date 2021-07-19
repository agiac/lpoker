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
   * @type {() => void}
   */
  #onOpen;

  /**
   * @type {Map<string, (data: Object) => void>}
   */
  #listeners;

  /**
   * @type {number}
   */
  #reconnectionDelay;

  /**
   * @param {string} connectionString
   * @param {() => void} onOpen
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
      console.log(`Connection with ${this.#connectionString} open`);
      this.#reconnectionDelay = 1000;
      this.#onOpen();
    });

    this.#socket.addEventListener("error", (e) => {
      console.error(e);
      this.#socket.close();
    });

    this.#socket.addEventListener("close", () => {
      console.log(
        `Connection close. Attempting to reconnect in ${
          this.#reconnectionDelay / 1000
        } seconds`
      );
      setTimeout(() => {
        this.#connect();
      }, this.#reconnectionDelay);
      this.#reconnectionDelay *= 1.25;
    });

    this.#socket.addEventListener("message", (ev) => {
      const { event, data } = JSON.parse(ev.data);

      const listener = this.#listeners.get(event);

      if (listener) {
        listener(data);
      }
    });
  }

  /**
   * @param {string} event
   * @param {(data: Object) => void} cb
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
