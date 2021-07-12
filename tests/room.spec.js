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
});
