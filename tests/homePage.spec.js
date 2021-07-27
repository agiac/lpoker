// eslint-disable-next-line import/no-unresolved
const { humanId } = require("human-id");

const { test } = require("@playwright/test");

test.describe("The home page", () => {
  const homePage = `http://localhost:${process.env.SERVER_PORT}`;

  test("when the 'JOIN' button is clicked, it should redirect to the desired room", async ({
    page,
  }) => {
    const roomId = humanId();

    await page.goto(homePage);

    await page.fill("input", roomId);

    await page.click('button:has-text("JOIN")');

    await page.waitForURL(`${homePage}/rooms/${roomId}`);
  });
});
