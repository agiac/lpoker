const { App } = require("./app");

const server = App();

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("App listening on http://localhost:3000");
});
