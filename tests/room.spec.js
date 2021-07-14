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

  test("when a new user joins a room, the participants in the other room should not be notified", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(
      `http://localhost:${process.env.SERVER_PORT}/rooms/other-room`
    );

    const user2Id = await user2Page.evaluate(() => window.__userId__);

    const notification = await user1Page.$(
      `text=User ${user2Id} joined the room`
    );

    expect(notification).toBeNull();
  });

  test("when a new user votes, the other participants should be notified", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    const user2Id = await user2Page.evaluate(() => window.__userId__);

    await user2Page.click("text='8'");
    await user2Page.click("text=Submit");

    const notification = await user1Page.$(`text=User ${user2Id} just voted`);

    expect(notification).not.toBeNull();
  });

  test("when the 'Show results' button is clicked, all the votes are displayed", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    const user1Id = await user2Page.evaluate(() => window.__userId__);
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    await user1Page.click("text='5'");
    await user1Page.click("text=Submit");

    await user2Page.click("text='8'");
    await user2Page.click("text=Submit");

    await user1Page.click("text=Show results");

    const resultsList = await user1Page.$("#results-list");

    const firstVote = resultsList.evaluate(
      (element) => element.firstChild.textContent
    );

    expect(firstVote).toBe(`text=${user1Id}: 5`);

    // const voteUser1Page1 = await user1Page.$(`text=${user1Id}: 5`);
    // const voteUser2Page1 = await user1Page.$(`text=${user2Id}: 8`);
    // const voteUser1Page2 = await user2Page.$(`text=${user1Id}: 5`);
    // const voteUser2Page2 = await user2Page.$(`text=${user2Id}: 8`);

    // expect(voteUser1Page1).not.toBeNull();
    // expect(voteUser2Page1).not.toBeNull();
    // expect(voteUser1Page2).not.toBeNull();
    // expect(voteUser2Page2).not.toBeNull();
  });
});
