const { test, expect } = require("@playwright/test");

test.describe("The home page", () => {
  test("should display the app name with an h1 tag", async ({ page }) => {
    await page.goto(`http://localhost:${process.env.SERVER_PORT}`);

    const titleTag = await page.$eval(
      "text=LPoker",
      (element) => element.tagName
    );

    expect(titleTag).toBe("H1");
  });
});
