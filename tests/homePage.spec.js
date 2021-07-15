const { test } = require("@playwright/test");

const { nanoid } = require("nanoid");

test.describe("The home page", () => {
  const homePage = `http://localhost:3000`;

  test("should redirect to the desired room", async ({ page }) => {
    const roomId = nanoid();

    await page.goto(homePage);

    await page.fill("input", roomId);

    await page.click('button:has-text("JOIN")');

    await page.waitForURL(`${homePage}/rooms/${roomId}`);
  });
});
