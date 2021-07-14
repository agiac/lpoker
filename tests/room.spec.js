const { nanoid } = require("nanoid");

const { test, expect } = require("@playwright/test");

test.describe("The room page", () => {
  const roomId = nanoid(6);

  const roomPage = `http://localhost:${process.env.SERVER_PORT}/rooms/${roomId}`;

  test("should display the room ID", async ({ page }) => {
    await page.goto(roomPage);

    const roomName = await page.$(`text=Room: ${roomId}`);

    expect(roomName).not.toBeNull();
  });

  test("when a new user joins a room, the other participants should be notified", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    const user2Id = await user2Page.evaluate(() => window.__userId__);

    const notification = await user1Page.$(
      `text=User ${user2Id} joined the room`
    );

    expect(notification).not.toBeNull();
  });
});
