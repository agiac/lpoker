const http = require("http");

const { app } = require("../src/app");

module.exports = async () => {
  const server = http.createServer(app);

  await new Promise((done) => server.listen(done));

  // Expose port to the tests.
  // @ts-ignore
  process.env.SERVER_PORT = String(server.address().port);

  // Return the teardown function.
  return async () => {
    await new Promise((done) => server.close(done));
  };
};
