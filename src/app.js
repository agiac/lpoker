const http = require("http");
const path = require("path");

const express = require("express");

const { createWebSocketServer } = require("./ws");
const { router } = require("./router");

const viewsFolder = path.join(__dirname, "views");
const publicFolder = path.join(__dirname, "public");

const App = () => {
  const app = express();

  app.set("views", viewsFolder);

  app.set("view engine", "ejs");

  app.use(express.static(publicFolder));

  app.use(router);

  const server = http.createServer(app);

  createWebSocketServer(server);

  return server;
};

exports.App = App;
