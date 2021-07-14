const { nanoid } = require("nanoid");

const { test, expect } = require("@playwright/test");

test.describe("The room page", () => {
  const roomId = nanoid(6);

  const roomPage = `http://localhost:${process.env.SERVER_PORT}/rooms/${roomId}`;

  test("when a new user joins a room, the other participants should be notified", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    const notification = await user1Page.$(
      `text=User ${user2Id} joined the room`
    );

    expect(notification).not.toBeNull();
  });

  test("when a user leaves a room, the other participants should be notified", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    await user2Page.reload();

    const notification = await user1Page.$(
      `text=User ${user2Id} left the room`
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

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    const notification = await user1Page.$(
      `text=User ${user2Id} joined the room`
    );

    expect(notification).toBeNull();
  });

  test("when a user votes, the other participants should be notified", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    await user2Page.click("text='8'");
    await user2Page.click("text=Submit");

    const notification = await user1Page.$(`text=User ${user2Id} just voted`);

    expect(notification).not.toBeNull();
  });

  test("when the 'Show results' button is clicked, all the votes should be displayed", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user1Id = await user1Page.evaluate(() => window.__userId__);
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    await user1Page.click("text='5'");
    await user1Page.click("text=Submit");

    await user2Page.click("text='8'");
    await user2Page.click("text=Submit");

    await user1Page.click("text=Show results");

    expect(await user1Page.$(`text=${user1Id}: 5`)).not.toBeNull();
    expect(await user1Page.$(`text=${user2Id}: 8`)).not.toBeNull();
    expect(await user2Page.$(`text=${user1Id}: 5`)).not.toBeNull();
    expect(await user2Page.$(`text=${user2Id}: 8`)).not.toBeNull();
  });

  test("when the 'Start new session' button is clicked, the votes should be cleared", async ({
    browser,
  }) => {
    const user1Context = await browser.newContext();
    const user2Context = await browser.newContext();

    const user1Page = await user1Context.newPage();
    const user2Page = await user2Context.newPage();

    await user1Page.goto(roomPage);
    await user2Page.goto(roomPage);

    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user1Id = await user1Page.evaluate(() => window.__userId__);
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const user2Id = await user2Page.evaluate(() => window.__userId__);

    await user1Page.click("text='5'");
    await user1Page.click("text=Submit");

    await user2Page.click("text='8'");
    await user2Page.click("text=Submit");

    await user1Page.click("text=Show results");

    expect(await user1Page.$(`text=${user1Id}: 5`)).not.toBeNull();
    expect(await user1Page.$(`text=${user2Id}: 8`)).not.toBeNull();
    expect(await user2Page.$(`text=${user1Id}: 5`)).not.toBeNull();
    expect(await user2Page.$(`text=${user2Id}: 8`)).not.toBeNull();

    await user1Page.click("text=Start new session");

    expect(await user1Page.$(`text=${user1Id}: 5`)).toBeNull();
    expect(await user1Page.$(`text=${user2Id}: 8`)).toBeNull();
    expect(await user2Page.$(`text=${user1Id}: 5`)).toBeNull();
    expect(await user2Page.$(`text=${user2Id}: 8`)).toBeNull();
  });
});
