export class WSClient {
  /**
   * @type {string}
   */
  #connectionString;

  /**
   * @type {string}
   */
  #roomId;

  /**
   * @type {string}
   */
  #senderId;

  /**
   * @type {WebSocket}
   */
  // @ts-ignore
  #socket;

  /**
   * @type {Map<string, (data: Record<string, any>) => void>}
   */
  #listeners = new Map();

  /**
   * @type {number}
   */
  #reconnectionDelay = 1000;

  /**
   * @param {string} connectionString
   * @param {string} roomId
   * @param {string} senderId
   */
  constructor(connectionString, roomId, senderId) {
    this.#connectionString = connectionString;
    this.#roomId = roomId;
    this.#senderId = senderId;
    this.#connect();
  }

  #connect() {
    this.#socket = new WebSocket(this.#connectionString);

    this.#socket.addEventListener("open", () => {
      // eslint-disable-next-line no-console
      console.log(`Connection with ${this.#connectionString} open`);
      this.#reconnectionDelay = 1000;
      this.sendEvent("connected");
    });

    this.#socket.addEventListener("error", (e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      this.#socket.close();
    });

    this.#socket.addEventListener("close", () => {
      // eslint-disable-next-line no-console
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
   * @param {(data: Record<string, any>) => void} cb
   */
  on(event, cb) {
    this.#listeners.set(event, cb);
    return this;
  }

  /**
   * @param {string} event
   * @param {Record<string, any>} [data = {}]
   */
  sendEvent(event, data = {}) {
    this.#socket.send(
      JSON.stringify({
        event,
        roomId: this.#roomId,
        senderId: this.#senderId,
        data,
      })
    );
  }
}

export default WSClient;
