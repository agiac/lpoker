const { App } = require("../src/app");

module.exports = async () => {
  const server = App();

  await new Promise((done) => server.listen(done));

  // @ts-ignore
  process.env.SERVER_PORT = String(server.address().port);

  return async () => {
    await new Promise((done) => server.close(done));
  };
};
