// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
const { expect } = require("@playwright/test");

expect.extend({
  /**
   * @param {import("./tests/UserDSL")} userDSL
   * @param {string} text
   */
  async toSee(userDSL, text) {
    const pass = (await userDSL.page?.$(`text=${text}`)) !== null;
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    }
    return {
      message: () => "failed",
      pass: false,
    };
  },
});

module.exports = {
  timeout: 5000,
  globalSetup: require.resolve("./tests/global-setup"),
};
