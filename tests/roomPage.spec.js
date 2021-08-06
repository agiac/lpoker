// eslint-disable-next-line import/no-unresolved
const { humanId } = require("human-id");

const { test, expect } = require("@playwright/test");

const UserDSL = require("./UserDSL");

test.describe("The room page", () => {
  const roomId = humanId();

  test("when a new user joins a room, him and the other participants should be notified", async ({
    browser,
  }) => {
    const user1 = await new UserDSL(browser).startSession();
    const user2 = await new UserDSL(browser).startSession();

    const user1Id = await user1.joinRoom(roomId);
    const user2Id = await user2.joinRoom(roomId);

    const user1Greeting = `text=Welcome ${user1Id}!`;
    const user1Notification = `text=User ${user2Id} joined the room`;
    const user2Greeting = `text=Welcome ${user2Id}!`;

    expect(user1.sees(user1Greeting)).resolves.toBeTruthy();
    expect(user1.sees(user1Notification)).resolves.toBeTruthy();
    expect(user2.sees(user2Greeting)).resolves.toBeTruthy();
  });

  test("when a user leaves a room, the other participants should be notified", async ({
    browser,
  }) => {
    const user1 = await new UserDSL(browser).startSession();
    const user2 = await new UserDSL(browser).startSession();

    const user1Id = await user1.joinRoom(roomId);
    await user2.joinRoom(roomId);

    await user1.page.close();

    const user2Notification = `text=User ${user1Id} left the room`;

    expect(user2.sees(user2Notification)).resolves.toBeTruthy();
  });

  test("when a user votes, him and the other participants should be notified", async ({
    browser,
  }) => {
    const user1 = await new UserDSL(browser).startSession();
    const user2 = await new UserDSL(browser).startSession();

    const user1Id = await user1.joinRoom(roomId);
    await user2.joinRoom(roomId);

    await user1.vote(8);

    const user1Notification = `Your vote has been received`;
    const user2Notification = `User ${user1Id} just voted`;

    expect(user1.sees(user1Notification)).resolves.toBeTruthy();
    expect(user2.sees(user2Notification)).resolves.toBeTruthy();
  });

  test("when the 'Show results' button is clicked, all the votes should be displayed", async ({
    browser,
  }) => {
    const user1 = await new UserDSL(browser).startSession();
    const user2 = await new UserDSL(browser).startSession();

    const user1Id = await user1.joinRoom(roomId);
    const user2Id = await user2.joinRoom(roomId);

    await user1.vote(5);
    await user2.vote(8);

    await user1.showResults();

    const user1Notification = `Your request has been received`;
    const user1Vote = `${user1Id}: 5`;
    const user2Notification = `User ${user1Id} requested to see the results`;
    const user2Vote = `${user2Id}: 8`;

    expect(user1.sees(user1Notification)).resolves.toBeTruthy();
    expect(user1.sees(user1Vote)).resolves.toBeTruthy();
    expect(user1.sees(user2Vote)).resolves.toBeTruthy();
    expect(user2.sees(user2Notification)).resolves.toBeTruthy();
    expect(user2.sees(user1Vote)).resolves.toBeTruthy();
    expect(user2.sees(user2Vote)).resolves.toBeTruthy();
  });

  test("when the 'Start new session' button is clicked, the votes should be cleared", async ({
    browser,
  }) => {
    const user1 = await new UserDSL(browser).startSession();
    const user2 = await new UserDSL(browser).startSession();

    const user1Id = await user1.joinRoom(roomId);
    const user2Id = await user2.joinRoom(roomId);

    await user1.vote(5);
    await user2.vote(8);

    await user1.showResults();

    await user1.startNewSession();

    const user1Notification = `Your request has been received`;
    const user1Vote = `${user1Id}: 5`;
    const user2Notification = `User ${user1Id} requested to start a new session`;
    const user2Vote = `${user2Id}: 8`;

    expect(user1.sees(user1Notification)).resolves.toBeTruthy();
    expect(user1.sees(user1Vote)).resolves.not.toBeTruthy();
    expect(user1.sees(user2Vote)).resolves.not.toBeTruthy();
    expect(user2.sees(user2Notification)).resolves.toBeTruthy();
    expect(user2.sees(user1Vote)).resolves.not.toBeTruthy();
    expect(user2.sees(user2Vote)).resolves.not.toBeTruthy();
  });

  test("should have the 'Cheat' button disabled by default", async ({
    browser,
  }) => {
    const user = await new UserDSL(browser).startSession();

    await user.joinRoom(roomId);

    const cheatButton = await user.query("Cheat");

    const isDisabled = await cheatButton.evaluate(
      (element) => element.getAttribute("disabled") !== null
    );

    expect(isDisabled).toBeTruthy();
  });

  test("it should show the results only to the user who clicked the 'Cheat' button and the other users should be notified", async ({
    browser,
  }) => {
    const user1 = await new UserDSL(browser).startSession();
    const user2 = await new UserDSL(browser).startSession();

    const user1Id = await user1.joinRoom(roomId);
    const user2Id = await user2.joinRoom(roomId);

    await user2.vote(8);

    await user1.cheat();

    const user1Notification = `Hehe...`;
    const user2Notification = `${user1Id} just cheated`;
    const user2Vote = `${user2Id}: 8`;

    expect(user1.sees(user1Notification)).resolves.toBeTruthy();
    expect(user1.sees(user2Vote)).resolves.toBeTruthy();
    expect(user2.sees(user2Notification)).resolves.toBeTruthy();
    expect(user2.sees(user2Vote)).resolves.not.toBeTruthy();
  });
});
