const { test, expect } = require("@playwright/test");

test.describe("The home page", () => {
  const homePage = `http://localhost:${process.env.SERVER_PORT}`;

  test("should display the app name", async ({ page }) => {
    await page.goto(homePage);

    const title = await page.$("text=LPoker");

    expect(title).not.toBeNull();
  });

  test("should allow to create and join a new room", async ({ page }) => {
    await page.goto(homePage);

    await page.click("text=Create new room");

    await page.click("text=Room created: follow me");

    await page.waitForURL(`${homePage}/**`);
  });
});
