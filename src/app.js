const path = require("path");

const express = require("express");
const { nanoid } = require("nanoid");

const viewsFolder = path.join(__dirname, "views");
const publicFolder = path.join(__dirname, "public");

const app = express();

app.set("views", viewsFolder);

app.set("view engine", "ejs");

app.post("/create-room", (req, res) => {
  const newRoomId = nanoid(6);

  res.setHeader("Location", `/?roomId=${newRoomId}`);

  res.status(303).end();
});

app.use(express.static(publicFolder));

app.get("/", (req, res) => {
  const { roomId } = req.query;

  res.render("index", { roomId });
});

app.get("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;

  res.render("room", { roomId });
});

exports.app = app;
