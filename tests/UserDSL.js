class UserDSL {
  /**
   * @param {import("@playwright/test").Browser} browser
   */
  constructor(browser) {
    /**
     * @type {import("@playwright/test").Browser}
     */
    this.browser = browser;
  }

  async startSession() {
    const context = await this.browser.newContext();
    this.page = await context.newPage();
    return this;
  }

  /**
   * @param {string} roomId
   * @returns {Promise<string>}
   */
  async joinRoom(roomId) {
    await this.page?.goto(
      `http://localhost:${process.env.SERVER_PORT}/rooms/${roomId}`
    );
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return this.page.evaluate(() => window.__userId__);
  }

  /**
   * @param {string | number} vote
   */
  async vote(vote) {
    await this.page?.click(`text='${vote}'`);
    await this.page?.click("text=Submit");
  }

  async showResults() {
    await this.page?.click("text=Show results");
  }

  async startNewSession() {
    await this.page?.click("text=Start new session");
  }

  async cheat() {
    await this.page?.evaluate(() =>
      document.getElementById("cheat-btn")?.removeAttribute("disabled")
    );
    await this.page?.click('text="Cheat"');
  }

  /**
   * @param {string} query
   */
  query(query) {
    return this.page?.$(`text=${query}`);
  }
}

module.exports = UserDSL;
